const { general: { clockFromMoment } } = require( '../calendrica' )

/**
 * Convert Day Fraction to 12-Hour Time
 * @param {!number} tee Date to Convert
 * @return {string} Time
 * @example fractionToTime( .064 )
 * @private
 */
module.exports = tee => {
  // eslint-disable-next-line prefer-const
  let { hour, minute, second } = clockFromMoment( tee )
  let period = 'AM'
  if ( hour >= 12 ) {
    period = 'PM'
    hour -= 12
  }
  hour = hour === 0 ? 12 : hour
  // Round Minute Up if seconds after 30
  minute = second >= 30 ? ( minute + 1 ) : minute
  return `${hour}:${minute < 10 ? `0${minute}` : minute} ${period}`
}
