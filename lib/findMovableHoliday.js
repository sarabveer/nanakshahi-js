const { movableHolidays } = require( './consts' )
const { toGurmukhiNum } = require( './utils' )

// Import Calendrica 4.0
const {
  astronomy: { universalFromStandard },
  gregorian: { gregorianFromFixed },
  modernHindu: {
    HINDU_LOCATION,
    astroLunarDayFromMoment,
    astroHinduSunset,
    astroHinduDateOccur,
  },
} = require( './calendrica' )

/**
 * Returns Gregorian Date of Movable Holiday
 * @param {string} holiday
 * Movable Holidays:<br>
 * `gurunanak` - Parkash Guru Nanak Dev Ji<br>
 * `bandishhorr` - Bandi Shhorr Divas / Diwali<br>
 * `holla` - Holla Mahalla<br>
 * `kabeer` - Birthday Bhagat Kabeer Ji<br>
 * `ravidaas` - Birthday Bhagat Ravidaas Ji<br>
 * `naamdev` - Birthday Bhagat Naamdev Ji
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

  // Get Tithi in Pooranmashi System
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
  let fixedDay = astroHinduDateOccur( bikramiYear, lunarMonth, tithi, paksh )

  // Check if Diwali tithi starts day before (at sunset)
  if ( holiday === 'bandishhorr' && ( astroLunarDayFromMoment(
    universalFromStandard( astroHinduSunset( fixedDay - 1 ), HINDU_LOCATION ),
  ) === tithi ) ) {
    fixedDay -= 1
  }

  // Get Gregorian Date from R.D.
  const { year: gYear, month: gMonth, day: gDay } = gregorianFromFixed( fixedDay )

  return {
    gregorianDate: new Date( gYear, gMonth - 1, gDay ),
    name: {
      en: `${holidayData.name.en} (${year})`,
      pa: `${holidayData.name.pa} (${toGurmukhiNum( year )})`,
      type: holidayData.name.type,
    },
  }
}

module.exports = findMovableHoliday
