/**
 * Convert Decimal into Angle (Degree, Min, Sec)
 * @param {!number} number Number to Convert
 * @return {string} Angle
 * @example decimalToAngle( 360 )
 * @private
 */
module.exports = number => {
  const degreesAbs = Math.abs( number )
  const degrees = Math.floor( degreesAbs )
  let minutesInt = Math.floor( ( degreesAbs - degrees ) * 60 )
  let seconds = Math.round( ( degreesAbs - degrees - ( minutesInt / 60 ) ) * 3600 )
  if ( seconds === 60 ) {
    minutesInt += 1
    seconds = 0
  }
  const minutes = ( minutesInt !== 0 || ( degrees !== 0 && seconds !== 0 ) )
    ? ` ${minutesInt}'`
    : ''
  const dms = `${degrees === 0 ? '' : `${degrees}°`}${minutes}${seconds === 0 ? '' : ` ${seconds}"`}`.trim()
  return `${Math.sign( number ) === -1 ? '-' : ''}${dms}`
}
