const { movableGurpurabs } = require( './consts' )

/**
 * Returns Gregorian Date of Movable Gurpurab from 2003CE - 2100CE
 * @param {string} gurpurab
 * Movable Gurpurabs:<br>
 * `gurunanak` - Parkash Guru Nanak Dev Ji<br>
 * `bandichhorr` - Bandi Chhorr Divas / Diwali<br>
 * `holla` - Holla Mahalla<br>
 * `kabeer` - Birthday Bhagat Kabeer Ji<br>
 * `ravidaas` - Birthday Bhagat Ravidaas Ji<br>
 * `naamdev` - Birthday Bhagat Naamdev Ji
 * @param {!number} [year] Gregorian year, default is current year. Range [2003...2100]
 * @return {Object} Gurpurab Date with Name in English and Punjabi
 * @example findMovableGurpurab( 'gurunanak' )
 */
function findMovableGurpurab( gurpurab, year = new Date().getFullYear() ) {
  // Check if gurpurab in array
  if ( !( gurpurab in movableGurpurabs ) ) {
    throw Error( `String "${gurpurab}" not found in list of movable Gurpurabs.` )
  }

  if ( year < 2003 || year > 2100 ) {
    throw new RangeError( 'Year not in range [2003...2100].' )
  }

  // Get data for event
  const { name, dates } = movableGurpurabs[ gurpurab ]
  const { month, day } = dates[ year - 2003 ]

  return {
    gregorianDate: new Date( year, month - 1, day ),
    name: {
      en: `${name.en} (${year})`,
      pa: `${name.pa} (${year})`,
      type: name.type,
      movable: true,
    },
  }
}

module.exports = findMovableGurpurab
