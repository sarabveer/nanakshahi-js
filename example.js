import {
  findMovableGurpurab,
  getDateFromNanakshahi,
  getGurpurabsForDate,
  getGurpurabsForMonth,
  getNanakshahiDate,
} from 'nanakshahi'

const date = new Date()

console.log(getNanakshahiDate(date))
console.log(getDateFromNanakshahi(550, 10, 23))
console.log(getGurpurabsForDate(date))
console.log(getGurpurabsForMonth(1))
console.log(findMovableGurpurab('gurunanak'))
