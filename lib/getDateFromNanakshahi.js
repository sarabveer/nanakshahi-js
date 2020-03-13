const { months, weekdays } = require( './consts' )
const { leapYear, toUnicodeNum } = require( './utils' )

/**
 * Converts Nanakshahi Date into the Gregorian Calendar
 * @param {!number} year Nanakshahi Year
 * @param {!number} month Nanakshahi Month, 1-12
 * @param {!number} date Nanakshahi Day
 * @return {Object} Gregorian Date + Nanakshahi Date in English and Punjabi
 * @example getDateFromNanakshahi( 550, 10, 23 )
 */
function getDateFromNanakshahi( year, month, date ) {
  if ( year < 535 ) {
    throw new RangeError( 'Nanakshahi Date Out of Range' )
  }

  // NS Month Offsets
  const monthOffsets = [ 14, 14, 15, 15, 16, 16, 15, 15, 14, 14, 13, 12 ]

  // Calculate Gregorian Year
  const gregorianYear = month < 11 ? year + 1468 : year + 1469

  // Set month start from Nanakshahi [0..11]
  const gregorianMonth = month < 11 ? month + 1 : month - 11

  // Add days to months
  const gregorianDay = monthOffsets[ month - 1 ] + ( date - 1 )

  // Date Object
  const gregorianDate = new Date( gregorianYear, gregorianMonth, gregorianDay )

  // Get Day of Week
  const weekday = gregorianDate.getDay()

  const englishDate = {
    month,
    monthName: months[ month - 1 ].en,
    date,
    year,
    day: weekdays[ weekday ].en,
    dayShort: weekdays[ weekday ].enShort,
  }

  const punjabiDate = {
    month: toUnicodeNum( month ),
    monthName: months[ month - 1 ].pa,
    date: toUnicodeNum( date ),
    year: toUnicodeNum( year ),
    day: weekdays[ weekday ].pa,
    dayShort: weekdays[ weekday ].paShort,
  }

  return {
    gregorianDate,
    englishDate,
    punjabiDate,
    leapYear: leapYear( year + 1 ),
  }
}

module.exports = getDateFromNanakshahi
