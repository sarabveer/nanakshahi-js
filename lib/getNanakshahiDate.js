const { leapYear, toGurmukhiNum } = require( './utils' )
const { months, weekdays } = require( './consts' )

/**
 * Converts given Gregorian Date to the corresponding date in the Nanakshahi Calendar
 * @param {Object} [gregorianDate=new Date()] JavaScript Date() Object
 * @return {Object} Nanakshahi Date in English and Punjabi
 * @example getNanakshahiDate( new Date() )
 */
function getNanakshahiDate( gregorianDate = new Date() ) {
  // NS Month Offsets
  const monthOffsets = [ 14, 14, 15, 15, 16, 16, 15, 15, 14, 14, 13, 12 ]

  // Calculate Nanakshahi Year - March 14 (1 Chet) Nanakshahi New Year
  const nsYear = gregorianDate >= new Date( gregorianDate.getFullYear(), 2, 14 )
    ? gregorianDate.getFullYear() - 1468
    : gregorianDate.getFullYear() - 1469

  // Check if before 535 N.S. (Nanakshahi Adoption)
  if ( nsYear < 535 ) {
    throw new RangeError( 'Nanakshahi Date Out of Range' )
  }

  // Calculate Nanakshahi Date
  let nsMonth = ( gregorianDate.getMonth() + 9 ) % 12
  const nsNextMonth = ( nsMonth + 1 ) % 12
  let nsDate

  if ( gregorianDate.getDate() >= monthOffsets[ nsNextMonth ] ) {
    nsMonth = nsNextMonth
    nsDate = gregorianDate.getDate() - monthOffsets[ nsNextMonth ] + 1
  } else {
    const gregorianMonths = [
      31,
      leapYear( gregorianDate.getFullYear() ) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ]
    nsDate = gregorianMonths[ ( gregorianDate.getMonth() + 11 ) % 12 ]
      - monthOffsets[ nsMonth ] + gregorianDate.getDate() + 1
  }

  // Get Day of Week
  const weekday = gregorianDate.getDay()

  return {
    gregorianDate,
    englishDate: {
      month: nsMonth + 1,
      monthName: months[ nsMonth ].en,
      date: nsDate,
      year: nsYear,
      day: weekdays[ weekday ].en,
      dayShort: weekdays[ weekday ].enShort,
    },
    punjabiDate: {
      month: toGurmukhiNum( nsMonth + 1 ),
      monthName: months[ nsMonth ].pa,
      date: toGurmukhiNum( nsDate ),
      year: toGurmukhiNum( nsYear ),
      day: weekdays[ weekday ].pa,
      dayShort: weekdays[ weekday ].paShort,
    },
    leapYear: leapYear( nsYear ),
  }
}

module.exports = getNanakshahiDate
