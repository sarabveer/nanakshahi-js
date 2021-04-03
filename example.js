const n = require( 'nanakshahi' )

const date = new Date()

console.log( n.getNanakshahiDate( date ) )
console.log( n.getDateFromNanakshahi( 550, 10, 23 ) )
console.log( n.getGurpurabsForDay( date ) )
console.log( n.getGurpurabsForMonth( 1 ) )
console.log( n.findMovableGurpurab( 'gurunanak' ) )
