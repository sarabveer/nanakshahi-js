// Mathematical Mod
// Implement mod function that does negative wrap-around
// https://stackoverflow.com/a/17323608
const mod = ( n, m ) => ( ( n % m ) + m ) % m

// The value of (x mod y) with y instead of 0.
const amod = ( x, y ) => y + mod( x, -y )

// The value of x shifted into the range [a..b). Returns x if a=b.
const mod3 = ( x, a, b ) => ( a === b ? x : a + mod( ( x - a ), ( b - a ) ) )

// First integer greater or equal to initial such that condition holds.
const next = ( initial, condition ) => (
  condition( initial ) ? initial : next( initial + 1, condition )
)

// Last integer greater or equal to initial such that condition holds.
const final = ( initial, condition ) => (
  !condition( initial ) ? initial - 1 : final( initial + 1, condition )
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

// list is of the form ((i1 l1)...(in ln)).
// Sum of body for indices i1...in running simultaneously thru lists l1...ln.
const sigma = ( list, body ) => {
  // Zip function
  // https://stackoverflow.com/a/10284006
  const zip = rows => rows[ 0 ].map( ( _, c ) => rows.map( row => row[ c ] ) )
  return zip( list ).reduce( ( a, c ) => a + body( c ), 0 )
}

// Sum powers of x with coefficients (from order 0 up) in list a.
// Taken from https://github.com/espinielli/pycalcal
const poly = ( x, a ) => {
  const n = a.length - 1
  let p = a[ n ]
  for ( let i = 1; i < ( n + 1 ); i += 1 ) {
    p = p * x + a[ n - i ]
  }
  return p
}

// Time from moment tee.
const timeFromMoment = tee => mod( tee, 1 )

// Clock time hour:minute:second from moment tee.
// Based on calendrica 3.0
const clockFromMoment = tee => {
  const time = timeFromMoment( tee )
  const hour = Math.floor( time * 24 )
  const minute = Math.floor( mod( time * 24 * 60, 60 ) )
  const second = mod( time * 24 * 60 * 60, 60 )
  return { hour, minute, second }
}

// x hours.
const hr = x => x / 24

// x seconds.
const sec = x => x / 24 / 60 / 60

// Return an angle data structure from d degrees, m arcminutes and s arcseconds.
const angle = ( d, m, s ) => d + ( ( m + ( s / 60 ) ) / 60 )

// Convert angle theta from radians to degrees.
const degreesFromRadians = theta => mod( ( theta * ( 180 / Math.PI ) ), 360 )

// Convert angle theta from degrees to radians.
const radiansFromDegrees = theta => mod( theta, 360 ) * ( Math.PI / 180 )

// Sine of theta (given in degrees).
const sinDegrees = theta => Math.sin( radiansFromDegrees( theta ) )

// Cosine of theta (given in degrees).
const cosDegrees = theta => Math.cos( radiansFromDegrees( theta ) )

// Tangent of theta (given in degrees).
const tanDegrees = theta => Math.tan( radiansFromDegrees( theta ) )

// Arcsine of x in degrees.
const arcsinDegrees = x => degreesFromRadians( Math.asin( x ) )

// Arccosine of x in degrees.
const arccosDegrees = x => degreesFromRadians( Math.acos( x ) )

// Arctangent of y/x in degrees.
// Returns bogus if x and y are both 0.
const arctanDegrees = ( y, x ) => {
  if ( x === 0 && y === 0 ) {
    return null
  }
  const alpha = degreesFromRadians( Math.atan( y / x ) )
  return mod( x === 0 ? Math.sign( y ) * 90 : ( x >= 0 ? alpha : alpha + 180 ), 360 )
}

// Fixed time of start of the julian day number.
const JD_EPOCH = -1721424.5

// Moment of julian day number jd.
const momentFromJd = jd => jd + JD_EPOCH

// Julian day number of moment tee.
const jdFromMoment = tee => tee - JD_EPOCH

// Fixed date of julian day number jd.
const fixedFromJd = jd => Math.floor( momentFromJd( jd ) )

// Julian day number of fixed date.
const jdFromFixed = date => jdFromMoment( date )

// Fixed date of the start of the Unix second count.
const UNIX_EPOCH = 719163

// Fixed date from Unix second count s
const momentFromUnix = s => UNIX_EPOCH + ( s / ( 24 * 60 * 60 ) )

// Unix second count from moment tee
const unixFromMoment = tee => 24 * 60 * 60 * ( tee - UNIX_EPOCH )

module.exports = {
  mod,
  amod,
  mod3,
  next,
  final,
  binarySearch,
  invertAngular,
  sigma,
  poly,
  timeFromMoment,
  clockFromMoment,
  hr,
  sec,
  angle,
  degreesFromRadians,
  radiansFromDegrees,
  sinDegrees,
  cosDegrees,
  tanDegrees,
  arcsinDegrees,
  arccosDegrees,
  arctanDegrees,
  JD_EPOCH,
  momentFromJd,
  jdFromMoment,
  fixedFromJd,
  jdFromFixed,
  UNIX_EPOCH,
  momentFromUnix,
  unixFromMoment,
}
