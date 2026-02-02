import gurpurabs from './consts/gurpurabs'
import { movableGurpurabKeys } from './consts/movableGurpurabs'
import { findMovableGurpurab } from './findMovableGurpurab'
import { getNanakshahiDate } from './getNanakshahiDate'
import type { GurpurabName } from './types'

/**
 * Returns all Gurpurabs that fall on a Gregorian date.
 *
 * @param gregorianDate - JavaScript Date object (default: current date).
 * @returns Gurpurabs for the day with name fields in English and Punjabi.
 * @throws {RangeError} If the date resolves to a Nanakshahi year before 535 NS.
 * @example getGurpurabsForDate(new Date())
 */
export function getGurpurabsForDate(gregorianDate: Date = new Date()): GurpurabName[] {
  // Get Date Info
  const nanakshahi = getNanakshahiDate(gregorianDate)
  const { month, date } = nanakshahi.englishDate

  // Get gurpurab date for specific Nanakshahi Month
  const calendarDates = gurpurabs[month as keyof typeof gurpurabs]

  // Check if there is gurpurab on Date
  let gurpurabsList: GurpurabName[] = []
  calendarDates.every((value) => {
    if (value.date === date) {
      gurpurabsList = [...value.gurpurabs]
      return false
    }
    return true
  })

  // Get Movable Gurpurabs
  let movableDate: ReturnType<typeof findMovableGurpurab>
  movableGurpurabKeys.every((value) => {
    movableDate = findMovableGurpurab(value, gregorianDate.getFullYear())
    if (
      movableDate.gregorianDate.getMonth() === gregorianDate.getMonth() &&
      movableDate.gregorianDate.getDate() === gregorianDate.getDate()
    ) {
      gurpurabsList.push(movableDate.gurpurab)
      return false
    }
    return true
  })

  return gurpurabsList
}
