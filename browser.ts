import {
  findMovableGurpurab,
  getDateFromNanakshahi,
  getGurpurabsForDate,
  getGurpurabsForMonth,
  getNanakshahiDate,
} from './index'

const nanakshahi = {
  findMovableGurpurab,
  getDateFromNanakshahi,
  getGurpurabsForDate,
  getGurpurabsForMonth,
  getNanakshahiDate,
}

;(globalThis as { nanakshahi?: typeof nanakshahi }).nanakshahi = nanakshahi

export default nanakshahi
