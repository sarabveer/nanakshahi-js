const julian = require( 'julian' )
const { toUnicodeNum, calendrica } = require( './utils' )
const { movableHolidays } = require( './consts' )

const { jdFromFixed, hinduLunarDayFromMoment, hinduSunset, hinduDateOccur } = calendrica

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
  // eslint-disable-next-line prefer-const
  let { month: lunarMonth, tithi, paksh: lunarPaksh } = holidayData.date

  // Get Bikrami Year
  let bikramiYear = year + 57
  if ( holiday === 'ravidaas' ) {
    bikramiYear -= 1
  }

  // Get Tithi is Pooranmashi System
  const paksh = lunarPaksh === 'Vadi'
  if ( paksh === true ) {
    tithi += 15
    // Use Purnimanta System
    if ( lunarMonth <= 1 ) {
      lunarMonth += 11
      bikramiYear -= 1
    } else {
      lunarMonth -= 1
    }
  }

  // Get Gregorian Date for Holiday
  const fixedDay = hinduDateOccur( bikramiYear, lunarMonth, tithi, paksh ) // eslint-disable-line max-len
  const julianDay = jdFromFixed( fixedDay )

  // Get Dates from Julian Day
  const gregorianLocalDate = julian.toDate( julianDay )
  const gregorianYear = gregorianLocalDate.getUTCFullYear()
  const gregorianMonth = gregorianLocalDate.getUTCMonth()
  const gregorianDay = gregorianLocalDate.getUTCDate()
  const gregorianDate = new Date( gregorianYear, gregorianMonth, gregorianDay )

  // Check if Diwali tithi starts day before (at sunset)
  if ( holiday === 'bandishhorr' && ( hinduLunarDayFromMoment( hinduSunset( fixedDay - 1 ) ) === tithi ) ) {
    gregorianDate.setUTCDate( gregorianDate.getUTCDate() - 1 )
  }

  // Set Holiday Name
  const nameEnglish = `${holidayData.name.en} (${year})`
  const namePunjabi = `${holidayData.name.pa} (${toUnicodeNum( year )})`
  const { type } = holidayData.name

  return {
    gregorianDate,
    name: {
      en: nameEnglish,
      pa: namePunjabi,
      type,
    },
  }
}

module.exports = getMovableHoliday
