const { numbers } = require( '../consts' )

/**
 * Convert Number into Gurmukhi Number
 * @param {!number} number Number to Convert
 * @return {string} Number in Gurmukhi
 * @example toUnicodeNum( 1 )
 * @private
 */
module.exports = number => {
  let regex
  let string = number.toString()
  numbers.forEach( ( val, key ) => {
    regex = new RegExp( key, 'ug' )
    string = string.replace( regex, val )
  } )
  return string
}
