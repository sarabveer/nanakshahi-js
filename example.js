const n = require('nanakshahi')

const date = new Date()

console.log( n.getNanakshahiDate( date ) )
console.log( n.getHolidaysForDay( date ) )
console.log( n.getHolidaysForMonth( 1 ) )
console.log( n.getMovableHoliday( 'gurunanak' ) )
console.log( n.getBikramiDate( date ) )
console.log( n.getGregorianFromBikrami( 1723, 10, 7 ) )