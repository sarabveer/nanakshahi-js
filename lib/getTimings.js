const suncalc = require( 'suncalc' )

/**
 * Return Date with time in Timezone
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
 * Get Sun and Moon times for location
 * @param {Object} date JavaScript Date() Object
 * @param {string} [timezone=Asia/Kolkata] Timezone of Location. Default is IST.
 * @param {!number} [latitude=31.6] Latitude of Location. Default is Amritsar.
 * @param {!number} [longitude=74.9] Longitude of Location. Default is Amritsar.
 * @return {Object} Sun and Moon times
 * @example getTimings( new Date() )
 */
function getTimings( date, timezone = 'Asia/Kolkata', latitude = 31.6, longitude = 74.9 ) {
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

  // Create Return Object
  const calculatedTimings = {
    date,
    timezone,
    sun,
    moon,
  }

  return calculatedTimings
}

module.exports = getTimings
