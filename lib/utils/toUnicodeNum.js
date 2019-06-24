const { numbers } = require( '../consts' )

/**
 * Convert Number into Gurmukhi Number
 * @param {!number} number Number to Convert
 * @return {string} Number in Gurmukhi
 * @example toUnicodeNum( 1 )
 * @private
 */
module.exports = number => {
  let unicode = ''
  number.toString().split( '' ).forEach( val => {
    unicode += numbers[ parseInt( val, 10 ) ]
  } )
  return unicode
}
