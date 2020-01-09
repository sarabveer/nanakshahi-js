/* eslint-disable no-console */
const n = require( './index' )

const date = new Date()

console.log( n.getNanakshahiDate( date ) )
console.log( n.getDateFromNanakshahi( 550, 10, 23 ) )
console.log( n.getHolidaysForDay( date ) )
console.log( n.getHolidaysForMonth( 1 ) )
console.log( n.findMovableHoliday( 'gurunanak' ) )
console.log( n.findBikramiFromDate( date ) )
console.log( n.findDateFromBikramiLunar( 1723, 10, 7 ) )
console.log( n.findDateFromBikramiSolar( 1723, 9, 23 ) )
