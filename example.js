const { getNanakshahiDate, getHolidaysForMonth, getMovableHoliday, getBikramiDate } = require('nanakshahi')

const date = new Date()

console.log( getNanakshahiDate( date ) )
console.log( getHolidaysForMonth( 1 ) )
console.log( getMovableHoliday( 'gurunanak' ) )
console.log( getBikramiDate( date ) )