const { leapYear, toGurmukhiNum } = require( './utils' )
const { months, weekdays } = require( './consts' )

/**
 * Converts Nanakshahi Date into the Gregorian Calendar
 * @param {!number} year Nanakshahi Year
 * @param {!number} month Nanakshahi Month, 1-12
 * @param {!number} date Nanakshahi Day
 * @return {Object} Gregorian Date + Nanakshahi Date in English and Punjabi
 * @example getDateFromNanakshahi( 550, 10, 23 )
 */
function getDateFromNanakshahi( year, month, date ) {
  // Check if before 535 N.S. (Nanakshahi Adoption)
  if ( year < 535 ) {
    throw new RangeError( 'Nanakshahi Date Out of Range' )
  }

  // NS Month Offsets
  const monthOffsets = [ 14, 14, 15, 15, 16, 16, 15, 15, 14, 14, 13, 12 ]

  // Date Object
  const gregorianDate = new Date(
    // Calculate Gregorian Year
    month < 11 ? year + 1468 : year + 1469,
    // Set month start from Nanakshahi [0..11]
    month < 11 ? month + 1 : month - 11,
    // Add days to months
    monthOffsets[ month - 1 ] + ( date - 1 ),
  )

  // Get Day of Week
  const weekday = gregorianDate.getDay()

  return {
    gregorianDate,
    englishDate: {
      month,
      monthName: months[ month - 1 ].en,
      date,
      year,
      day: weekdays[ weekday ].en,
      dayShort: weekdays[ weekday ].enShort,
    },
    punjabiDate: {
      month: toGurmukhiNum( month ),
      monthName: months[ month - 1 ].pa,
      date: toGurmukhiNum( date ),
      year: toGurmukhiNum( year ),
      day: weekdays[ weekday ].pa,
      dayShort: weekdays[ weekday ].paShort,
    },
    leapYear: leapYear( year ),
  }
}

module.exports = getDateFromNanakshahi
