const suncalc = require( 'suncalc' )
const toUnicodeNum = require( './toUnicodeNum' )
const calendarNames = require( './calendarNames' )

/**
 * @private
 */
function formatTime( date, timezone ) {
  let time

  try {
    time = date.toLocaleString( 'en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' } )
  } catch ( e ) {
    time = 'None'
  }

  return time
}

/**
 * Get Tithi and Sun and Moon times for location
 * @param {Object} date JavaScript Date() Object
 * @param {string} [timezone=Asia/Kolkata] Timezone of Location. Default is IST.
 * @param {!number} [latitude=31.6] Latitude of Location. Default is Amritsar.
 * @param {!number} [longitude=74.9] Longitude of Location. Default is Amritsar.
 * @return {Object} Tithi and Sun and Moon times
 * @example getTithi( new Date() )
 */
function getTithi( date, timezone = 'Asia/Kolkata', latitude = 31.6, longitude = 74.9 ) {
  // Get Sun Times
  const { sunrise, solarNoon, sunset } = suncalc.getTimes( date, latitude, longitude )
  const sun = {
    sunrise: formatTime( sunrise, timezone ),
    solarnoon: formatTime( solarNoon, timezone ),
    sunset: formatTime( sunset, timezone ),
  }

  // Get Moon Times
  const { rise, set } = suncalc.getMoonTimes( date, latitude, longitude )
  const moon = {
    moonrise: formatTime( rise, timezone ),
    moonset: formatTime( set, timezone ),
  }

  // Get Tithi
  const { phase, fraction } = suncalc.getMoonIllumination( date )
  const tithi = phase * 30
  let tithiDay = Math.trunc( tithi ) + 1

  // Get Paksh and Tithi Name
  let paksh
  if ( tithiDay > 15 ) {
    paksh = calendarNames.paksh.vadi
    tithiDay -= 15
  } else {
    paksh = calendarNames.paksh.sudi
  }

  let tithiName
  if ( tithiDay === 15 && paksh.en === 'Vadi' ) {
    tithiName = calendarNames.tithi[ 15 ] // eslint-disable-line prefer-destructuring
  } else {
    tithiName = calendarNames.tithi[ tithiDay - 1 ]
  }

  // Create Return Object
  const calculatedTithi = {
    date,
    timezone,
    times: {
      sun,
      moon,
    },
    tithi: {
      tithiDay: {
        pa: toUnicodeNum( tithiDay ),
        en: tithiDay,
      },
      paksh,
      tithiName,
      tithiFraction: tithi % 1,
    },
    moonIllumination: fraction,
  }

  return calculatedTithi
}

module.exports = getTithi
