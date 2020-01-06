const { mod } = require( './general' )

// Fixed date of start of the Julian calendar.
// fixedFromGregorian( 0, 12, 30 )
const JULIAN_EPOCH = -1

// True if j-year is a leap year on the Julian calendar.
const isJulianLeapYear = jYear => mod( jYear, 4 ) === ( ( jYear > 0 ) ? 0 : 3 )

// Fixed date equivalent to the Julian date j-date.
const fixedFromJulian = ( year, month, day ) => {
  const y = year < 0 ? year + 1 : year
  return JULIAN_EPOCH - 1
    + 365 * ( y - 1 )
    + Math.floor( ( y - 1 ) / 4 )
    + Math.floor( ( 1 / 12 ) * ( 367 * month - 362 ) )
    + ( ( month <= 2 ) ? 0 : ( isJulianLeapYear( year ) ? -1 : -2 ) )
    + day
}

// Julian (year month day) corresponding to fixed date.
const julianFromFixed = date => {
  const approx = Math.floor( ( 1 / 1461 ) * ( ( 4 * ( date - JULIAN_EPOCH ) ) + 1464 ) )
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
  const month = Math.floor( ( 1 / 367 ) * ( 12 * ( priorDays + correction ) + 373 ) )
  const day = date - fixedFromJulian( year, month, 1 ) + 1
  return { year, month, day }
}

module.exports = {
  JULIAN_EPOCH,
  isJulianLeapYear,
  fixedFromJulian,
  julianFromFixed,
}
