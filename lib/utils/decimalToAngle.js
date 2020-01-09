/**
 * Convert Day Fraction to Time
 * @param {!number} number Number to Convert
 * @return {string} Angle
 * @example decimalToAngle( 360 )
 * @private
 */
module.exports = number => {
  const sign = Math.sign( number ) === -1 ? '-' : ''
  const degreesAbs = Math.abs( number )
  const degreesInt = Math.floor( degreesAbs )
  const minutesInt = Math.floor( ( degreesAbs - degreesInt ) * 60 )
  const secondsRaw = ( degreesAbs - degreesInt - ( minutesInt / 60 ) ) * 3600
  const secondsInt = Math.floor( secondsRaw ) !== 0
    ? Math.floor( secondsRaw ) : +( secondsRaw ).toFixed( 2 )
  const degrees = degreesInt !== 0 ? `${degreesInt}°` : ''
  const minutes = ( minutesInt !== 0 || ( degreesInt !== 0 && secondsInt !== 0 ) )
    ? ` ${minutesInt}'` : ''
  const seconds = secondsInt !== 0 ? ` ${secondsInt}"` : ''
  const dms = `${degrees}${minutes}${seconds}`.trim()
  return `${sign}${dms}`
}
