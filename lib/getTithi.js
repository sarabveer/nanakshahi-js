const suncalc = require( 'suncalc' )
const toUnicodeNum = require( './toUnicodeNum' )
const calendarNames = require( './calendarNames' )

const phases = [
  { emoji: '🌑', name: 'New Moon' },
  { emoji: '🌒', name: 'Waxing Crescent' },
  { emoji: '🌓', name: 'First Quarter' },
  { emoji: '🌔', name: 'Waxing Gibbous' },
  { emoji: '🌕', name: 'Full Moon' },
  { emoji: '🌖', name: 'Waning Gibbous' },
  { emoji: '🌗', name: 'Last Quarter' },
  { emoji: '🌘', name: 'Waning Crescent' },
  { emoji: '🌑', name: 'New Moon' },
]

/**
 * Get Tithi and other Moon/Lunar Info
 * @param {Object} date JavaScript Date() Object
 * @return {Object} Tithi and Moon Info
 * @example getTithi( new Date() )
 */
function getTithi( date ) {
  // Get Moon Phase and Illumination
  const { phase, fraction } = suncalc.getMoonIllumination( date )

  // Get Tithi, Paksh, and Tithi Name
  const tithi = phase * 30
  let tithiDay = Math.trunc( tithi ) + 1
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
    tithiDay: {
      pa: toUnicodeNum( tithiDay ),
      en: tithiDay,
    },
    paksh,
    tithiName,
    tithiFraction: tithi % 1,
    phase: phases[ Math.round( phase * 8 ) ],
    moonIllumination: fraction,
  }

  return calculatedTithi
}

module.exports = getTithi
