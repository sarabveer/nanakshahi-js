const findMovableGurpurab = require( './findMovableGurpurab' )
const getDateFromNanakshahi = require( './getDateFromNanakshahi' )
const getNanakshahiDate = require( './getNanakshahiDate' )
const { gurpurabs, months } = require( './consts' )
const { leapYear, toGurmukhiNum } = require( './utils' )

/**
 * Returns all Gurpurabs for a Nanakshahi Month
 * @param {!number} month Nanakshahi Month, 1-12
 * @param {!number} [year] Nanakshahi Year. Default is current Nanakshahi Year.
 * @return {Object} Gurpurabs for the month with Date and name in English and Punjabi
 * @example getGurpurabsForMonth( 1 )
 */
function getGurpurabsForMonth( month, year = getNanakshahiDate().englishDate.year ) {
  // Get Fesitval dates for specific Nanakshahi Month
  const calendarDates = gurpurabs[ month ]

  // Go though list and add dates
  const gurpurabsList = []
  calendarDates.forEach( value => {
    const nanakshahiDate = getDateFromNanakshahi( year, month, value.date )
    gurpurabsList.push( {
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
      gurpurabs: value.gurpurabs,
    } )
  } )

  // Length of Nanakshahi Months
  const monthLength = [
    31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30,
    leapYear( year + 1 ) ? 31 : 30, // Phagun Leap Check
  ]

  // Check all moveable gurpurabs fall in Nanakshahi month
  const startMonth = getDateFromNanakshahi( year, month, 1 ).gregorianDate
  const movableGurpurabs = [ 'ravidaas', 'holla', 'kabeer', 'bandichhorr', 'naamdev', 'gurunanak' ]
  movableGurpurabs.forEach( value => {
    const { gregorianDate, name } = findMovableGurpurab( value, startMonth.getFullYear() )
    const diffDays = ( gregorianDate.getTime() - startMonth.getTime() ) / ( 1000 * 60 * 60 * 24 )
    if ( diffDays < monthLength[ month - 1 ] && diffDays >= 0 ) {
      const { englishDate, punjabiDate } = getNanakshahiDate( gregorianDate )
      gurpurabsList.push( {
        date: {
          gregorianDate,
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
        gurpurabs: [ name ],
      } )
    }
  } )

  // Sort gurpurabs based on Nanakshahi Date
  gurpurabsList.sort( ( a, b ) => (
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
      month: toGurmukhiNum( month ),
      monthName: months[ month - 1 ].pa,
      year: toGurmukhiNum( year ),
    },
  }

  return {
    nanakshahiMonth,
    gurpurabs: gurpurabsList,
  }
}

module.exports = getGurpurabsForMonth
