const findMovableHoliday = require( './findMovableHoliday' )
const getNanakshahiDate = require( './getNanakshahiDate' )
const { holidays } = require( './consts' )

/**
 * Returns all Gurpurabs and Holidays for a Date
 * @param {Object} [gregorianDate=new Date()] JavaScript Date() Object
 * @return {Array} Holidays for the day with Date and name in English and Punjabi
 * @example getHolidaysForDay( new Date() )
 */
function getHolidaysForDay( gregorianDate = new Date() ) {
  // Get Date Info
  const nanakshahi = getNanakshahiDate( gregorianDate )
  const { month, date } = nanakshahi.englishDate

  // Get Fesitval date for specific Nanakshahi Month
  const calendarDates = holidays[ month ]

  // Check if there is Fesitval on Date
  let holidaysList = []
  calendarDates.every( value => {
    if ( value.date === date ) {
      holidaysList = value.holidays
      return false
    }
    return true
  } )

  // Get Movable Holidays
  let movableDate
  const movableHolidays = [ 'ravidaas', 'holla', 'kabeer', 'bandishhorr', 'naamdev', 'gurunanak' ]
  movableHolidays.every( value => {
    movableDate = findMovableHoliday( value, gregorianDate.getFullYear() )
    if ( movableDate.gregorianDate.getMonth() === gregorianDate.getMonth()
    && movableDate.gregorianDate.getDate() === gregorianDate.getDate() ) {
      holidaysList.push( movableDate.name )
      return false
    }
    return true
  } )

  return holidaysList
}

module.exports = getHolidaysForDay
