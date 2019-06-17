const julian = require( 'julian' )

/**
 * Get day difference between Gregorian and Julian Calendar
 * @param {!number} julianYear Julian Year
 * @param {!number} julianMonth Julian Month
 * @return {number} Day Difference
 * @private
 */
const dayDifference = ( julianYear, julianMonth ) => {
  let year = julianYear

  // check if we are in january or february
  if ( julianMonth < 3 ) {
    // substract one year
    year -= 1
  }

  const jh = Math.floor( year / 100 )
  const a = Math.floor( jh / 4 )
  // the rest of the division
  const b = jh % 4
  // day difference
  return 3 * a + b - 2
}

/**
 * Convert Julian Calendar Date into Gregorian Calendar Date
 * @param {Object} julian JavaScript Date() Object
 * @return {number} JulianDay for Gregorian Calendar Date
 * @example fromJulianToGregorian( new Date() )
 * @private
 */
module.exports = date => {
  const julianDate = new Date( Date.UTC( date.getFullYear(), date.getMonth(), date.getDate() ) )
  const year = julianDate.getFullYear()
  const month = julianDate.getMonth() + 1

  // Get Day Difference
  const td = dayDifference( year, month )

  // Get Julian Date as whole number, as 12PM noon
  let julianDay = Math.trunc( julian( julianDate ) ) + 1

  // Add Day Difference
  julianDay += td

  // Set time to 12AM
  julianDay -= 0.5

  return julianDay
}
