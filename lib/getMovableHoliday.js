const getGregorianFromBikrami = require( './getGregorianFromBikrami' )
const toUnicodeNum = require( './toUnicodeNum' )
const movableHolidays = require( './movableHolidays' )

/**
 * Returns Gregorian Date of Movable Holiday
 * Movable Holidays List:
 * - `gurunanak` Parkash Guru Nanak Dev Ji
 * - `bandishhorr` Bandi Shhorr Divas / Diwali
 * - `holla` Holla Mahalla
 * - `kabeer` Birthday Bhagat Kabeer Ji
 * - `ravidaas` Birthday Bhagat Ravidaas Ji
 * - `naamdev` Birthday Bhagat Naamdev Ji
 * @param {string} holiday Holiday which date will be calculated.
 * @param {!number} [year] Gregorian year, default is current year.
 * @return {Object} Holiday Date with Name in English and Punjabi
 * @example getMovableHoliday( 'gurunanak' )
 */
function getMovableHoliday( holiday, year = new Date().getFullYear() ) {
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
  let bikramiYear = year + 57
  if ( holiday === 'ravidaas' ) {
    bikramiYear -= 1
  }

  // Get Gregorian Date for Holiday
  const { gregorianDate, lunarDate } = getGregorianFromBikrami( bikramiYear, lunarMonth, tithi, paksh ) // eslint-disable-line max-len

  // Check if Diwali tithi starts day before
  if ( holiday === 'bandishhorr' && lunarDate.tithiFraction > 0.6 ) {
    gregorianDate.setUTCDate( gregorianDate.getUTCDate() - 1 )
  }

  // Set Holiday Name
  const nameEnglish = `${holidayData.name.en} (${year})`
  const namePunjabi = `${holidayData.name.pa} (${toUnicodeNum( year )})`
  const { type } = holidayData.name

  const moveableHoliday = {
    gregorianDate,
    name: {
      en: nameEnglish,
      pa: namePunjabi,
      type,
    },
  }

  return moveableHoliday
}

module.exports = getMovableHoliday
