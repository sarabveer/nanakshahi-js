const getNanakshahiDate = require( './getNanakshahiDate' )
const getDateFromNanakshahi = require( './getDateFromNanakshahi' )
const toUnicodeNum = require( './toUnicodeNum' )
const holidays = require( './holidays' )
const calendarNames = require( './calendarNames' )

/**
 * Returns all Gurpurabs and Holidays for a Nanakshahi Month
 * @param {!number} month Nanakshahi Month, 1-12
 * @param {!number} [year] Nanakshahi Year, Default is Current year
 * @return {Object} Holidays for the month with Date and name in English and Punjabi
 * @example getHolidaysForMonth( 1 )
 */
function getHolidaysForMonth( month, year = getNanakshahiDate( new Date() ).englishDate.year ) {
  // Get Fesitval dates for specific Nanakshahi Month
  let calendarDates = holidays[ month ]

  // Go though list and add dates
  const holidaysList = []
  calendarDates.forEach( value => {
    const nanakshahiDate = getDateFromNanakshahi( year, month, value.date )
    holidaysList.push( {
      date: {
        gregorianDate: nanakshahiDate.gregorianDate,
        nanakshahiDate: {
          englishDate: {
            date: nanakshahiDate.englishDate.date,
            day: nanakshahiDate.englishDate.day,
          },
          punjabiDate: {
            date: nanakshahiDate.punjabiDate.date,
            day: nanakshahiDate.punjabiDate.day,
          },
        },
      },
      holidays: value.holidays,
    } )
  } )

  // Add month metadata
  const nanakshahiMonth = {
    englishMonth: {
      month,
      monthName: calendarNames.months.en[ month - 1 ],
      year,
    },
    punjabiMonth: {
      month: toUnicodeNum( month ),
      monthName: calendarNames.months.pa[ month - 1 ],
      year: toUnicodeNum( year ),
    },
  }

  calendarDates = {
    nanakshahiMonth,
    holidays: holidaysList,
  }

  return calendarDates
}

module.exports = getHolidaysForMonth
