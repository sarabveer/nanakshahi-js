const { lunarPhases } = require( './consts' )

// Import Calendrica 4.0
const {
  astronomy: {
    universalFromStandard,
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
  const fixed = momentFromUnix( Math.round( date.getTime() / 1000 ) )

  // Amritvela Moment
  const sunriseMoment = sunrise( fixed, AMRITSAR )
  const amritvela = sunriseMoment - ( ( sunriseMoment - sunset( fixed - 1, AMRITSAR ) ) / 4 )

  // Lunar Phase
  const phase = { ...lunarPhases[ step( lunarPhase( fixed ) / 360 ) ] }
  delete phase.length

  return {
    input: date,
    sun: {
      amritvela: new Date(
        unixFromMoment( universalFromStandard( amritvela, AMRITSAR ) ) * 1000,
      ),
      sunrise: new Date(
        unixFromMoment( universalFromStandard( sunriseMoment, AMRITSAR ) ) * 1000,
      ),
      noon: new Date( unixFromMoment( midday( fixed, AMRITSAR ) ) * 1000 ),
      sunset: new Date(
        unixFromMoment( universalFromStandard( sunset( fixed, AMRITSAR ), AMRITSAR ) ) * 1000,
      ),
    },
    moon: {
      newMoon: new Date( unixFromMoment( newMoonAtOrAfter( fixed ) ) * 1000 ),
      fullMoon: new Date( unixFromMoment( lunarPhaseAtOrAfter( 180, fixed ) ) * 1000 ),
      phase,
    },
  }
}

module.exports = calculateAstroTimes
