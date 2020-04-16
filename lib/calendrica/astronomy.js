const {
  mod,
  mod3,
  next,
  final,
  sigma,
  poly,
  hr,
  sec,
  angle,
  sinDegrees,
  cosDegrees,
  tanDegrees,
  arcsinDegrees,
  arccosDegrees,
  arctanDegrees,
} = require( './general' )
const {
  gregorianYearFromFixed,
  gregorianDateDifference,
} = require( './gregorian' )

// Difference between UT and local mean time at longitude phi as a fraction of a day.
const zoneFromLongitude = phi => phi / 360

// Universal time from local tee_ell at location.
const universalFromLocal = ( teeEll, location ) => teeEll - zoneFromLongitude( location.longitude )

// Local time from universal tee_rom-u at location.
const localFromUniveral = ( teeRomU, location ) => teeRomU + zoneFromLongitude( location.longitude )

// Standard time from tee_rom-u in universal time at location.
const standardFromUniversal = ( teeRomU, location ) => teeRomU + location.zone

// Universal time from tee_rom-s in standard time at location.
const universalFromStandard = ( teeRomU, location ) => teeRomU - location.zone

// Standard time from local tee_ell at location.
const standardFromLocal = ( teeEll, location ) => (
  standardFromUniversal( universalFromLocal( teeEll, location ), location )
)

// Local time from standard tee_rom-s at location.
const localFromStandard = ( teeRomS, location ) => (
  localFromUniveral( universalFromStandard( teeRomS, location ), location )
)

// Dynamical Time minus Universal Time (in days) for moment tee.
// Adapted from "Astronomical Algorithms" by Jean Meeus, Willmann-Bell (1991)
// for years 1600-1986 and from polynomials on the NASA Eclipse web site for other years.
const ephemerisCorrection = tee => {
  const year = gregorianYearFromFixed( Math.floor( tee ) )
  const c = ( 1 / 36525 ) * gregorianDateDifference( [ 1900, 1, 1 ], [ year, 7, 1 ] )
  const y2000 = year - 2000
  const y1700 = year - 1700
  const y1600 = year - 1600
  const y1000 = ( year - 1000 ) / 100
  const y0 = year / 100
  const y1820 = ( year - 1820 ) / 100
  if ( year >= 2051 && year <= 2150 ) {
    // c2051
    return ( 1 / 86400 )
    * ( -20 + 32 * ( y1820 ** 2 ) + 0.5628 * ( 2150 - year ) )
  }
  if ( year >= 2006 && year <= 2050 ) {
    // c2006
    return ( 1 / 86400 ) * poly( y2000, [ 62.92, 0.32217, 0.005589 ] )
  }
  if ( year >= 1987 && year <= 2005 ) {
    // c1987
    return ( 1 / 86400 )
      * poly( y2000, [ 63.86, 0.3345, -0.060374, 0.0017275, 0.000651814, 0.00002373599 ] )
  }
  if ( year >= 1900 && year <= 1986 ) {
    // c1900
    return poly( c, [
      -0.00002, 0.000297, 0.025184, -0.181133, 0.553040, -0.861938, 0.677066, -0.212591,
    ] )
  }
  if ( year >= 1800 && year <= 1899 ) {
    // c1800
    return poly( c, [
      -0.000009,
      0.003844,
      0.083563,
      0.865736,
      4.867575,
      15.845535,
      31.332267,
      38.291999,
      28.316289,
      11.636204,
      2.043794,
    ] )
  }
  if ( year >= 1700 && year <= 1799 ) {
    // c1700
    return ( 1 / 86400 ) * poly( y1700, [ 8.118780842, -0.005092142, 0.003336121, -0.0000266484 ] )
  }
  if ( year >= 1600 && year <= 1699 ) {
    // c1600
    return ( 1 / 86400 ) * poly( y1600, [ 120, -0.9808, -0.01532, 0.000140272128 ] )
  }
  if ( year >= 500 && year <= 1599 ) {
    // c500
    return ( 1 / 86400 ) * poly( y1000, [
      1574.2,
      -556.01,
      71.23472,
      0.319781,
      -0.8503463,
      -0.005050998,
      0.0083572073,
    ] )
  }
  if ( year > -500 && year < 500 ) {
    // c0
    return ( 1 / 86400 ) * poly( y0, [
      10583.6,
      -1014.41,
      33.78311,
      -5.952053,
      -0.1798452,
      0.022174192,
      0.0090316521,
    ] )
  }
  // other
  return ( 1 / 86400 ) * poly( y1820, [ -20, 0, 32 ] )
}

// Universal moment from Dynamical time tee.
const universalFromDynamical = tee => tee - ephemerisCorrection( tee )

// Dynamical time at Universal moment tee_rom-u.
const dynamicalFromUniversal = teeRomU => teeRomU + ephemerisCorrection( teeRomU )

// Noon at start of Gregorian year 2000.
// hr( 12 ) + gregorianNewYear( 2000 )
const J2000 = hr( 12 ) + 730120

// Julian centuries since 2000 at moment tee.
const julianCenturies = tee => ( 1 / 36525 ) * ( dynamicalFromUniversal( tee ) - J2000 )

// Obliquity of ecliptic at moment tee.
const obliquity = tee => {
  const c = julianCenturies( tee )
  return angle( 23, 26, 21.448 ) + poly( c, [
    0,
    angle( 0, 0, -46.8150 ),
    angle( 0, 0, -0.00059 ),
    angle( 0, 0, 0.001813 ),
  ] )
}

// Equation of time (as fraction of day) for moment tee.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, p. 185.
const equationOfTime = tee => {
  const c = julianCenturies( tee )
  const lambda = poly( c, [ 280.46645, 36000.76983, 0.0003032 ] )
  const anomaly = poly( c, [ 357.52910, 35999.05030, -0.0001559, -0.00000048 ] )
  const eccentricity = poly( c, [ 0.016708617, -0.000042037, -0.0000001236 ] )
  const varepsilon = obliquity( tee )
  const y = tanDegrees( varepsilon / 2 ) ** 2
  const equation = ( 1 / ( 2 * Math.PI ) )
    * ( y * sinDegrees( 2 * lambda ) - 2 * eccentricity * sinDegrees( anomaly )
    + 4 * eccentricity * y * sinDegrees( anomaly ) * cosDegrees( 2 * lambda )
    - 0.5 * ( y ** 2 ) * sinDegrees( 4 * lambda )
    - 1.25 * ( eccentricity ** 2 ) * sinDegrees( 2 * anomaly ) )
  return Math.sign( equation ) * Math.min( Math.abs( equation ), hr( 12 ) )
}

// Local time from sundial time tee at location.
const localFromApparent = ( tee, location ) => (
  tee - equationOfTime( universalFromLocal( tee, location ) )
)

// Return declination at moment UT tee of object at longitude 'lam' and latitude 'beta'.
const declination = ( tee, beta, lambda ) => {
  const varepsilon = obliquity( tee )
  return arcsinDegrees( sinDegrees( beta )
    * cosDegrees( varepsilon )
    + cosDegrees( beta )
    * sinDegrees( varepsilon )
    * sinDegrees( lambda ) )
}

// Longitudinal nutation at moment tee.
const nutation = tee => {
  const c = julianCenturies( tee )
  const A = poly( c, [ 124.90, -1934.134, 0.002063 ] )
  const B = poly( c, [ 201.11, 72001.5377, 0.00057 ] )
  return -0.004778 * sinDegrees( A ) - 0.0003667 * sinDegrees( B )
}

// Aberration at moment tee.
const aberration = tee => {
  const c = julianCenturies( tee )
  return 0.0000974 * cosDegrees( 177.63 + 35999.01848 * c ) - 0.005575
}

// Longitude of sun at moment tee.
// Adapted from "Planetary Programs and Tables from -4000 to +2800"
// by Pierre Bretagnon and Jean-Louis Simon, Willmann-Bell, 1986.
const solarLongitude = tee => {
  const c = julianCenturies( tee )
  const coefficients = [
    403406, 195207, 119433, 112392, 3891, 2819, 1721,
    660, 350, 334, 314, 268, 242, 234, 158, 132, 129, 114,
    99, 93, 86, 78, 72, 68, 64, 46, 38, 37, 32, 29, 28, 27, 27,
    25, 24, 21, 21, 20, 18, 17, 14, 13, 13, 13, 12, 10, 10, 10, 10,
  ]
  const addends = [
    270.54861, 340.19128, 63.91854, 331.26220,
    317.843, 86.631, 240.052, 310.26, 247.23,
    260.87, 297.82, 343.14, 166.79, 81.53,
    3.50, 132.75, 182.95, 162.03, 29.8,
    266.4, 249.2, 157.6, 257.8, 185.1, 69.9,
    8.0, 197.1, 250.4, 65.3, 162.7, 341.5,
    291.6, 98.5, 146.7, 110.0, 5.2, 342.6,
    230.9, 256.1, 45.3, 242.9, 115.2, 151.8,
    285.3, 53.3, 126.6, 205.7, 85.9, 146.1,
  ]
  const multipliers = [
    0.9287892, 35999.1376958, 35999.4089666,
    35998.7287385, 71998.20261, 71998.4403,
    36000.35726, 71997.4812, 32964.4678,
    -19.4410, 445267.1117, 45036.8840, 3.1008,
    22518.4434, -19.9739, 65928.9345,
    9038.0293, 3034.7684, 33718.148, 3034.448,
    -2280.773, 29929.992, 31556.493, 149.588,
    9037.750, 107997.405, -4444.176, 151.771,
    67555.316, 31556.080, -4561.540,
    107996.706, 1221.655, 62894.167,
    31437.369, 14578.298, -31931.757,
    34777.243, 1221.999, 62894.511,
    -4442.039, 107997.909, 119.066, 16859.071,
    -4.578, 26895.292, -39.127, 12297.536, 90073.778,
  ]
  const lambda = 282.7771834 + 36000.76953744 * c + 0.000005729577951308232
    * sigma( [ coefficients, addends, multipliers ],
      ( [ x, y, z ] ) => ( x * sinDegrees( y + z * c ) ) )
  return mod( ( lambda + aberration( tee ) + nutation( tee ) ), 360 )
}

// Precession at moment tee using 0,0 as J2000 coordinates.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, pp. 136-137.
const precession = tee => {
  const c = julianCenturies( tee )
  const eta = mod( poly( c, [
    0,
    angle( 0, 0, 47.0029 ),
    angle( 0, 0, -0.03302 ),
    angle( 0, 0, 0.000060 ),
  ] ), 360 )
  const P = mod( poly( c, [
    174.876384,
    angle( 0, 0, -869.8089 ),
    angle( 0, 0, 0.03536 ),
  ] ), 360 )
  const p = mod( poly( c, [
    0,
    angle( 0, 0, 5029.0966 ),
    angle( 0, 0, 1.11113 ),
    angle( 0, 0, 0.000006 ),
  ] ), 360 )
  const A = cosDegrees( eta ) * sinDegrees( P )
  const B = cosDegrees( P )
  const arg = arctanDegrees( A, B )
  return mod( p + P - arg, 360 )
}

// Type: Duration
const MEAN_SIDEREAL_YEAR = 365.25636

// Type: Angle
// precession( universalFromLocal( meshaSamkranti( 285 ), HINDU_LOCATION ) )
// meshaSamkranti( 285 ) = 1773453146042889448605495240099273107 / 17084470787216881920000000000000
// HINDU_LOCATION = AMRITSAR
const SIDEREAL_START = precession( universalFromLocal(
  1773453146042889448605495240099273107 / 17084470787216881920000000000000, {
    longitude: angle( 74, 52, 35 ),
  },
) )

// Sidereal solar longitude at moment tee
const siderealSolarLongitude = tee => (
  mod( solarLongitude( tee ) - precession( tee ) + SIDEREAL_START, 360 )
)

// Type: Duration
const MEAN_SYNODIC_MONTH = 29.530588861

// Mean longitude of moon (in degrees) at moment given in Julian centuries c.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, pp. 337-340.
const meanLunarLongitude = c => (
  mod( poly( c, [
    218.3164477,
    481267.88123421,
    -0.0015786,
    ( 1 / 538841 ),
    ( -1 / 65194000 ),
  ] ), 360 )
)

// Elongation of moon (in degrees) at moment given in Julian centuries c.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, p. 338.
const lunarElongation = c => (
  mod( poly( c, [
    297.8501921,
    445267.1114034,
    -0.0018819,
    ( 1 / 545868 ),
    ( -1 / 113065000 ),
  ] ), 360 )
)

// Mean anomaly of sun (in degrees) at moment given in Julian centuries c.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, p. 338.
const solarAnomaly = c => (
  mod( poly( c, [
    357.5291092,
    35999.0502909,
    -0.0001536,
    ( 1 / 24490000 ),
  ] ), 360 )
)

// Mean anomaly of moon (in degrees) at moment given in Julian centuries c.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, p. 338.
const lunarAnomaly = c => (
  mod( poly( c, [
    134.9633964,
    477198.8675055,
    0.0087414,
    ( 1 / 69699 ),
    ( -1 / 14712000 ),
  ] ), 360 )
)

// Moon's argument of latitude (in degrees) at moment given in Julian centuries c.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, p. 338.
const moonNode = c => (
  mod( poly( c, [
    93.2720950,
    483202.0175233,
    -0.0036539,
    ( -1 / 3526000 ),
    ( 1 / 863310000 ),
  ] ), 360 )
)

// Longitude of moon (in degrees) at moment tee.
// Adapted from "Astronomical Algorithms" by Jean Meeus,
// Willmann-Bell, 2nd edn., 1998, pp. 338-342.
const lunarLongitude = tee => {
  const c = julianCenturies( tee )
  const Lprime = meanLunarLongitude( c )
  const D = lunarElongation( c )
  const M = solarAnomaly( c )
  const MPrime = lunarAnomaly( c )
  const F = moonNode( c )
  const E = poly( c, [ 1, -0.002516, -0.0000074 ] )
  const argsSineCoeff = [
    6288774, 1274027, 658314, 213618, -185116, -114332,
    58793, 57066, 53322, 45758, -40923, -34720, -30383,
    15327, -12528, 10980, 10675, 10034, 8548, -7888,
    -6766, -5163, 4987, 4036, 3994, 3861, 3665, -2689,
    -2602, 2390, -2348, 2236, -2120, -2069, 2048, -1773,
    -1595, 1215, -1110, -892, -810, 759, -713, -700, 691,
    596, 549, 537, 520, -487, -399, -381, 351, -340, 330,
    327, -323, 299, 294,
  ]
  const argsLunarElongation = [
    0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 1, 0, 2, 0, 0, 4, 0, 4, 2, 2, 1,
    1, 2, 2, 4, 2, 0, 2, 2, 1, 2, 0, 0, 2, 2, 2, 4, 0, 3, 2, 4, 0, 2,
    2, 2, 4, 0, 4, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2,
  ]
  const argsSolarAnomaly = [
    0, 0, 0, 0, 1, 0, 0, -1, 0, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1,
    0, 1, -1, 0, 0, 0, 1, 0, -1, 0, -2, 1, 2, -2, 0, 0, -1, 0, 0, 1,
    -1, 2, 2, 1, -1, 0, 0, -1, 0, 1, 0, 1, 0, 0, -1, 2, 1, 0,
  ]
  const argsLunarAnomaly = [
    1, -1, 0, 2, 0, 0, -2, -1, 1, 0, -1, 0, 1, 0, 1, 1, -1, 3, -2,
    -1, 0, -1, 0, 1, 2, 0, -3, -2, -1, -2, 1, 0, 2, 0, -1, 1, 0,
    -1, 2, -1, 1, -2, -1, -1, -2, 0, 1, 4, 0, -2, 0, 2, 1, -2, -3,
    2, 1, -1, 3,
  ]
  const argsMoonNode = [
    0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -2, 2, -2, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -2, 2, 0, 2, 0, 0, 0, 0,
    0, 0, -2, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0,
  ]
  const correction = ( 1 / 1000000 )
    * sigma( [
      argsSineCoeff, argsLunarElongation, argsSolarAnomaly, argsLunarAnomaly, argsMoonNode,
    ], (
      [ v, w, x, y, z ],
    ) => ( v * ( E ** Math.abs( x ) ) * sinDegrees( w * D + x * M + y * MPrime + z * F ) ) )
  const venus = ( 3958 / 1000000 ) * sinDegrees( 119.75 + c * 131.849 )
  const jupiter = ( 318 / 1000000 ) * sinDegrees( 53.09 + c * 479264.29 )
  const flatEarth = ( 1962 / 1000000 ) * sinDegrees( Lprime - F )
  return mod( Lprime + correction + venus + jupiter + flatEarth + nutation( tee ), 360 )
}

// Moment of n-th new moon after (or before) the new moon
// of January 11, 1.  Adapted from "Astronomical Algorithms"
// by Jean Meeus, Willmann-Bell, corrected 2nd edn., 2005.
const nthNewMoon = n => {
  const n0 = 24724
  const k = n - n0
  const c = k / 1236.85
  const approx = J2000 + poly( c, [
    5.09766,
    ( MEAN_SYNODIC_MONTH * 1236.85 ),
    0.00015437,
    -0.000000150,
    0.00000000073,
  ] )
  const E = poly( c, [ 1, -0.002516, -0.0000074 ] )
  const solarAnomaly = poly( c, [
    2.5534,
    ( 29.10535670 * 1236.85 ),
    -0.0000014,
    -0.00000011,
  ] )
  const lunarAnomaly = poly( c, [
    201.5643,
    ( 385.81693528 * 1236.85 ),
    0.0107582,
    0.00001238,
    -0.000000058,
  ] )
  const moonArgument = poly( c, [
    160.7108,
    ( 390.67050284 * 1236.85 ),
    -0.0016118,
    -0.00000227,
    0.000000011,
  ] )
  const omega = poly( c, [
    124.7746,
    ( -1.56375588 * 1236.85 ),
    0.0020672,
    0.00000215,
  ] )
  const sineCoeff = [
    -0.40720, 0.17241, 0.01608,
    0.01039, 0.00739, -0.00514,
    0.00208, -0.00111, -0.00057,
    0.00056, -0.00042, 0.00042,
    0.00038, -0.00024, -0.00007,
    0.00004, 0.00004, 0.00003,
    0.00003, -0.00003, 0.00003,
    -0.00002, -0.00002, 0.00002,
  ]
  const EFactor = [ 0, 1, 0, 0, 1, 1, 2, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  const solarCoeff = [ 0, 1, 0, 0, -1, 1, 2, 0, 0, 1, 0, 1, 1, -1, 2, 0, 3, 1, 0, 1, -1, -1, 1, 0 ]
  const lunarCoeff = [ 1, 0, 2, 0, 1, 1, 0, 1, 1, 2, 3, 0, 0, 2, 1, 2, 0, 1, 2, 1, 1, 1, 3, 4 ]
  const moonCoeff = [ 0, 0, 0, 2, 0, 0, 0, -2, 2, 0, 0, 2, -2, 0, 0, -2, 0, -2, 2, 2, 2, -2, 0, 0 ]
  const correction = -0.00017 * sinDegrees( omega )
    + sigma( [ sineCoeff, EFactor, solarCoeff, lunarCoeff, moonCoeff ], (
      [ v, w, x, y, z ],
    ) => (
      ( v * ( E ** w ) * sinDegrees( x * solarAnomaly + y * lunarAnomaly + z * moonArgument ) )
    ) )
  const extra = 0.000325 * sinDegrees( poly( c, [ 299.77, 132.8475848, -0.009173 ] ) )
  const addConst = [
    251.88, 251.83, 349.42, 84.66,
    141.74, 207.14, 154.84, 34.52, 207.19,
    291.34, 161.72, 239.56, 331.55,
  ]
  const addCoeff = [
    0.016321, 26.651886, 36.412478, 18.206239, 53.303771,
    2.453732, 7.306860, 27.261239, 0.121824,
    1.844379, 24.198154, 25.513099, 3.592518,
  ]
  const addFactor = [
    0.000165, 0.000164, 0.000126, 0.000110,
    0.000062, 0.000060, 0.000056, 0.000047, 0.000042,
    0.000040, 0.000037, 0.000035, 0.000023,
  ]
  const additional = sigma( [ addConst, addCoeff, addFactor ], ( [ i, j, l ] ) => (
    l * sinDegrees( i + j * k )
  ) )
  return universalFromDynamical( approx + correction + extra + additional )
}

// Lunar phase, as an angle in degrees, at moment tee.
// An angle of 0 means a new moon, 90 degrees means the
// first quarter, 180 means a full moon, and 270 degrees
// means the last quarter.
const lunarPhase = tee => {
  const phi = mod( lunarLongitude( tee ) - solarLongitude( tee ), 360 )
  const t0 = nthNewMoon( 0 )
  const n = Math.round( ( tee - t0 ) / MEAN_SYNODIC_MONTH )
  const phiPrime = 360 * mod( ( tee - nthNewMoon( n ) ) / MEAN_SYNODIC_MONTH, 1 )
  return Math.abs( phi - phiPrime ) > 180 ? phiPrime : phi
}

// Moment UT of last new moon before tee.
const newMoonBefore = tee => {
  const t0 = nthNewMoon( 0 )
  const phi = lunarPhase( tee )
  const n = Math.round( ( ( tee - t0 ) / MEAN_SYNODIC_MONTH ) - ( phi / 360 ) )
  return nthNewMoon( final( n - 1, k => ( nthNewMoon( k ) < tee ) ) )
}

// Moment UT of first new moon at or after tee.
const newMoonAtOrAfter = tee => {
  const t0 = nthNewMoon( 0 )
  const phi = lunarPhase( tee )
  const n = Math.round( ( ( tee - t0 ) / MEAN_SYNODIC_MONTH ) - ( phi / 360 ) )
  return nthNewMoon( next( n, k => ( nthNewMoon( k ) >= tee ) ) )
}

// Sine of angle between position of sun at local time tee
// and when its depression is alpha at location.
// Out of range when it does not occur.
const sineOffset = ( tee, location, alpha ) => {
  const phi = location.latitude
  const teePrime = universalFromLocal( tee, location )
  const delta = declination( teePrime, 0, solarLongitude( teePrime ) )
  return tanDegrees( phi ) * tanDegrees( delta )
    + ( sinDegrees( alpha ) / ( cosDegrees( delta ) * cosDegrees( phi ) ) )
}

// Moment in local time near tee when depression angle of sun is alpha
// (negative if above horizon) at location; early? is true when morning event
// is sought and false for evening.  Returns bogus if depression angle is not reached.
const approxMomentOfDepression = ( tee, location, alpha, isEarly ) => {
  const ttry = sineOffset( tee, location, alpha )
  const date = Math.floor( tee )
  const alt = ( alpha >= 0 && isEarly ) ? date : ( alpha >= 0 ? date + 1 : date + hr( 12 ) )
  const value = Math.abs( ttry ) > 1 ? sineOffset( alt, location, alpha ) : ttry
  const offset = mod3( ( arcsinDegrees( value ) / 360 ), hr( -12 ), hr( 12 ) )
  if ( Math.abs( value ) <= 1 ) {
    return localFromApparent( ( date + ( isEarly ? hr( 6 ) - offset : hr( 18 ) + offset ) ),
      location )
  }
  return null // Bogus
}

// Moment in local time near approx when depression angle of sun is alpha
// (negative if above horizon) at location; early? is true when morning event
// is sought, and false for evening. Returns bogus if depression angle is not reached.
const momentOfDepression = ( approx, location, alpha, isEarly ) => {
  const tee = approxMomentOfDepression( approx, location, alpha, isEarly )
  return tee === null ? null : ( Math.abs( approx - tee ) < sec( 30 )
    ? tee : momentOfDepression( tee, location, alpha, isEarly ) )
}

// Standard time in morning on fixed date at location when depression
// angle of sun is alpha. Returns bogus if there is no dawn on date.
const dawn = ( date, location, alpha ) => {
  const result = momentOfDepression( date + hr( 6 ), location, alpha, true )
  return result === null ? null : standardFromLocal( result, location )
}

// Standard time in evening on fixed date at location when depression
// angle of sun is alpha. Returns bogus if there is no dusk on date.
const dusk = ( date, location, alpha ) => {
  const result = momentOfDepression( date + hr( 18 ), location, alpha, false )
  return result === null ? null : standardFromLocal( result, location )
}

// Refraction angle at moment tee at location.
// The moment is not used.
const refraction = location => {
  const h = Math.max( 0, location.elevation )
  const R = 6.372 * ( 10 ** 6 )
  const dip = arccosDegrees( R / ( R + h ) )
  return angle( 0, 34, 0 ) + dip + angle( 0, 0, 19 ) * Math.sqrt( h )
}

// Standard time of sunrise on fixed date at location.
const sunrise = ( date, location ) => {
  const alpha = refraction( location ) + angle( 0, 16, 0 )
  return dawn( date, location, alpha )
}

// Standard time of sunset on fixed date at location.
const sunset = ( date, location ) => {
  const alpha = refraction( location ) + angle( 0, 16, 0 )
  return dusk( date, location, alpha )
}

module.exports = {
  zoneFromLongitude,
  universalFromLocal,
  localFromUniveral,
  standardFromUniversal,
  universalFromStandard,
  standardFromLocal,
  localFromStandard,
  ephemerisCorrection,
  universalFromDynamical,
  dynamicalFromUniversal,
  J2000,
  julianCenturies,
  obliquity,
  equationOfTime,
  localFromApparent,
  declination,
  nutation,
  aberration,
  solarLongitude,
  precession,
  MEAN_SIDEREAL_YEAR,
  SIDEREAL_START,
  siderealSolarLongitude,
  MEAN_SYNODIC_MONTH,
  meanLunarLongitude,
  lunarElongation,
  solarAnomaly,
  lunarAnomaly,
  moonNode,
  lunarLongitude,
  nthNewMoon,
  lunarPhase,
  newMoonBefore,
  newMoonAtOrAfter,
  sineOffset,
  approxMomentOfDepression,
  momentOfDepression,
  dawn,
  dusk,
  refraction,
  sunrise,
  sunset,
}
