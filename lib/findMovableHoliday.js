const { amritsar, movableHolidays } = require( './consts' )
const { toGurmukhiNum } = require( './utils' )

// Import Calendrica
const {
  astronomy: { universalFromStandard },
  general: { next },
  gregorian: { gregorianFromFixed },
  ModernHindu,
} = require( 'calendrica' )

const { astroLunarDayFromMoment, isHinduLunarOnOrBefore } = ModernHindu
const {
  astroHinduSunset,
  fixedFromAstroHinduLunar,
  astroHinduLunarFromFixed,
} = new ModernHindu( { location: amritsar } )

const astroHinduDateOccur = ( lYear, lMonth, lDay ) => {
  const ttry = fixedFromAstroHinduLunar( lYear, lMonth, false, lDay, false )
  const mid = astroHinduLunarFromFixed( lDay > 15 ? ttry - 5 : ttry )
  const isExpunged = lMonth !== mid.month
  const lDate = {
    year: mid.year, month: mid.month, leapMonth: mid.leapMonth, day: lDay, leapDay: false,
  }
  if ( isExpunged ) {
    return next( ttry, ( d => (
      ( !isHinduLunarOnOrBefore( astroHinduLunarFromFixed( d ), lDate ) ) - 1
    ) ) )
  }
  if ( lDay !== astroHinduLunarFromFixed( ttry ).day ) {
    return ttry - 1
  }
  return ttry
}

/**
 * Returns Gregorian Date of Movable Holiday
 * @param {string} holiday
 * Movable Holidays:<br>
 * `gurunanak` - Parkash Guru Nanak Dev Ji<br>
 * `bandichhorr` - Bandi Chhorr Divas / Diwali<br>
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
  if ( holiday === 'bandichhorr' && ( astroLunarDayFromMoment(
    universalFromStandard( astroHinduSunset( fixedDay - 1 ), amritsar ),
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
      movable: true,
    },
  }
}

module.exports = findMovableHoliday
