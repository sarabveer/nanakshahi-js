const { getNanakshahiDate, getHolidaysForMonth, getMovableHoliday, getBikramiDate, getGregorianFromBikrami } = require('nanakshahi')

const date = new Date()

console.log( getNanakshahiDate( date ) )
console.log( getHolidaysForMonth( 1 ) )
console.log( getMovableHoliday( 'gurunanak' ) )
console.log( getBikramiDate( date ) )
getGregorianFromBikrami( 1723, 10, 7 )