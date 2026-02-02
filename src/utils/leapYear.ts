/**
 * Checks leap year using Gregorian rules.
 *
 * @param year - Input year value.
 * @param nsYear - If true, input is Nanakshahi year; otherwise Gregorian year.
 * @returns True for leap year, false otherwise.
 * @example leapYear(555)
 * @internal
 */
const leapYear = (year: number, nsYear: boolean = true): boolean => {
  year = nsYear ? year + 1469 : year
  return (year & 3) === 0 && (year % 25 !== 0 || (year & 15) === 0)
}

export default leapYear
