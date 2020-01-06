const {
  mod,
  mod3,
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
} = require( './general' )
const {
  gregorianNewYear,
  gregorianYearFromFixed,
  gregorianDateDifference,
} = require( './gregorian' )

// Difference between UT and local mean time at longitude phi as a fraction of a day.
const zoneFromLongitude = phi => phi / 360

// Universal time from local tee_ell at location.
const universalFromLocal = ( teeEll, location ) => teeEll - zoneFromLongitude( location.longitude )

// Standard time from tee_rom-u in universal time at location.
const standardFromUniversal = ( teeRomU, location ) => teeRomU + location.zone

// Standard time from local tee_ell at location.
const standardFromLocal = ( teeEll, location ) => (
  standardFromUniversal( universalFromLocal( teeEll, location ), location )
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
    * ( -20 + 32 * ( ( ( year - 1820 ) / 100 ) ** 2 ) + 0.5628 * ( 2150 - year ) )
  }
  if ( year >= 2006 && year <= 2050 ) {
    // c2006
    return ( 1 / 86400 ) * poly( y2000, [ 62.92, 0.32217, 0.005589 ] )
  }
  if ( year >= 1987 && year <= 2005 ) {
    // c1987
    return ( 1 / 86400 )
      * poly( y2000, [ 63.86, 0.3345, 0.060374, 0.0017275, 0.000651814, 0.00002373599 ] )
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

// Dynamical time at Universal moment tee_rom-u.
const dynamicalFromUniversal = teeRomU => teeRomU + ephemerisCorrection( teeRomU )

// Noon at start of Gregorian year 2000.
const J2000 = hr( 12 ) + gregorianNewYear( 2000 )

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
      ( [ x, y, z ] ) => ( x * sinDegrees( y + ( z * c ) ) ) )
  return mod( ( lambda + aberration( tee ) + nutation( tee ) ), 360 )
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
  standardFromUniversal,
  standardFromLocal,
  ephemerisCorrection,
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
  sineOffset,
  approxMomentOfDepression,
  momentOfDepression,
  dawn,
  dusk,
  refraction,
  sunrise,
  sunset,
}
