import monthOffsets from './consts/monthOffsets'
import months from './consts/months'
import weekdays from './consts/weekdays'
import type { NanakshahiDate } from './types'
import leapYear from './utils/leapYear'
import toGurmukhiNum from './utils/toGurmukhiNum'
import { assertNanakshahiYear } from './utils/validateInput'

/**
 * Converts a Gregorian date to the corresponding Nanakshahi date.
 *
 * @param gregorianDate - JavaScript Date object (default: current date).
 * @returns Nanakshahi date in English and Punjabi.
 * @throws {RangeError} If the computed Nanakshahi year is before 535 NS.
 * @example getNanakshahiDate(new Date())
 */
export function getNanakshahiDate(gregorianDate: Date = new Date()): NanakshahiDate {
  // Calculate Nanakshahi Year - March 14 (1 Chet) Nanakshahi New Year
  const nsYear =
    gregorianDate >= new Date(gregorianDate.getFullYear(), 2, 14)
      ? gregorianDate.getFullYear() - 1468
      : gregorianDate.getFullYear() - 1469

  assertNanakshahiYear(nsYear)

  // Calculate Nanakshahi Month and Date
  let nsMonth = (gregorianDate.getMonth() + 9) % 12
  const nsNextMonth = (nsMonth + 1) % 12

  let nsDate: number
  if (gregorianDate.getDate() >= monthOffsets[nsNextMonth]) {
    nsMonth = nsNextMonth
    nsDate = gregorianDate.getDate() - monthOffsets[nsNextMonth] + 1
  } else {
    const gregorianMonths = [
      31,
      leapYear(gregorianDate.getFullYear(), false) ? 29 : 28, // February Leap Check
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ]
    nsDate =
      gregorianMonths[(gregorianDate.getMonth() + 11) % 12] -
      monthOffsets[nsMonth] +
      gregorianDate.getDate() +
      1
  }

  // Get Day of Week
  const weekday = gregorianDate.getDay()

  return {
    gregorianDate,
    englishDate: {
      month: nsMonth + 1,
      monthName: months[nsMonth].en,
      date: nsDate,
      year: nsYear,
      day: weekdays[weekday].en,
      dayShort: weekdays[weekday].enShort,
    },
    punjabiDate: {
      month: toGurmukhiNum(nsMonth + 1),
      monthName: months[nsMonth].pa,
      date: toGurmukhiNum(nsDate),
      year: toGurmukhiNum(nsYear),
      day: weekdays[weekday].pa,
      dayShort: weekdays[weekday].paShort,
    },
    leapYear: leapYear(nsYear),
  }
}
