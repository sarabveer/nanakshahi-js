const leapYear = require( 'leap-year' )
const getNanakshahiDate = require( './getNanakshahiDate' )
const getDateFromNanakshahi = require( './getDateFromNanakshahi' )
const getMovableHoliday = require( './getMovableHoliday' )
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

  // Length of Nanakshahi Months
  const monthLength = [ 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30 ]
  if ( leapYear( year + 1 ) ) {
    monthLength[ 11 ] = 31
  }

  // Check all days in month for movable holiday
  // Probably a better method to do this, but ¯\_(ツ)_/¯
  const { gregorianDate } = getDateFromNanakshahi( year, month, 1 )
  const movableHolidays = [ 'ravidaas', 'holla', 'kabeer', 'bandishhorr', 'naamdev', 'gurunanak' ]
  const movableHolidayList = []
  let movableHoliday
  movableHolidays.forEach( value => {
    movableHoliday = getMovableHoliday( value, gregorianDate.getFullYear() )
    movableHolidayList.push( movableHoliday )
  } )

  for ( const day of Array( monthLength[ month - 1 ] ).keys() ) {
    // Get Gregorian Date
    const date = new Date( gregorianDate.getTime() )
    date.setDate( gregorianDate.getDate() + day )
    movableHolidayList.forEach( holiday => {
      const holidayDate = holiday.gregorianDate
      // eslint-disable-next-line max-len
      if ( holidayDate.getMonth() === date.getMonth() && holidayDate.getDate() === date.getDate() ) {
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
          holidays: [ holiday.name ],
        } )
      }
    } )
  }

  // Sort holidays based on Nanakshahi Date
  holidaysList.sort( ( a, b ) => {
    const firstDate = a.date.nanakshahiDate.englishDate.date
    const secondDate = b.date.nanakshahiDate.englishDate.date
    if ( firstDate < secondDate ) {
      return -1
    }
    if ( firstDate > secondDate ) {
      return 1
    }
    return 0
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
