const months = require( 'months' )
const getNanakshahiDate = require( './getNanakshahiDate' )
const toUnicodeNum = require( './toUnicodeNum' )
const holidays = require( './holidays' )
const calendarNames = require( './calendarNames' )

/**
 * Returns all Gurpurabs and Holidays for a Nanakshahi Month
 * @param {!number} month Nanakshahi Month, 1-12
 * @return {Object} Holidays for the month with Date and name in English and Punjabi
 * @example getHolidaysForMonth( 1 )
 */
function getHolidaysForMonth( month ) {
  // Get Year
  const year = new Date().getFullYear()

  // Get Fesitval dates for specific Nanakshahi Month
  let calendarDates = holidays[ month ]

  // Get Nanakshahi Date for Each Day
  let nanakshahiDate
  let date
  calendarDates.forEach( ( value, key ) => {
    date = value.date.gregorianDate // eslint-disable-line prefer-const
    calendarDates[ key ].date.gregorianDate.monthName = months[ date.month - 1 ]
    nanakshahiDate = getNanakshahiDate( new Date( year, date.month - 1, date.day ) )
    calendarDates[ key ].date.nanakshahiDate = {
      englishDate: {
        date: nanakshahiDate.englishDate.date,
        day: nanakshahiDate.englishDate.day,
      },
      punjabiDate: {
        date: nanakshahiDate.punjabiDate.date,
        day: nanakshahiDate.punjabiDate.day,
      },
    }
  } )

  // Add month metadata
  const nanakshahiMonth = {
    englishMonth: {
      month,
      monthName: calendarNames.months.en[ month - 1 ],
    },
    punjabiMonth: {
      month: toUnicodeNum( month ),
      monthName: calendarNames.months.pa[ month - 1 ],
    },
  }

  calendarDates = {
    nanakshahiMonth,
    holidays: calendarDates,
  }

  return calendarDates
}

module.exports = getHolidaysForMonth
