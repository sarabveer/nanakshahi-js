const { months, weekdays } = require( './consts' )
const { leapYear, toUnicodeNum } = require( './utils' )

/**
 * Converts given Gregorian Date to the corresponding date in the Nanakshahi Calendar
 * @param {Object} gregorianDate JavaScript Date() Object
 * @return {Object} Nanakshahi Date in English and Punjabi
 * @example getNanakshahiDate( new Date() )
 */
function getNanakshahiDate( gregorianDate ) {
  const gregorianDay = gregorianDate.getDate()
  const gregorianMonth = gregorianDate.getMonth() + 1 // Start from 1
  const gregorianYear = gregorianDate.getFullYear()
  const weekday = gregorianDate.getDay()

  // Calculate Nanakshahi Year - March 14 (1 Chet) Nanakshahi New Year
  let nanakshahiYear
  if ( gregorianMonth < 3 ) {
    nanakshahiYear = gregorianYear - 1469
  } else if ( gregorianMonth === 3 && gregorianDay < 14 ) {
    nanakshahiYear = gregorianYear - 1469
  } else {
    nanakshahiYear = gregorianYear - 1468
  }

  if ( nanakshahiYear < 535 ) {
    throw new RangeError( 'Nanakshahi Date Out of Range' )
  }

  // Check if leap year
  const leap = leapYear( nanakshahiYear + 1 )

  // Calculate Nanakshahi Date
  let nanakshahiDay
  let nanakshahiMonth

  if ( gregorianMonth === 1 && gregorianDay <= 12 ) {
    nanakshahiDay = gregorianDay + 18
    if ( nanakshahiDay > 30 ) {
      nanakshahiMonth = 11
      nanakshahiDay -= 30
    } else {
      nanakshahiMonth = 10
    }
  } else if ( gregorianMonth === 1 && gregorianDay > 12 ) {
    nanakshahiDay = gregorianDay - 12
    nanakshahiMonth = 11
  } else if ( gregorianMonth === 2 && gregorianDay <= 11 ) {
    nanakshahiDay = gregorianDay + 19
    if ( nanakshahiDay > 30 ) {
      nanakshahiMonth = 12
      nanakshahiDay -= 30
    } else {
      nanakshahiMonth = 11
    }
  } else if ( gregorianMonth === 2 && gregorianDay > 11 ) {
    nanakshahiDay = gregorianDay - 11
    nanakshahiMonth = 12
  } else if ( gregorianMonth === 3 && gregorianDay <= 13 ) {
    // Check if it is leap year
    if ( leap === true ) {
      nanakshahiDay = gregorianDay + 18
      if ( nanakshahiDay > 31 ) {
        nanakshahiMonth = 1
        nanakshahiDay -= 31
      } else {
        nanakshahiMonth = 12
      }
    } else {
      nanakshahiDay = gregorianDay + 17
      if ( nanakshahiDay > 30 ) {
        nanakshahiMonth = 1
        nanakshahiDay -= 30
      } else {
        nanakshahiMonth = 12
      }
    }
  } else if ( gregorianMonth === 3 && gregorianDay > 13 ) {
    nanakshahiDay = gregorianDay - 13
    nanakshahiMonth = 1
  } else if ( gregorianMonth === 4 && gregorianDay <= 13 ) {
    nanakshahiDay = gregorianDay + 18
    if ( nanakshahiDay > 31 ) {
      nanakshahiMonth = 2
      nanakshahiDay -= 31
    } else {
      nanakshahiMonth = 1
    }
  } else if ( gregorianMonth === 4 && gregorianDay > 13 ) {
    nanakshahiDay = gregorianDay - 13
    nanakshahiMonth = 2
  } else if ( gregorianMonth === 5 && gregorianDay <= 14 ) {
    nanakshahiDay = gregorianDay + 17
    if ( nanakshahiDay > 31 ) {
      nanakshahiMonth = 3
      nanakshahiDay -= 31
    } else {
      nanakshahiMonth = 2
    }
  } else if ( gregorianMonth === 5 && gregorianDay > 14 ) {
    nanakshahiDay = gregorianDay - 14
    nanakshahiMonth = 3
  } else if ( gregorianMonth === 6 && gregorianDay <= 14 ) {
    nanakshahiDay = gregorianDay + 17
    if ( nanakshahiDay > 31 ) {
      nanakshahiMonth = 4
      nanakshahiDay -= 31
    } else {
      nanakshahiMonth = 3
    }
  } else if ( gregorianMonth === 6 && gregorianDay > 14 ) {
    nanakshahiDay = gregorianDay - 14
    nanakshahiMonth = 4
  } else if ( gregorianMonth === 7 && gregorianDay <= 15 ) {
    nanakshahiDay = gregorianDay + 16
    if ( nanakshahiDay > 31 ) {
      nanakshahiMonth = 5
      nanakshahiDay -= 31
    } else {
      nanakshahiMonth = 4
    }
  } else if ( gregorianMonth === 7 && gregorianDay > 15 ) {
    nanakshahiDay = gregorianDay - 15
    nanakshahiMonth = 5
  } else if ( gregorianMonth === 8 && gregorianDay <= 15 ) {
    nanakshahiDay = gregorianDay + 16
    if ( nanakshahiDay > 31 ) {
      nanakshahiMonth = 6
      nanakshahiDay -= 31
    } else {
      nanakshahiMonth = 5
    }
  } else if ( gregorianMonth === 8 && gregorianDay > 15 ) {
    nanakshahiDay = gregorianDay - 15
    nanakshahiMonth = 6
  } else if ( gregorianMonth === 9 && gregorianDay <= 14 ) {
    nanakshahiDay = gregorianDay + 16
    if ( nanakshahiDay > 30 ) {
      nanakshahiMonth = 7
      nanakshahiDay -= 30
    } else {
      nanakshahiMonth = 6
    }
  } else if ( gregorianMonth === 9 && gregorianDay > 14 ) {
    nanakshahiDay = gregorianDay - 14
    nanakshahiMonth = 7
  } else if ( gregorianMonth === 10 && gregorianDay <= 14 ) {
    nanakshahiDay = gregorianDay + 16
    if ( nanakshahiDay > 30 ) {
      nanakshahiMonth = 8
      nanakshahiDay -= 30
    } else {
      nanakshahiMonth = 7
    }
  } else if ( gregorianMonth === 10 && gregorianDay > 14 ) {
    nanakshahiDay = gregorianDay - 14
    nanakshahiMonth = 8
  } else if ( gregorianMonth === 11 && gregorianDay <= 13 ) {
    nanakshahiDay = gregorianDay + 17
    if ( nanakshahiDay > 30 ) {
      nanakshahiMonth = 9
      nanakshahiDay -= 30
    } else {
      nanakshahiMonth = 8
    }
  } else if ( gregorianMonth === 11 && gregorianDay > 13 ) {
    nanakshahiDay = gregorianDay - 13
    nanakshahiMonth = 9
  } else if ( gregorianMonth === 12 && gregorianDay <= 13 ) {
    nanakshahiDay = gregorianDay + 17
    if ( nanakshahiDay > 30 ) {
      nanakshahiMonth = 10
      nanakshahiDay -= 30
    } else {
      nanakshahiMonth = 9
    }
  } else if ( gregorianMonth === 12 && gregorianDay > 13 ) {
    nanakshahiDay = gregorianDay - 13
    nanakshahiMonth = 10
  } else {
    nanakshahiDay = 0
    nanakshahiMonth = 0
  }

  const englishDate = {
    month: nanakshahiMonth,
    monthName: months[ nanakshahiMonth - 1 ].en,
    date: nanakshahiDay,
    year: nanakshahiYear,
    day: weekdays[ weekday ].en,
    dayShort: weekdays[ weekday ].enShort,
  }

  const punjabiDate = {
    month: toUnicodeNum( nanakshahiMonth ),
    monthName: months[ nanakshahiMonth - 1 ].pa,
    date: toUnicodeNum( nanakshahiDay ),
    year: toUnicodeNum( nanakshahiYear ),
    day: weekdays[ weekday ].pa,
    dayShort: weekdays[ weekday ].paShort,
  }

  const nanakshahi = {
    gregorianDate,
    englishDate,
    punjabiDate,
    leap,
  }

  return nanakshahi
}

module.exports = getNanakshahiDate
