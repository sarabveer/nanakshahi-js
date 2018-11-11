const { getNanakshahiDate, getBikramiDate } = require('nanakshahi')

const date = new Date()

console.log( getNanakshahiDate( date ) )
console.log( getBikramiDate( date ) )