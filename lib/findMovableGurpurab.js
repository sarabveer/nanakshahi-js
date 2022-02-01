const { amritsar, movableGurpurabs } = require( './consts' )

// Import Calendrica
const {
  gregorian: { gregorianFromFixed },
  ModernHindu,
} = require( 'calendrica' )

const { astroLunarDayFromMoment } = ModernHindu

const {
  astroHinduLunarHoliday,
  astroHinduSunset,
} = new ModernHindu( { location: amritsar } )

/**
 * Returns Gregorian Date of Movable Gurpurab
 * @param {string} gurpurab
 * Movable Gurpurabs:<br>
 * `gurunanak` - Parkash Guru Nanak Dev Ji<br>
 * `bandichhorr` - Bandi Chhorr Divas / Diwali<br>
 * `holla` - Holla Mahalla<br>
 * `kabeer` - Birthday Bhagat Kabeer Ji<br>
 * `ravidaas` - Birthday Bhagat Ravidaas Ji<br>
 * `naamdev` - Birthday Bhagat Naamdev Ji
 * @param {!number} [year] Gregorian year, default is current year.
 * @return {Object} Gurpurab Date with Name in English and Punjabi
 * @example findMovableGurpurab( 'gurunanak' )
 */
function findMovableGurpurab( gurpurab, year = new Date().getFullYear() ) {
  // Check if gurpurab in array
  if ( !( gurpurab in movableGurpurabs ) ) {
    throw Error( `String "${gurpurab}" not found in list of movable Gurpurabs.` )
  }

  // Get data for event
  const gurpurabData = movableGurpurabs[ gurpurab ]

  // eslint-disable-next-line prefer-const
  let { month: lunarMonth, tithi, paksh } = gurpurabData.date

  // Convert tithi in pooranmashi system to amanta system
  if ( paksh === 'Vadi' ) {
    tithi += 15
    // Use Purnimanta System
    if ( lunarMonth <= 1 ) {
      lunarMonth += 11
    } else {
      lunarMonth -= 1
    }
  }

  // Get Gregorian Date for Gurpurab
  let fixedDay = astroHinduLunarHoliday( lunarMonth, tithi, year )

  // Check if Diwali tithi starts day before (at sunset)
  if ( gurpurab === 'bandichhorr' && astroLunarDayFromMoment( astroHinduSunset( fixedDay - 1 ) ) === tithi ) {
    fixedDay -= 1
  }

  // Get Gregorian Date from R.D.
  const { year: gYear, month: gMonth, day: gDay } = gregorianFromFixed( fixedDay )

  return {
    gregorianDate: new Date( gYear, gMonth - 1, gDay ),
    name: {
      en: `${gurpurabData.name.en} (${year})`,
      pa: `${gurpurabData.name.pa} (${year})`,
      type: gurpurabData.name.type,
      movable: true,
    },
  }
}

module.exports = findMovableGurpurab
