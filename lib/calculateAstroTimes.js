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
 * @return {Object} Astronomical values for the Sun and Moon in Universal Time.
 * @example calculateAstroTimes( new Date() )
 */

const calculateAstroTimes = ( date = new Date() ) => {
  // Get R.D. from Unix timestamp
  const fixed = Math.floor(
    standardFromUniversal( momentFromUnix( date.getTime() / 1000 ), AMRITSAR ),
  )

  // Sunrise and Sunset Moment
  const sunriseMoment = universalFromStandard( sunrise( fixed, AMRITSAR ), AMRITSAR )
  const sunsetMoment = universalFromStandard( sunset( fixed, AMRITSAR ), AMRITSAR )
  const nextSunrise = universalFromStandard( sunrise( fixed + 1, AMRITSAR ), AMRITSAR )

  // Noon and Midnight
  const noon = midday( fixed, AMRITSAR )
  const midnightMoment = midnight( fixed + 1, AMRITSAR )

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
  const previousPeharNight = ( sunriseMoment - midnight( fixed, AMRITSAR ) ) / 2

  // Amritvela Time (Use previous sunset)
  const amritvela = sunriseMoment - previousPeharNight

  // Lunar Phase
  const phase = { ...lunarPhases[ step( lunarPhase( fixed ) / 360 ) ] }
  delete phase.length

  return {
    input: date,
    sun: {
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
