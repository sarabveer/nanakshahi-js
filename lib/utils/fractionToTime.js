const { general: { clockFromMoment } } = require( '../calendrica' )

/**
 * Convert Decimal into Angle (Degree, Min, Sec)
 * @param {!number} tee Date to Convert
 * @return {string} Time
 * @example decimalToAngle( 360 )
 * @private
 */
module.exports = tee => {
  // eslint-disable-next-line prefer-const
  let { hour, minute: minuteInt, second } = clockFromMoment( tee )
  let day12 = 'AM'
  if ( hour > 12 ) {
    hour -= 12
    day12 = 'PM'
  }
  if ( second >= 30 ) {
    minuteInt += 1
  }
  const minute = minuteInt < 10 ? `0${minuteInt}` : minuteInt
  return `${hour}:${minute} ${day12}`
}
