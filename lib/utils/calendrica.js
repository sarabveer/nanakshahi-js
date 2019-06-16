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

/* eslint-disable camelcase */

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
const to_radians = angle => angle * ( Math.PI / 180 )

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
const binary_search = ( lo, hi, p, e ) => {
  const x = ( lo + hi ) / 2
  if ( p( lo, hi ) ) {
    return x
  } if ( e( x ) ) {
    return binary_search( lo, x, p, e )
  }
  return binary_search( x, hi, p, e )
}

// Find inverse of angular function 'f' at 'y' within interval [a,b].
// Default precision is 0.00001
const invert_angular = ( f, y, a, b, prec = 10 ** -5 ) => {
  const p = ( l, h ) => ( h - l ) <= prec
  const e = x => ( ( f( x ) - y ) % 360 ) < 180
  return binary_search( a, b, p, e )
}

// This simulates the Hindu sine table.
// entry is an angle given as a multiplier of 225'.
const hindu_sine_table = entry => {
  const exact = 3438 * Math.sin( to_radians( entry * angle( 0, 225, 0 ) ) )
  const error = 0.215 * Math.sign( exact ) * Math.sign( Math.abs( exact ) - 1716 )
  return Math.round( exact + error ) / 3438
}

// Linear interpolation for theta in Hindu table.
const hindu_sine = theta => {
  const entry = theta / angle( 0, 225, 0 )
  const fraction = entry % 1
  return ( ( fraction * hindu_sine_table( Math.ceil( entry ) ) )
  + ( ( 1 - fraction ) * hindu_sine_table( Math.floor( entry ) ) ) )
}

// Inverse of Hindu sine function
const hindu_arcsin = amp => {
  if ( amp < 0 ) {
    return -hindu_arcsin( -amp )
  }
  const p = k => amp <= hindu_sine_table( k )
  const pos = next( 0, p )
  const below = hindu_sine_table( pos - 1 )
  return ( angle( 0, 225, 0 ) * ( pos - 1
    + ( ( amp - below ) / ( hindu_sine_table( pos ) - below ) ) ) )
}

// Return the position in degrees at moment, tee, in uniform circular orbit of period days.
const hindu_mean_position = ( tee, period ) => 360 * ( ( ( tee - HINDU_CREATION ) / period ) % 1 )

// Return the longitudinal position at moment, tee.
// period is the period of mean motion in days.
// size is ratio of radii of epicycle and deferent.
// anomalistic is the period of retrograde revolution about epicycle.
// change is maximum decrease in epicycle size.
const hindu_true_position = ( tee, period, size, anomalistic, change ) => {
  const lambda = hindu_mean_position( tee, period )
  const offset = hindu_sine( hindu_mean_position( tee, anomalistic ) )
  const contraction = Math.abs( offset ) * change * size
  const equation = hindu_arcsin( offset * ( size - contraction ) )
  return ( lambda - equation ) % 360
}

// Return the solar longitude at moment, tee.
const hindu_solar_longitude = tee => hindu_true_position( tee,
  HINDU_SIDEREAL_YEAR,
  14 / 360,
  HINDU_ANOMALISTIC_YEAR,
  1 / 42 )

// Return the zodiacal sign of the sun, as integer in range 1..12, at moment tee.
const hindu_zodiac = tee => Math.floor( hindu_solar_longitude( tee ) / 30 ) + 1

// Return the lunar longitude at moment, tee.
const hindu_lunar_longitude = tee => hindu_true_position( tee,
  HINDU_SIDEREAL_MONTH,
  32 / 360,
  HINDU_ANOMALISTIC_MONTH,
  1 / 96 )

// Return the longitudinal distance between the sun and moon at moment, tee.
// Tithi
const hindu_lunar_phase = tee => ( hindu_lunar_longitude( tee )
  - hindu_solar_longitude( tee ) ) % 360

// Return the phase of moon (tithi) at moment, tee, as an integer in the range 1..30.
const hindu_lunar_day_from_moment = tee => Math.floor( hindu_lunar_phase( tee ) / 12 ) + 1

// Return the approximate moment of last new moon preceding moment,
// tee, close enough to determine zodiacal sign.
const hindu_new_moon_before = tee => {
  const varepsilon = 2 ** -1000
  const tau = tee - ( ( 1 / 360 )
    * hindu_lunar_phase( tee )
    * HINDU_SYNODIC_MONTH )
  const p = ( l, u ) => ( ( hindu_zodiac( l ) === hindu_zodiac( u ) )
    || ( ( u - l ) < varepsilon ) )
  const e = x => hindu_lunar_phase( x ) < 180
  return binary_search( tau - 1, Math.min( tee, tau + 1 ), p, e )
}

// Return the time lunar_day (tithi) number, k, begins at or after moment, tee.
// k can be fractional (for karanas).
const hindu_lunar_day_at_or_after = ( k, tee ) => {
  const phase = ( k - 1 ) * 12
  const tau = tee + ( 1 / 360 )
    * ( ( phase - hindu_lunar_phase( tee ) ) % 360 )
    * HINDU_SYNODIC_MONTH
  const a = Math.max( tee, tau - 2 )
  const b = tau + 2
  return invert_angular( hindu_lunar_phase, phase, a, b )
}

// Return the solar year at given moment, tee.
// Kali Yuga Era
const hindu_calendar_year = tee => Math.round( ( ( tee - HINDU_EPOCH ) / HINDU_SIDEREAL_YEAR )
    - ( hindu_solar_longitude( tee ) / 360 ) )

// Return the sidereal daily motion of sun on date, date.
const hindu_daily_motion = date => {
  const mean_motion = 360 / HINDU_SIDEREAL_YEAR
  const anomaly = hindu_mean_position( date, HINDU_ANOMALISTIC_YEAR )
  const epicycle = 14 / 360 - Math.abs( hindu_sine( anomaly ) ) / 1080
  const entry = Math.floor( anomaly / angle( 0, 225, 0 ) )
  const sine_table_step = hindu_sine_table( entry + 1 ) - hindu_sine_table( entry )
  const factor = -3438 / 225 * sine_table_step * epicycle
  return mean_motion * ( factor + 1 )
}

// Hindu tropical longitude on fixed $date$.
// Assumes precession with maximum of 27 degrees and period of 7200 sidereal years
// (= 1577917828/600 days).
const hindu_tropical_longitude = date => {
  const days = Math.floor( date - HINDU_EPOCH )
  const precession = 27 - Math.abs( 108
    * mod3( ( ( 600 / 1577917828 * days ) - ( 1 / 4 ) ), -1 / 2, 1 / 2 ) )
  return ( hindu_solar_longitude( date ) - precession ) % 360
}

// Difference between right and oblique ascension of sun on date at location.
const hindu_ascensional_difference = ( date, location ) => {
  const sin_delta = ( 1397 / 3438 ) * hindu_sine( hindu_tropical_longitude( date ) )
  const phi = location.latitude
  const diurnal_radius = hindu_sine( 90 + hindu_arcsin( sin_delta ) )
  const tan_phi = hindu_sine( phi ) / hindu_sine( 90 + phi )
  const earth_sine = sin_delta * tan_phi
  return hindu_arcsin( -earth_sine / diurnal_radius )
}

//  Tabulated speed of rising of current zodiacal sign on date.
const hindu_rising_sign = date => {
  const i = Math.floor( hindu_tropical_longitude( date ) / 30 )
  return [ 1670 / 1800, 1795 / 1800, 1935 / 1800, 1935 / 1800, 1795 / 1800, 1670 / 1800 ][ i % 6 ]
}

// Return the difference between solar and sidereal day on date.
const hindu_solar_sidereal_difference = date => hindu_daily_motion( date )
  * hindu_rising_sign( date )

// Time from true to mean midnight of date.
const hindu_equation_of_time = date => {
  const offset = hindu_sine( hindu_mean_position( date, HINDU_ANOMALISTIC_YEAR ) )
  const equation_sun = offset * angle( 57, 18, 0 )
    * ( ( 14 / 360 ) - ( Math.abs( offset ) / 1080 ) )
  return ( ( hindu_daily_motion( date ) / 360 )
    * ( equation_sun / 360 )
    * HINDU_SIDEREAL_YEAR )
}

// Return the sunrise at hindu_location on date
const hindu_sunrise = date => date + 6 / 24
    + ( ( UJJAIN.longitude - HINDU_LOCATION.longitude ) / 360 )
    - hindu_equation_of_time( date )
    + ( 1577917828 / ( 1582237828 * 360 ) )
    * ( hindu_ascensional_difference( date, HINDU_LOCATION )
    + ( 1 / 4 * hindu_solar_sidereal_difference( date ) ) )

module.exports = {
  angle,
  UJJAIN,
  AMRITSAR,
  HINDU_LOCATION,
  to_radians,
  next,
  amod,
  mod3,
  binary_search,
  invert_angular,
  hindu_sine_table,
  hindu_sine,
  hindu_arcsin,
  hindu_mean_position,
  hindu_true_position,
  hindu_solar_longitude,
  hindu_zodiac,
  hindu_lunar_longitude,
  hindu_lunar_phase,
  hindu_lunar_day_from_moment,
  hindu_new_moon_before,
  hindu_lunar_day_at_or_after,
  hindu_calendar_year,
  hindu_daily_motion,
  hindu_tropical_longitude,
  hindu_rising_sign,
  hindu_solar_sidereal_difference,
  hindu_ascensional_difference,
  hindu_equation_of_time,
  hindu_sunrise,
}
