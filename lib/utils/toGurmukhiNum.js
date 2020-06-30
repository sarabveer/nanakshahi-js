/**
 * Convert Number into Gurmukhi Number
 * @param {!number} number Number to Convert
 * @return {string} Number in Gurmukhi
 * @example toGurmukhiNum( 1 )
 * @private
 */
module.exports = number => number.toLocaleString( 'en-u-nu-guru', { useGrouping: false } )
