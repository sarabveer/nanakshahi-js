const findMovableGurpurab = require( './findMovableGurpurab' )
const getNanakshahiDate = require( './getNanakshahiDate' )
const { gurpurabs } = require( './consts' )

/**
 * Returns all Gurpurabs for a Date
 * @param {Object} [gregorianDate=new Date()] JavaScript Date() Object
 * @return {Array} Gurpurabs for the day with Date and name in English and Punjabi
 * @example getGurpurabsForDay( new Date() )
 */
function getGurpurabsForDay( gregorianDate = new Date() ) {
  // Get Date Info
  const nanakshahi = getNanakshahiDate( gregorianDate )
  const { month, date } = nanakshahi.englishDate

  // Get Fesitval date for specific Nanakshahi Month
  const calendarDates = gurpurabs[ month ]

  // Check if there is Fesitval on Date
  let gurpurabsList = []
  calendarDates.every( value => {
    if ( value.date === date ) {
      gurpurabsList = value.gurpurabs
      return false
    }
    return true
  } )

  // Get Movable Gurpurabs
  let movableDate
  const movableGurpurabs = [ 'ravidaas', 'holla', 'kabeer', 'bandichhorr', 'naamdev', 'gurunanak' ]
  movableGurpurabs.every( value => {
    movableDate = findMovableGurpurab( value, gregorianDate.getFullYear() )
    if ( movableDate.gregorianDate.getMonth() === gregorianDate.getMonth()
    && movableDate.gregorianDate.getDate() === gregorianDate.getDate() ) {
      gurpurabsList.push( movableDate.name )
      return false
    }
    return true
  } )

  return gurpurabsList
}

module.exports = getGurpurabsForDay
