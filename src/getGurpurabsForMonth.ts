import gurpurabs from './consts/gurpurabs'
import months from './consts/months'
import { movableGurpurabKeys } from './consts/movableGurpurabs'
import { findMovableGurpurab } from './findMovableGurpurab'
import { getDateFromNanakshahi } from './getDateFromNanakshahi'
import { getNanakshahiDate } from './getNanakshahiDate'
import type { GurpurabsForMonth } from './types'
import toGurmukhiNum from './utils/toGurmukhiNum'
import { assertNanakshahiMonth, getMaxDateForNanakshahiMonth } from './utils/validateInput'

/**
 * Returns all Gurpurabs for a Nanakshahi month.
 *
 * @param month - Nanakshahi month (1-12).
 * @param year - Nanakshahi year (default: current Nanakshahi year).
 * @returns Gurpurab list for the month with Gregorian and localized date fields.
 * @throws {TypeError} If month/year is not an integer.
 * @throws {RangeError} If month/year is outside supported bounds.
 * @example getGurpurabsForMonth(1)
 */
export function getGurpurabsForMonth(
  month: number,
  year: number = getNanakshahiDate().englishDate.year,
): GurpurabsForMonth {
  assertNanakshahiMonth(month)

  // Get gurpurab dates for specific Nanakshahi Month
  const calendarDates = gurpurabs[month as keyof typeof gurpurabs]

  // Go though list and add dates
  const gurpurabsList: GurpurabsForMonth['gurpurabs'] = []
  calendarDates.forEach((value) => {
    const nanakshahiDate = getDateFromNanakshahi(year, month, value.date)
    gurpurabsList.push({
      date: {
        gregorianDate: nanakshahiDate.gregorianDate,
        nanakshahiDate: {
          englishDate: {
            date: nanakshahiDate.englishDate.date,
            day: nanakshahiDate.englishDate.day,
          },
          punjabiDate: {
            date: nanakshahiDate.punjabiDate.date,
            day: nanakshahiDate.punjabiDate.day,
          },
        },
      },
      gurpurabs: [...value.gurpurabs],
    })
  })

  // Check all movable gurpurabs fall in Nanakshahi month
  const startMonth = getDateFromNanakshahi(year, month, 1).gregorianDate
  const monthLength = getMaxDateForNanakshahiMonth(month, year)
  movableGurpurabKeys.forEach((value) => {
    const { gregorianDate, gurpurab } = findMovableGurpurab(value, startMonth.getFullYear())
    const diffDays = (gregorianDate.getTime() - startMonth.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays >= 0 && diffDays < monthLength) {
      const { englishDate, punjabiDate } = getNanakshahiDate(gregorianDate)
      gurpurabsList.push({
        date: {
          gregorianDate,
          nanakshahiDate: {
            englishDate: {
              date: englishDate.date,
              day: englishDate.day,
            },
            punjabiDate: {
              date: punjabiDate.date,
              day: punjabiDate.day,
            },
          },
        },
        gurpurabs: [gurpurab],
      })
    }
  })

  // Sort gurpurabs based on Nanakshahi Date
  gurpurabsList.sort(
    (a, b) => a.date.nanakshahiDate.englishDate.date - b.date.nanakshahiDate.englishDate.date,
  )

  // Add month metadata
  const nanakshahiMonth = {
    englishMonth: {
      month,
      monthName: months[month - 1].en,
      year,
    },
    punjabiMonth: {
      month: toGurmukhiNum(month),
      monthName: months[month - 1].pa,
      year: toGurmukhiNum(year),
    },
  }

  return {
    nanakshahiMonth,
    gurpurabs: gurpurabsList,
  }
}
