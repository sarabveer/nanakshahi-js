const { movableHolidays } = require( './consts' )
const { toUnicodeNum } = require( './utils' )

// Import Calendrica 4.0
const {
  general: { unixFromMoment },
  modernHindu: {
    astroLunarDayFromMoment,
    astroHinduSunset,
    astroHinduDateOccur,
  },
} = require( './calendrica' )

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
 * @example findMovableHoliday( 'gurunanak' )
 */
function findMovableHoliday( holiday, year = new Date().getFullYear() ) {
  // Get data for event
  const holidayData = movableHolidays[ holiday ]
  // eslint-disable-next-line prefer-const
  let { month: lunarMonth, tithi, paksh: lunarPaksh } = holidayData.date

  // Get Bikrami Year
  let bikramiYear = holiday === 'ravidaas' ? year + 56 : year + 57

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
  const fixedDay = astroHinduDateOccur( bikramiYear, lunarMonth, tithi, paksh )

  // Get Dates from Julian Day
  const gregorianDate = new Date( unixFromMoment( fixedDay ) * 1000 )

  // Check if Diwali tithi starts day before (at sunset)
  if ( holiday === 'bandishhorr' && ( astroLunarDayFromMoment( astroHinduSunset( fixedDay - 1 ) ) === tithi ) ) {
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

module.exports = findMovableHoliday
