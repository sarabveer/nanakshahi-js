/**
 * Check if current year is Leap Year (Gregorian Leap Rule)
 * Uses optimized version from: https://stackoverflow.com/a/11595914
 * @param {number} year Year to check for Leap
 * @return {boolean} True for Leap, False for Regular
 * @example leapYear()
 * @private
 */
// eslint-disable-next-line no-bitwise
module.exports = year => ( year & 3 ) === 0 && ( ( year % 25 ) !== 0 || ( year & 15 ) === 0 )
