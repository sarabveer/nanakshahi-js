const { lunarPhases } = require( './consts' )

// Import Calendrica 4.0
const {
  astronomy: {
    universalFromStandard,
    midday,
    lunarPhase,
    newMoonBefore,
    newMoonAtOrAfter,
    sunrise,
    sunset,
  },
  general: { invertAngular, momentFromUnix, unixFromMoment },
  modernHindu: { AMRITSAR },
} = require( './calendrica' )

// Step out phases of the Moon with length of phase
const step = angle => {
  const length = lunarPhases.reduce( ( a, b ) => a + b.length, 0 )

  let p = angle * length
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

  // Calculate Next New/Fullmoon
  const previousNewMoon = newMoonBefore( fixed )
  const nextNewMoon = newMoonAtOrAfter( fixed )

  // Lunar Phase
  const phase = lunarPhases[ step( lunarPhase( fixed ) / 360 ) ]
  delete phase.length

  return {
    input: date,
    sun: {
      sunrise: new Date(
        unixFromMoment( universalFromStandard( sunrise( fixed, AMRITSAR ), AMRITSAR ) ) * 1000,
      ),
      noon: new Date( unixFromMoment( midday( fixed, AMRITSAR ) ) * 1000 ),
      sunset: new Date(
        unixFromMoment( universalFromStandard( sunset( fixed, AMRITSAR ), AMRITSAR ) ) * 1000,
      ),
    },
    moon: {
      newMoon: new Date( unixFromMoment( nextNewMoon ) * 1000 ),
      fullMoon: new Date( unixFromMoment(
        invertAngular( lunarPhase, 180, previousNewMoon, nextNewMoon ),
      ) * 1000 ),
      phase,
    },
  }
}

module.exports = calculateAstroTimes