import gurpurabs from './src/consts/gurpurabs'
import months from './src/consts/months'
import weekdays from './src/consts/weekdays'

export { findMovableGurpurab } from './src/findMovableGurpurab'
export { getDateFromNanakshahi } from './src/getDateFromNanakshahi'
export { getGurpurabsForDate } from './src/getGurpurabsForDate'
export { getGurpurabsForMonth } from './src/getGurpurabsForMonth'
export { getNanakshahiDate } from './src/getNanakshahiDate'

export const consts = { gurpurabs, months, weekdays } as const

export type {
  EnglishDate,
  GurpurabName,
  GurpurabsForMonth,
  GurpurabType,
  MovableGurpurab,
  MovableGurpurabKey,
  NanakshahiDate,
  PunjabiDate,
} from './src/types'
