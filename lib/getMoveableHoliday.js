const getGregorianFromBikrami = require( './getGregorianFromBikrami' )
const toUnicodeNum = require( './toUnicodeNum' )
const movableHolidays = require( './movableHolidays' )

/**
 * Returns Gregorian Date of Movable Holiday
 * @param {string} holiday Holiday which date will be calculated. Check `movableHolidays.json`.
 * @param {!number} [year] Gregorian year, default is current year.
 * @return {Object} Holiday Date with Data
 * @example getMoveableHoliday( 'gurunanak' )
 */
function getMoveableHoliday( holiday, year = new Date().getFullYear() ) {
  // Get data for event
  const holidayData = movableHolidays[ holiday ]
  const lunarMonth = holidayData.date.month
  const { tithi } = holidayData.date
  let paksh
  if ( holidayData.date.paksh === 'Vadi' ) {
    paksh = true
  } else {
    paksh = false
  }

  // Get Bikrami Year
  const bikramiYear = year + 57

  // Get Gregorian Date for Holiday
  const { gregorianDate } = getGregorianFromBikrami( bikramiYear, lunarMonth, tithi, paksh )

  // Set Holiday Name
  const nameEnglish = `${holidayData.name.en} (${year})`
  const namePunjabi = `${holidayData.name.pa} (${toUnicodeNum( year )})`

  const moveableHoliday = {
    gregorianDate,
    name: {
      nameEnglish,
      namePunjabi,
    },
  }

  return moveableHoliday
}

module.exports = getMoveableHoliday
