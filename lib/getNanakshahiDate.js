const { months, weekdays } = require( './consts' )
const { leapYear, toUnicodeNum } = require( './utils' )

/**
 * Converts given Gregorian Date to the corresponding date in the Nanakshahi Calendar
 * @param {Object} gregorianDate JavaScript Date() Object
 * @return {Object} Nanakshahi Date in English and Punjabi
 * @example getNanakshahiDate( new Date() )
 */
function getNanakshahiDate( gregorianDate ) {
  // NS Month Offsets
  const monthOffsets = [ 14, 14, 15, 15, 16, 16, 15, 15, 14, 14, 13, 12 ]

  // Calculate Nanakshahi Year - March 14 (1 Chet) Nanakshahi New Year
  const nsNewYear = new Date( gregorianDate.getFullYear(), 2, 14 )
  let nsYear = gregorianDate.getFullYear() - 1469
  if ( gregorianDate >= nsNewYear ) {
    nsYear += 1
  }
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
    const firstOfNsMonth = Date.UTC(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() - 1,
      monthOffsets[ nsMonth ],
    )
    const unixTime = Date.UTC(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth(),
      gregorianDate.getDate(),
    )
    nsDate = ( ( unixTime - firstOfNsMonth ) / 86400000 ) + 1
  }

  // Get Day of Week
  const weekday = gregorianDate.getDay()

  const englishDate = {
    month: nsMonth + 1,
    monthName: months[ nsMonth ].en,
    date: nsDate,
    year: nsYear,
    day: weekdays[ weekday ].en,
    dayShort: weekdays[ weekday ].enShort,
  }

  const punjabiDate = {
    month: toUnicodeNum( nsMonth + 1 ),
    monthName: months[ nsMonth ].pa,
    date: toUnicodeNum( nsDate ),
    year: toUnicodeNum( nsYear ),
    day: weekdays[ weekday ].pa,
    dayShort: weekdays[ weekday ].paShort,
  }

  return {
    gregorianDate,
    englishDate,
    punjabiDate,
    leapYear: leapYear( nsYear + 1 ),
  }
}

module.exports = getNanakshahiDate
