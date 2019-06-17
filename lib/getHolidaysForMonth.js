const getNanakshahiDate = require( './getNanakshahiDate' )
const getDateFromNanakshahi = require( './getDateFromNanakshahi' )
const getMovableHoliday = require( './getMovableHoliday' )
const { leapYear, toUnicodeNum } = require( './utils' )
const { holidays, months } = require( './consts' )

/**
 * Returns all Gurpurabs and Holidays for a Nanakshahi Month
 * @param {!number} month Nanakshahi Month, 1-12
 * @param {!number} [year] Nanakshahi Year, Default is Current year
 * @return {Object} Holidays for the month with Date and name in English and Punjabi
 * @example getHolidaysForMonth( 1 )
 */
module.exports = ( month, year = ( new Date().getFullYear() - 1468 ) ) => {
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

  // Length of Nanakshahi Months
  const monthLength = [ 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30 ]
  if ( leapYear( year + 1 ) ) {
    monthLength[ 11 ] = 31
  }

  // Check all moveable holidays fall in Nanakshahi month
  const startMonth = getDateFromNanakshahi( year, month, 1 ).gregorianDate
  const movableHolidays = [ 'ravidaas', 'holla', 'kabeer', 'bandishhorr', 'naamdev', 'gurunanak' ]
  movableHolidays.forEach( value => {
    const movableHoliday = getMovableHoliday( value, startMonth.getFullYear() )
    const holidayDate = movableHoliday.gregorianDate
    const diffDays = ( holidayDate.getTime() - startMonth.getTime() ) / ( 1000 * 60 * 60 * 24 )
    if ( diffDays < monthLength[ month - 1 ] && diffDays > 0 ) {
      const { englishDate, punjabiDate } = getNanakshahiDate( holidayDate )
      holidaysList.push( {
        date: {
          gregorianDate: holidayDate,
          nanakshahiDate: {
            englishDate: {
              date: englishDate.date,
              day: englishDate.day,
            },
            punjabiDate: {
              date: punjabiDate.date,
              day: punjabiDate.day,
            },
          },
        },
        holidays: [ movableHoliday.name ],
      } )
    }
  } )

  // Sort holidays based on Nanakshahi Date
  holidaysList.sort( ( a, b ) => (
    a.date.nanakshahiDate.englishDate.date - b.date.nanakshahiDate.englishDate.date
  ) )

  // Add month metadata
  const nanakshahiMonth = {
    englishMonth: {
      month,
      monthName: months[ month - 1 ].en,
      year,
    },
    punjabiMonth: {
      month: toUnicodeNum( month ),
      monthName: months[ month - 1 ].pa,
      year: toUnicodeNum( year ),
    },
  }

  calendarDates = {
    nanakshahiMonth,
    holidays: holidaysList,
  }

  return calendarDates
}
