/*
  CALENDRICA 4.0 -- Common Lisp
  E. M. Reingold and N. Dershowitz

  ================================================================

  The Functions (code, comments, and definitions) contained in this
  file (the "Program") were written by Edward M. Reingold and Nachum
  Dershowitz (the "Authors"), who retain all rights to them except as
  granted in the License and subject to the warranty and liability
  limitations below.  These Functions are explained in the Authors'
  book, "Calendrical Calculations", 4th ed. (Cambridge University
  Press, 2016), and are subject to an international copyright.

  The Authors' public service intent is more liberal than suggested
  by the License below, as are their licensing policies for otherwise
  nonallowed uses such as--without limitation--those in commercial,
  web-site, and large-scale academic contexts.  Please see the
  web-site

    http://www.calendarists.com

  for all uses not authorized below; in case there is cause for doubt
  about whether a use you contemplate is authorized, please contact
  the Authors (e-mail: reingold@iit.edu).  For commercial licensing
  information, contact the first author at the Department of Computer
  Science, Illinois Institute of Technology, Chicago, IL 60616-3729 USA.

  1. LICENSE.  The Authors grant you a license for personal use.
  This means that for strictly personal use you may copy and use the
  code, and keep a backup or archival copy also.  The Authors grant you a
  license for re-use within non-commercial, non-profit software provided
  prominent credit is given and the Authors' rights are preserved.  Any
  other uses, including without limitation, allowing the code or its
  output to be accessed, used, or available to others, is not permitted.

  2. WARRANTY.

  (a) THE AUTHORS PROVIDE NO WARRANTIES OF ANY KIND, EITHER
    EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITING THE
    GENERALITY OF THE FOREGOING, ANY IMPLIED WARRANTY OF
    MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

  (b) THE AUTHORS SHALL NOT BE LIABLE TO YOU OR ANY THIRD PARTIES
    FOR DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION, ANY LOST
    PROFITS, LOST SAVINGS, OR ANY OTHER INCIDENTAL OR CONSEQUENTIAL
    DAMAGES ARISING OUT OF OR RELATED TO THE USE, INABILITY TO USE,
    OR INACCURACY OF CALCULATIONS, OF THE CODE AND FUNCTIONS
    CONTAINED HEREIN, OR THE BREACH OF ANY EXPRESS OR IMPLIED
    WARRANTY, EVEN IF THE AUTHORS OR PUBLISHER HAVE BEEN ADVISED OF
    THE POSSIBILITY OF THOSE DAMAGES.

  (c) THE FOREGOING WARRANTY MAY GIVE YOU SPECIFIC LEGAL
    RIGHTS WHICH MAY VARY FROM STATE TO STATE IN THE U.S.A.

  3. LIMITATION OF LICENSEE REMEDIES.  You acknowledge and agree that
  your exclusive remedy (in law or in equity), and Authors' entire
  liability with respect to the material herein, for any breach of
  representation or for any inaccuracy shall be a refund of the license
  fee or service and handling charge which you paid the Authors, if any.

  SOME STATES IN THE U.S.A. DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
  LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE
  EXCLUSIONS OR LIMITATION MAY NOT APPLY TO YOU.

  4. DISCLAIMER.  Except as expressly set forth above, the Authors:

  (a) make no other warranties with respect to the material in the
  Program and expressly disclaim any others;

  (b) do not warrant that the material contained in the Program will
  meet your requirements or that their operation shall be
  uninterrupted or error-free;

  (c) license this material on an "as is" basis, and the entire risk
  as to the quality, accuracy, and performance of the Program is
  yours, should the code prove defective (except as expressly
  warranted herein).  You alone assume the entire cost of all
  necessary corrections.
*/

// Fixed time of start of the julian day number.
const JD_EPOCH = -1721424.5

// Fixed date of start of the Julian calendar.
const JULIAN_EPOCH = -1

// Mean length of Hindu sidereal year.
const HINDU_SIDEREAL_YEAR = 365 + 279457 / 1080000

// Mean length of Hindu sidereal month.
const HINDU_SIDEREAL_MONTH = 27 + 4644439 / 14438334

// Mean time from new moon to new moon.
const HINDU_SYNODIC_MONTH = 29 + 7087771 / 13358334

// Fixed date of start of the Hindu calendar (Kali Yuga).
const HINDU_EPOCH = -1132959

// Fixed date of Hindu creation.
const HINDU_CREATION = HINDU_EPOCH - 1955880000 * HINDU_SIDEREAL_YEAR

// Time from aphelion to aphelion.
const HINDU_ANOMALISTIC_YEAR = 1577917828000 / ( 4320000000 - 387 )

// Time from apogee to apogee, with bija correction.
const HINDU_ANOMALISTIC_MONTH = 1577917828 / ( 57753336 - 488199 )

// Years from Kali Yuga until Bikrami/Vikrami era.
const HINDU_SOLAR_ERA = 3044
const HINDU_LUNAR_ERA = 3044

// Return an angle data structure from d degrees, m arcminutes and s arcseconds.
const angle = ( d, m, s ) => d + ( ( m + ( s / 60 ) ) / 60 )

// Location of Ujjain.
const UJJAIN = {
  latitude: angle( 23, 9, 0 ),
  longitude: angle( 75, 46, 6 ),
}

// Location of Amritsar.
const AMRITSAR = {
  latitude: angle( 31, 37, 12 ),
  longitude: angle( 74, 52, 34 ),
}

// Location for determining Hindu calendar.
const HINDU_LOCATION = AMRITSAR

// Mathematical Mod
// Implement mod function that does negative wrap-around
// https://stackoverflow.com/questions/4467539
const mod = ( n, m ) => ( ( n % m ) + m ) % m

// The value of (x mod y) with y instead of 0.
const amod = ( x, y ) => y + mod( x, -y )

// The value of x shifted into the range [a..b). Returns x if a=b.
const mod3 = ( x, a, b ) => ( a === b ? x : a + mod( ( x - a ), ( b - a ) ) )

// First integer greater or equal to initial such that condition holds.
const next = ( initial, condition ) => (
  condition( initial ) ? initial : next( initial + 1, condition )
)

// Bisection search for x in [lo..hi] such that end holds. test determines when to go left.
const binarySearch = ( lo, hi, test, end ) => {
  const x = ( lo + hi ) / 2
  if ( test( lo, hi ) ) {
    return x
  } if ( end( x ) ) {
    return binarySearch( lo, x, test, end )
  }
  return binarySearch( x, hi, test, end )
}

// Use bisection to find inverse of angular function f at y within interval [a..b].
const invertAngular = ( f, y, a, b, prec = 10 ** -5 ) => {
  const p = ( l, h ) => ( h - l ) <= prec
  const e = x => mod( ( f( x ) - y ), 360 ) < 180
  return binarySearch( a, b, p, e )
}

// Moment of julian day number jd.
const momentFromJd = jd => jd + JD_EPOCH

// Julian day number of moment tee.
const jdFromMoment = tee => tee - JD_EPOCH

// Fixed date of julian day number jd.
const fixedFromJd = jd => Math.floor( momentFromJd( jd ) )

// Julian day number of fixed date.
const jdFromFixed = date => jdFromMoment( date )

// True if j-year is a leap year on the Julian calendar.
const isJulianLeapYear = jYear => mod( jYear, 4 ) === ( ( jYear > 0 ) ? 0 : 3 )

// Fixed date equivalent to the Julian date.
const fixedFromJulian = ( year, month, day ) => {
  const y = year < 0 ? year + 1 : year
  let correction
  if ( month <= 2 ) {
    correction = 0
  } else if ( isJulianLeapYear( year ) ) {
    correction = -1
  } else {
    correction = -2
  }
  return JULIAN_EPOCH - 1
    + 365 * ( y - 1 )
    + Math.floor( ( y - 1 ) / 4 )
    + Math.floor( ( 367 * month - 362 ) / 12 )
    + correction + day
}

// Julian (year month day) corresponding to fixed date.
const julianFromFixed = date => {
  const approx = Math.floor( ( ( 4 * ( date - JULIAN_EPOCH ) ) + 1464 ) / 1461 )
  const year = approx <= 0 ? approx - 1 : approx
  const priorDays = date - fixedFromJulian( year, 1, 1 )
  let correction
  if ( date < fixedFromJulian( year, 3, 1 ) ) {
    correction = 0
  } else if ( isJulianLeapYear( year ) ) {
    correction = 1
  } else {
    correction = 2
  }
  const month = Math.floor( ( 12 * ( priorDays + correction ) + 373 ) / 367 )
  const day = 1 + ( date - fixedFromJulian( year, month, 1 ) )
  return { year, month, day }
}

// This simulates the Hindu sine table.
// entry is an angle given as a multiplier of 225'.
const hinduSineTable = entry => {
  const exact = 3438 * Math.sin( ( entry * angle( 0, 225, 0 ) ) * ( Math.PI / 180 ) )
  const error = 0.215 * Math.sign( exact ) * Math.sign( Math.abs( exact ) - 1716 )
  return Math.round( exact + error ) / 3438
}

// Linear interpolation for theta in Hindu table.
const hinduSine = theta => {
  const entry = theta / angle( 0, 225, 0 )
  const fraction = mod( entry, 1 )
  return ( fraction * hinduSineTable( Math.ceil( entry ) ) )
  + ( ( 1 - fraction ) * hinduSineTable( Math.floor( entry ) ) )
}

// Inverse of Hindu sine function of amp.
const hinduArcsin = amp => {
  if ( amp < 0 ) {
    return -hinduArcsin( -amp )
  }
  const pos = next( 0, ( k => amp <= hinduSineTable( k ) ) )
  const below = hinduSineTable( pos - 1 )
  return angle( 0, 225, 0 ) * ( pos - 1
    + ( ( amp - below ) / ( hinduSineTable( pos ) - below ) ) )
}

// Position in degrees at moment tee in uniform circular orbit of period days.
const hinduMeanPosition = ( tee, period ) => 360 * mod( ( ( tee - HINDU_CREATION ) / period ), 1 )

// Longitudinal position at moment tee.
// period is period of mean motion in days.
// size is ratio of radii of epicycle and deferent.
// anomalistic is the period of retrograde revolution about epicycle.
// change is maximum decrease in epicycle size.
const hinduTruePosition = ( tee, period, size, anomalistic, change ) => {
  const lambda = hinduMeanPosition( tee, period )
  const offset = hinduSine( hinduMeanPosition( tee, anomalistic ) )
  const contraction = Math.abs( offset ) * change * size
  const equation = hinduArcsin( offset * ( size - contraction ) )
  return mod( ( lambda - equation ), 360 )
}

// Solar longitude at moment tee.
const hinduSolarLongitude = tee => (
  hinduTruePosition( tee,
    HINDU_SIDEREAL_YEAR,
    14 / 360,
    HINDU_ANOMALISTIC_YEAR,
    1 / 42 )
)

// Zodiacal sign of the sun, as integer in range 1..12, at moment tee.
const hinduZodiac = tee => Math.floor( hinduSolarLongitude( tee ) / 30 ) + 1

// Lunar longitude at moment tee.
const hinduLunarLongitude = tee => (
  hinduTruePosition( tee,
    HINDU_SIDEREAL_MONTH,
    32 / 360,
    HINDU_ANOMALISTIC_MONTH,
    1 / 96 )
)

// Longitudinal distance between the sun and moon at moment tee.
const hinduLunarPhase = tee => (
  mod( ( hinduLunarLongitude( tee ) - hinduSolarLongitude( tee ) ), 360 )
)

// Phase of moon (tithi) at moment tee, as an integer in the range 1..30.
const hinduLunarDayFromMoment = tee => Math.floor( hinduLunarPhase( tee ) / 12 ) + 1

// Approximate moment of last new moon preceding moment
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

// Time lunar-day (tithi) number k begins at or after
// moment tee.  k can be fractional (for karanas).
const hinduLunarDayAtOrAfter = ( k, tee ) => {
  const phase = ( k - 1 ) * 12
  const tau = tee + ( 1 / 360 )
    * mod( ( phase - hinduLunarPhase( tee ) ), 360 )
    * HINDU_SYNODIC_MONTH
  const a = Math.max( tee, tau - 2 )
  const b = tau + 2
  return invertAngular( hinduLunarPhase, phase, a, b )
}

// Determine solar year at given moment tee.
const hinduCalendarYear = tee => (
  Math.round( ( ( tee - HINDU_EPOCH ) / HINDU_SIDEREAL_YEAR )
    - ( hinduSolarLongitude( tee ) / 360 ) )
)

// Sidereal daily motion of sun on date.
const hinduDailyMotion = date => {
  const meanMotion = 360 / HINDU_SIDEREAL_YEAR
  const anomaly = hinduMeanPosition( date, HINDU_ANOMALISTIC_YEAR )
  const epicycle = 14 / 360 - Math.abs( hinduSine( anomaly ) ) / 1080
  const entry = Math.floor( anomaly / angle( 0, 225, 0 ) )
  const sineTableStep = hinduSineTable( entry + 1 ) - hinduSineTable( entry )
  const factor = -3438 / 225 * sineTableStep * epicycle
  return meanMotion * ( factor + 1 )
}

// Hindu tropical longitude on fixed date.
// Assumes precession with maximum of 27 degrees and period of 7200 sidereal years
// (= 1577917828/600 days).
const hinduTropicalLongitude = date => {
  const days = date - HINDU_EPOCH
  const precession = 27 - Math.abs( 108
    * mod3( ( ( ( 600 / 1577917828 ) * days ) - ( 1 / 4 ) ), -1 / 2, 1 / 2 ) )
  return mod( ( hinduSolarLongitude( date ) - precession ), 360 )
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

// Tabulated speed of rising of current zodiacal sign on date.
const hinduRisingSign = date => {
  const i = Math.floor( hinduTropicalLongitude( date ) / 30 )
  // eslint-disable-next-line max-len
  return [ 1670 / 1800, 1795 / 1800, 1935 / 1800, 1935 / 1800, 1795 / 1800, 1670 / 1800 ][ mod( i, 6 ) ]
}

// Difference between solar and sidereal day on date.
const hinduSolarSiderealDifference = date => hinduDailyMotion( date ) * hinduRisingSign( date )

// Time from true to mean midnight of date.
// (This is a gross approximation to the correct value.)
const hinduEquationOfTime = date => {
  const offset = hinduSine( hinduMeanPosition( date, HINDU_ANOMALISTIC_YEAR ) )
  const equationSun = offset * angle( 57, 18, 0 )
    * ( ( 14 / 360 ) - ( Math.abs( offset ) / 1080 ) )
  return ( ( hinduDailyMotion( date ) / 360 )
    * ( equationSun / 360 )
    * HINDU_SIDEREAL_YEAR )
}

// Sunrise at hindu-location on date.
const hinduSunrise = date => (
  date + 6 / 24
    + ( ( UJJAIN.longitude - HINDU_LOCATION.longitude ) / 360 )
    - hinduEquationOfTime( date )
    + ( 1577917828 / ( 1582237828 * 360 ) )
    * ( hinduAscensionalDifference( date, HINDU_LOCATION )
    + ( 1 / 4 * hinduSolarSiderealDifference( date ) ) )
)

// Hindu (Orissa) solar date equivalent to fixed date.
const hinduSolarFromFixed = date => {
  const critical = hinduSunrise( date + 1 )
  const month = hinduZodiac( critical )
  const year = hinduCalendarYear( critical ) - HINDU_SOLAR_ERA
  const approx = date - 3 - mod( Math.floor( hinduSolarLongitude( critical ) ), 30 )
  const p = i => ( hinduZodiac( hinduSunrise( i + 1 ) ) === month )
  const start = next( approx, p )
  const day = date - start + 1
  return { year, month, day }
}

// Hindu lunar station (nakshatra) at sunrise on date.
const hinduLunarStation = date => (
  Math.floor( hinduLunarLongitude( hinduSunrise( date ) ) / angle( 0, 800, 0 ) ) + 1
)

// Hindu lunar date, new-moon scheme, equivalent to fixed date.
const hinduLunarFromFixed = date => {
  const critical = hinduSunrise( date )
  const day = hinduLunarDayFromMoment( critical )
  const leapDay = ( day === hinduLunarDayFromMoment( hinduSunrise( date - 1 ) ) )
  const lastNewMoon = hinduNewMoonBefore( critical )
  const nextNewMoon = hinduNewMoonBefore( Math.floor( lastNewMoon ) + 35 )
  const solarMonth = hinduZodiac( lastNewMoon )
  const leapMonth = ( solarMonth === hinduZodiac( nextNewMoon ) )
  const month = amod( solarMonth + 1, 12 )
  const year = hinduCalendarYear( month <= 2 ? date + 180 : date ) - HINDU_LUNAR_ERA
  return { year, month, leapMonth, day, leapDay }
}

// Fixed date corresponding to Hindu lunar date.
const fixedFromHinduLunar = ( year, month, leapMonth = false, day, leapDay = false ) => {
  const approx = HINDU_EPOCH + HINDU_SIDEREAL_YEAR
    * ( year + HINDU_LUNAR_ERA + ( ( month - 1 ) / 12 ) )
  const s = Math.floor( approx - HINDU_SIDEREAL_YEAR
    * mod3( ( ( hinduSolarLongitude( approx ) / 360 )
    - ( ( month - 1 ) / 12 ) ), -1 / 2, 1 / 2 ) )
  const mid = hinduLunarFromFixed( s - 15 )
  const k = hinduLunarDayFromMoment( s + ( 6 / 24 ) )
  let est = s + day
  if ( 3 < k && k < 27 ) {
    est -= k
  } else if ( mid.month !== month || ( mid.leapMonth && !leapMonth ) ) {
    est -= mod3( k, -15, 15 )
  } else {
    est -= mod3( k, 15, 45 )
  }
  const tau = est - mod3( ( hinduLunarDayFromMoment( est + ( 6 / 24 ) ) - day ), -15, 15 )
  const date = next( tau - 1, ( d => (
    [ day, amod( day + 1, 30 ) ].includes( hinduLunarDayFromMoment( hinduSunrise( d ) ) )
  ) ) )
  return leapDay ? date + 1 : date
}

// Hindu lunar date, full-moon scheme, equivalent to fixed date.
const hinduFullmoonFromFixed = date => {
  const { year, month, leapMonth, day, leapDay } = hinduLunarFromFixed( date )
  let m
  if ( day >= 16 ) {
    m = hinduLunarFromFixed( date + 20 ).month
  } else {
    m = month
  }
  return { year, month: m, leapMonth, day, leapDay }
}

// True if Hindu lunar month month in year is expunged.
const isHinduExpunged = ( year, month ) => (
  month !== hinduLunarFromFixed( fixedFromHinduLunar( year, month, false, 15, false ) ).month
)

// Fixed date equivalent to Hindu lunar date in full-moon scheme.
const fixedFromHinduFullmoon = ( year, month, leapMonth = false, day, leapDay = false ) => {
  let m
  if ( leapMonth || ( day <= 15 ) ) {
    m = month
  } else if ( isHinduExpunged( year, amod( month - 1, 12 ) ) ) {
    m = amod( month - 2, 12 )
  } else {
    m = amod( month - 1, 12 )
  }
  return fixedFromHinduLunar( year, m, leapMonth, day, leapDay )
}

module.exports = {
  JD_EPOCH,
  HINDU_SIDEREAL_YEAR,
  HINDU_SIDEREAL_MONTH,
  HINDU_SYNODIC_MONTH,
  HINDU_EPOCH,
  HINDU_CREATION,
  HINDU_ANOMALISTIC_YEAR,
  HINDU_ANOMALISTIC_MONTH,
  HINDU_SOLAR_ERA,
  HINDU_LUNAR_ERA,
  angle,
  UJJAIN,
  AMRITSAR,
  HINDU_LOCATION,
  mod,
  amod,
  mod3,
  next,
  binarySearch,
  invertAngular,
  momentFromJd,
  jdFromMoment,
  fixedFromJd,
  jdFromFixed,
  isJulianLeapYear,
  fixedFromJulian,
  julianFromFixed,
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
  hinduSolarFromFixed,
  hinduLunarStation,
  hinduLunarFromFixed,
  fixedFromHinduLunar,
  hinduFullmoonFromFixed,
  isHinduExpunged,
  fixedFromHinduFullmoon,
}
