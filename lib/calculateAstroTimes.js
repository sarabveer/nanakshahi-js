const { lunarPhases, raagTimes } = require( './consts' )

// Import Calendrica 4.0
const {
  astronomy: {
    standardFromUniversal,
    universalFromStandard,
    midnight,
    midday,
    MEAN_SYNODIC_MONTH,
    lunarPhase,
    lunarPhaseAtOrAfter,
    newMoonAtOrAfter,
    sunrise,
    sunset,
  },
  general: { momentFromUnix, unixFromMoment },
  modernHindu: { AMRITSAR },
} = require( './calendrica' )

// Step out phases of the Moon with length of phase
const step = angle => {
  let p = angle * MEAN_SYNODIC_MONTH
  let correctPhase

  lunarPhases.every( ( phase, index ) => {
    p -= phase.length
    correctPhase = index
    if ( p <= 0 ) { return false }
    return true
  } )

  return correctPhase
}

/**
 * Calculates astronomical times for the Sun and Moon (at Amritsar)
 * @param {Object} [date=new Date()] JavaScript Date() Object
 * @param {Object} [location=AMRITSAR]
 * Object that contains four required values:<br>
 * `latitude` - Latitude (in Decimal)<br>
 * `longitude` - Longitude (in Decimal)<br>
 * `elevation` - Elevation (in Meters), should be set to `0`.<br>
 * `zone` - Timezone (in Decimal). For example, UTC-5 would be `-5`.
 * @return {Object} Astronomical values for the Sun and Moon in Universal Time.
 * @example calculateAstroTimes( new Date() )
 */

const calculateAstroTimes = ( date = new Date(), location = AMRITSAR ) => {
  // Get R.D. from Unix timestamp
  const fixed = Math.floor(
    standardFromUniversal( momentFromUnix( date.getTime() / 1000 ), location ),
  )

  // Sunrise and Sunset Moment
  const sunriseMoment = universalFromStandard( sunrise( fixed, location ), location )
  const sunsetMoment = universalFromStandard( sunset( fixed, location ), location )
  const nextSunrise = universalFromStandard( sunrise( fixed + 1, location ), location )

  // Noon and Midnight
  const noon = midday( fixed, location )
  const midnightMoment = midnight( fixed + 1, location )

  // Pehar Lengths
  // From Sunrise to Noon
  const peharDay1 = ( noon - sunriseMoment ) / 2
  // From Noon to Sunset
  const peharDay2 = ( sunsetMoment - noon ) / 2
  // From Sunset to Midnight
  const peharNight1 = ( midnightMoment - sunsetMoment ) / 2
  // From Midnight to Next Sunrise
  const peharNight2 = ( nextSunrise - midnightMoment ) / 2
  // From previous Midnight to Sunrise (for Amritvela)
  const previousPeharNight = ( sunriseMoment - midnight( fixed, location ) ) / 2

  // Amritvela Time (Use previous sunset)
  const amritvela = sunriseMoment - previousPeharNight
  // Wake up Sava-Pehar (1.25) Pehar before Sunrise - Bhai Sahib Randhir Singh Jee
  const savaPehar = sunriseMoment - ( previousPeharNight * 1.25 )

  // Lunar Phase
  const phase = { ...lunarPhases[ step( lunarPhase( fixed ) / 360 ) ] }
  delete phase.length

  return {
    input: date,
    sun: {
      savaPehar: new Date( unixFromMoment( savaPehar ) * 1000 ),
      amritvela: new Date( unixFromMoment( amritvela ) * 1000 ),
      sunrise: new Date( unixFromMoment( sunriseMoment ) * 1000 ),
      noon: new Date( unixFromMoment( noon ) * 1000 ),
      sunset: new Date( unixFromMoment( sunsetMoment ) * 1000 ),
      midnight: new Date( unixFromMoment( midnightMoment ) * 1000 ),
    },
    moon: {
      newMoon: new Date( unixFromMoment( newMoonAtOrAfter( fixed ) ) * 1000 ),
      fullMoon: new Date( unixFromMoment( lunarPhaseAtOrAfter( 180, fixed ) ) * 1000 ),
      phase,
    },
    pehar: {
      day: [
        {
          name: {
            pa: 'ਦਿਨ ਦਾ ਪਹਿਲਾ ਪਹਿਰ',
            en: 'First Quarter of the Day',
          },
          start: new Date( unixFromMoment( sunriseMoment ) * 1000 ),
          end: new Date( unixFromMoment( sunriseMoment + peharDay1 * 1000 ) ),
          raags: raagTimes.day[ 0 ],
        },
        {
          name: {
            pa: 'ਦਿਨ ਦਾ ਦੂਜਾ ਪਹਿਰ',
            en: 'Second Quarter of the Day',
          },
          start: new Date( unixFromMoment( noon - peharDay1 * 1000 ) ),
          end: new Date( unixFromMoment( noon ) * 1000 ),
          raags: raagTimes.day[ 1 ],
        },
        {
          name: {
            pa: 'ਦਿਨ ਦਾ ਤੀਜਾ ਪਹਿਰ',
            en: 'Third Quarter of the Day',
          },
          start: new Date( unixFromMoment( noon ) * 1000 ),
          end: new Date( unixFromMoment( noon + peharDay2 ) * 1000 ),
          raags: raagTimes.day[ 2 ],
        },
        {
          name: {
            pa: 'ਦਿਨ ਦਾ ਚੌਥਾ ਪਹਿਰ',
            en: 'Fourth Quarter of the Day',
          },
          start: new Date( unixFromMoment( sunsetMoment - peharDay2 ) * 1000 ),
          end: new Date( unixFromMoment( sunsetMoment ) * 1000 ),
          raags: raagTimes.day[ 3 ],
        },
      ],
      night: [
        {
          name: {
            pa: 'ਰਾਤ ਦਾ ਪਹਿਲਾ ਪਹਿਰ',
            en: 'First Quarter of the Night',
          },
          start: new Date( unixFromMoment( sunsetMoment ) * 1000 ),
          end: new Date( unixFromMoment( sunsetMoment + peharNight1 ) * 1000 ),
          raags: raagTimes.night[ 0 ],
        },
        {
          name: {
            pa: 'ਰਾਤ ਦਾ ਦੂਜਾ ਪਹਿਰ',
            en: 'Second Quarter of the Night',
          },
          start: new Date( unixFromMoment( midnightMoment - peharNight1 ) * 1000 ),
          end: new Date( unixFromMoment( midnightMoment ) * 1000 ),
          raags: raagTimes.night[ 1 ],
        },
        {
          name: {
            pa: 'ਰਾਤ ਦਾ ਤੀਜਾ ਪਹਿਰ',
            en: 'Third Quarter of the Night',
          },
          start: new Date( unixFromMoment( midnightMoment ) * 1000 ),
          end: new Date( unixFromMoment( midnightMoment + peharNight2 ) * 1000 ),
          raags: raagTimes.night[ 2 ],
        },
        {
          name: {
            pa: 'ਰਾਤ ਦਾ ਚੌਥਾ ਪਹਿਰ',
            en: 'Fourth Quarter of the Night',
          },
          start: new Date( unixFromMoment( nextSunrise - peharNight2 ) * 1000 ),
          end: new Date( unixFromMoment( nextSunrise ) * 1000 ),
          raags: raagTimes.night[ 3 ],
        },
      ],
    },
  }
}

module.exports = calculateAstroTimes
