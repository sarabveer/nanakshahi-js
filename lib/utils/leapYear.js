/**
 * Check if current year is Leap Year (Gregorian Leap Rule)
 * Uses optimized version from: https://stackoverflow.com/a/11595914
 * @param {number} nsYear Nanakshahi year to check for Leap
 * @return {boolean} True for Leap, False for Regular
 * @example leapYear( 555 )
 * @example leapYear( 556 )
 * @private
 */
module.exports = nsYear => {
  const year = nsYear + 1469
  // eslint-disable-next-line no-bitwise
  return ( year & 3 ) === 0 && ( ( year % 25 ) !== 0 || ( year & 15 ) === 0 )
}
