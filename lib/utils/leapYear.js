/**
 * Check if current year is Leap Year (Gregorian Leap Rule)
 * @param {number} year Year to check for Leap
 * @return {boolean} True for Leap, False for Regular
 * @example leapYear()
 * @private
 */
module.exports = ( year = new Date().getFullYear() ) => ( year % 4 === 0 && year % 100 !== 0 )
  || year % 400 === 0
