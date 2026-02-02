/**
 * Converts an ASCII number to a Gurmukhi numeral string.
 *
 * @param number - Number to convert.
 * @returns Number in Gurmukhi digits.
 * @example toGurmukhiNum(1)
 * @internal
 */
const toGurmukhiNum = (number: number): string =>
  number.toLocaleString('en-u-nu-guru', { useGrouping: false })

export default toGurmukhiNum
