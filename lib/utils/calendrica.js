/*
  CALENDRICA 4.0 -- Common Lisp
  Copyright (C) E. M. Reingold and N. Dershowitz
*/

const {
  HINDU_SIDEREAL_YEAR,
  HINDU_SIDEREAL_MONTH,
  HINDU_SYNODIC_MONTH,
  HINDU_EPOCH,
  HINDU_CREATION,
  HINDU_ANOMALISTIC_YEAR,
  HINDU_ANOMALISTIC_MONTH,
} = require( '../consts/calendrica' )

// Return an angle data structure from d degrees, m arcminutes and s arcseconds.
const angle = ( d, m, s ) => d + ( ( m + ( s / 60 ) ) / 60 )

// Locations
const UJJAIN = {
  latitude: angle( 23, 9, 0 ),
  longitude: angle( 75, 46, 6 ),
}

const AMRITSAR = {
  latitude: angle( 31, 37, 12 ),
  longitude: angle( 74, 52, 34 ),
}

const HINDU_LOCATION = AMRITSAR

// Converts Angle from Degrees to Radians
const toRadians = angle => angle * ( Math.PI / 180 )

// Return first integer greater or equal to initial index, i, such that condition, p, holds.
const next = ( i, p ) => {
  if ( p( i ) ) {
    return i
  }
  return next( i + 1, p )
}

// Return the same as x % y with y instead of 0.
const amod = ( x, y ) => ( ( x % y ) === 0 ? y : ( x % y ) )

// The value of x shifted into the range [a..b). Returns x if a=b.
const mod3 = ( x, a, b ) => {
  if ( a === b ) {
    return x
  }
  return a + ( ( x - a ) % ( b - a ) )
}

// Bisection search for x in [lo, hi] such that condition 'e' holds.
// p determines when to go left.
const binarySearch = ( lo, hi, p, e ) => {
  const x = ( lo + hi ) / 2
  if ( p( lo, hi ) ) {
    return x
  } if ( e( x ) ) {
    return binarySearch( lo, x, p, e )
  }
  return binarySearch( x, hi, p, e )
}

// Find inverse of angular function 'f' at 'y' within interval [a,b].
// Default precision is 0.00001
const invertAngular = ( f, y, a, b, prec = 10 ** -5 ) => {
  const p = ( l, h ) => ( h - l ) <= prec
  const e = x => ( ( f( x ) - y ) % 360 ) < 180
  return binarySearch( a, b, p, e )
}

// This simulates the Hindu sine table.
// entry is an angle given as a multiplier of 225'.
const hinduSineTable = entry => {
  const exact = 3438 * Math.sin( toRadians( entry * angle( 0, 225, 0 ) ) )
  const error = 0.215 * Math.sign( exact ) * Math.sign( Math.abs( exact ) - 1716 )
  return Math.round( exact + error ) / 3438
}

// Linear interpolation for theta in Hindu table.
const hinduSine = theta => {
  const entry = theta / angle( 0, 225, 0 )
  const fraction = entry % 1
  return ( ( fraction * hinduSineTable( Math.ceil( entry ) ) )
  + ( ( 1 - fraction ) * hinduSineTable( Math.floor( entry ) ) ) )
}

// Inverse of Hindu sine function
const hinduArcsin = amp => {
  if ( amp < 0 ) {
    return -hinduArcsin( -amp )
  }
  const p = k => amp <= hinduSineTable( k )
  const pos = next( 0, p )
  const below = hinduSineTable( pos - 1 )
  return ( angle( 0, 225, 0 ) * ( pos - 1
    + ( ( amp - below ) / ( hinduSineTable( pos ) - below ) ) ) )
}

// Return the position in degrees at moment, tee, in uniform circular orbit of period days.
const hinduMeanPosition = ( tee, period ) => 360 * ( ( ( tee - HINDU_CREATION ) / period ) % 1 )

// Return the longitudinal position at moment, tee.
// period is the period of mean motion in days.
// size is ratio of radii of epicycle and deferent.
// anomalistic is the period of retrograde revolution about epicycle.
// change is maximum decrease in epicycle size.
const hinduTruePosition = ( tee, period, size, anomalistic, change ) => {
  const lambda = hinduMeanPosition( tee, period )
  const offset = hinduSine( hinduMeanPosition( tee, anomalistic ) )
  const contraction = Math.abs( offset ) * change * size
  const equation = hinduArcsin( offset * ( size - contraction ) )
  return ( lambda - equation ) % 360
}

// Return the solar longitude at moment, tee.
const hinduSolarLongitude = tee => hinduTruePosition( tee,
  HINDU_SIDEREAL_YEAR,
  14 / 360,
  HINDU_ANOMALISTIC_YEAR,
  1 / 42 )

// Return the zodiacal sign of the sun, as integer in range 1..12, at moment tee.
const hinduZodiac = tee => Math.floor( hinduSolarLongitude( tee ) / 30 ) + 1

// Return the lunar longitude at moment, tee.
const hinduLunarLongitude = tee => hinduTruePosition( tee,
  HINDU_SIDEREAL_MONTH,
  32 / 360,
  HINDU_ANOMALISTIC_MONTH,
  1 / 96 )

// Return the longitudinal distance between the sun and moon at moment, tee.
// Tithi
const hinduLunarPhase = tee => ( hinduLunarLongitude( tee )
  - hinduSolarLongitude( tee ) ) % 360

// Return the phase of moon (tithi) at moment, tee, as an integer in the range 1..30.
const hinduLunarDayFromMoment = tee => Math.floor( hinduLunarPhase( tee ) / 12 ) + 1

// Return the approximate moment of last new moon preceding moment,
// tee, close enough to determine zodiacal sign.
const hinduNewMoonBefore = tee => {
  const varepsilon = 2 ** -1000
  const tau = tee - ( ( 1 / 360 )
    * hinduLunarPhase( tee )
    * HINDU_SYNODIC_MONTH )
  const p = ( l, u ) => ( ( hinduZodiac( l ) === hinduZodiac( u ) )
    || ( ( u - l ) < varepsilon ) )
  const e = x => hinduLunarPhase( x ) < 180
  return binarySearch( tau - 1, Math.min( tee, tau + 1 ), p, e )
}

// Return the time lunar_day (tithi) number, k, begins at or after moment, tee.
// k can be fractional (for karanas).
const hinduLunarDayAtOrAfter = ( k, tee ) => {
  const phase = ( k - 1 ) * 12
  const tau = tee + ( 1 / 360 )
    * ( ( phase - hinduLunarPhase( tee ) ) % 360 )
    * HINDU_SYNODIC_MONTH
  const a = Math.max( tee, tau - 2 )
  const b = tau + 2
  return invertAngular( hinduLunarPhase, phase, a, b )
}

// Return the solar year at given moment, tee.
// Kali Yuga Era
const hinduCalendarYear = tee => Math.round( ( ( tee - HINDU_EPOCH ) / HINDU_SIDEREAL_YEAR )
    - ( hinduSolarLongitude( tee ) / 360 ) )

// Return the sidereal daily motion of sun on date, date.
const hinduDailyMotion = date => {
  const meanMotion = 360 / HINDU_SIDEREAL_YEAR
  const anomaly = hinduMeanPosition( date, HINDU_ANOMALISTIC_YEAR )
  const epicycle = 14 / 360 - Math.abs( hinduSine( anomaly ) ) / 1080
  const entry = Math.floor( anomaly / angle( 0, 225, 0 ) )
  const sineTableStep = hinduSineTable( entry + 1 ) - hinduSineTable( entry )
  const factor = -3438 / 225 * sineTableStep * epicycle
  return meanMotion * ( factor + 1 )
}

// Hindu tropical longitude on fixed $date$.
// Assumes precession with maximum of 27 degrees and period of 7200 sidereal years
// (= 1577917828/600 days).
const hinduTropicalLongitude = date => {
  const days = Math.floor( date - HINDU_EPOCH )
  const precession = 27 - Math.abs( 108
    * mod3( ( ( 600 / 1577917828 * days ) - ( 1 / 4 ) ), -1 / 2, 1 / 2 ) )
  return ( hinduSolarLongitude( date ) - precession ) % 360
}

// Difference between right and oblique ascension of sun on date at location.
const hinduAscensionalDifference = ( date, location ) => {
  const sinDelta = ( 1397 / 3438 ) * hinduSine( hinduTropicalLongitude( date ) )
  const phi = location.latitude
  const diurnalRadius = hinduSine( 90 + hinduArcsin( sinDelta ) )
  const tanPhi = hinduSine( phi ) / hinduSine( 90 + phi )
  const earthSine = sinDelta * tanPhi
  return hinduArcsin( -earthSine / diurnalRadius )
}

//  Tabulated speed of rising of current zodiacal sign on date.
const hinduRisingSign = date => {
  const i = Math.floor( hinduTropicalLongitude( date ) / 30 )
  return [ 1670 / 1800, 1795 / 1800, 1935 / 1800, 1935 / 1800, 1795 / 1800, 1670 / 1800 ][ i % 6 ]
}

// Return the difference between solar and sidereal day on date.
const hinduSolarSiderealDifference = date => hinduDailyMotion( date )
  * hinduRisingSign( date )

// Time from true to mean midnight of date.
const hinduEquationOfTime = date => {
  const offset = hinduSine( hinduMeanPosition( date, HINDU_ANOMALISTIC_YEAR ) )
  const equationSun = offset * angle( 57, 18, 0 )
    * ( ( 14 / 360 ) - ( Math.abs( offset ) / 1080 ) )
  return ( ( hinduDailyMotion( date ) / 360 )
    * ( equationSun / 360 )
    * HINDU_SIDEREAL_YEAR )
}

// Return the sunrise at hindu_location on date
const hinduSunrise = date => date + 6 / 24
    + ( ( UJJAIN.longitude - HINDU_LOCATION.longitude ) / 360 )
    - hinduEquationOfTime( date )
    + ( 1577917828 / ( 1582237828 * 360 ) )
    * ( hinduAscensionalDifference( date, HINDU_LOCATION )
    + ( 1 / 4 * hinduSolarSiderealDifference( date ) ) )

module.exports = {
  angle,
  UJJAIN,
  AMRITSAR,
  HINDU_LOCATION,
  toRadians,
  next,
  amod,
  mod3,
  binarySearch,
  invertAngular,
  hinduSineTable,
  hinduSine,
  hinduArcsin,
  hinduMeanPosition,
  hinduTruePosition,
  hinduSolarLongitude,
  hinduZodiac,
  hinduLunarLongitude,
  hinduLunarPhase,
  hinduLunarDayFromMoment,
  hinduNewMoonBefore,
  hinduLunarDayAtOrAfter,
  hinduCalendarYear,
  hinduDailyMotion,
  hinduTropicalLongitude,
  hinduRisingSign,
  hinduSolarSiderealDifference,
  hinduAscensionalDifference,
  hinduEquationOfTime,
  hinduSunrise,
}
