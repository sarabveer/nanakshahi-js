import monthOffsets from './consts/monthOffsets'
import months from './consts/months'
import weekdays from './consts/weekdays'
import type { NanakshahiDate } from './types'
import leapYear from './utils/leapYear'
import toGurmukhiNum from './utils/toGurmukhiNum'
import { validateNanakshahiDateInput } from './utils/validateInput'

/**
 * Converts a Nanakshahi date into its Gregorian equivalent.
 *
 * @param year - Nanakshahi year.
 * @param month - Nanakshahi month (1-12).
 * @param date - Nanakshahi day.
 * @returns Gregorian date plus Nanakshahi date in English and Punjabi.
 * @throws {TypeError} If any input is not an integer.
 * @throws {RangeError} If year/month/day is outside supported Nanakshahi bounds.
 * @example getDateFromNanakshahi(550, 10, 23)
 */
export function getDateFromNanakshahi(year: number, month: number, date: number): NanakshahiDate {
  validateNanakshahiDateInput(year, month, date)

  // Date Object
  const gregorianDate = new Date(
    // Calculate Gregorian Year
    month < 11 ? year + 1468 : year + 1469,
    // Set month start from Nanakshahi [0..11]
    month < 11 ? month + 1 : month - 11,
    // Add days to months
    monthOffsets[month - 1] + (date - 1),
  )

  // Get Day of Week
  const weekday = gregorianDate.getDay()

  return {
    gregorianDate,
    englishDate: {
      month,
      monthName: months[month - 1].en,
      date,
      year,
      day: weekdays[weekday].en,
      dayShort: weekdays[weekday].enShort,
    },
    punjabiDate: {
      month: toGurmukhiNum(month),
      monthName: months[month - 1].pa,
      date: toGurmukhiNum(date),
      year: toGurmukhiNum(year),
      day: weekdays[weekday].pa,
      dayShort: weekdays[weekday].paShort,
    },
    leapYear: leapYear(year),
  }
}
