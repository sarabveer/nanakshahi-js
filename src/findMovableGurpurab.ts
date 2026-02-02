import movableGurpurabs from './consts/movableGurpurabs'
import type { MovableGurpurab, MovableGurpurabKey } from './types'

/**
 * Validates the Gregorian year supported by movable Gurpurab tables.
 * @internal
 */
const assertMovableGurpurabYearInRange = (year: number): void => {
  if (!Number.isInteger(year)) {
    throw new TypeError('year must be an integer.')
  }
  if (year < 2003 || year > 2100) {
    throw new RangeError('Year not in range [2003...2100].')
  }
}

/**
 * Returns Gregorian date info for a movable Gurpurab between 2003 CE and 2100 CE.
 *
 * Supported keys:
 * - `gurunanak` - Parkash Guru Nanak Dev Ji
 * - `bandichhorr` - Bandi Chhorr Divas
 * - `holla` - Holla Mahalla
 * - `kabeer` - Birthday Bhagat Kabeer Ji
 * - `ravidaas` - Birthday Bhagat Ravidaas Ji
 * - `naamdev` - Birthday Bhagat Naamdev Ji
 *
 * @param gurpurab - Movable Gurpurab key.
 * @param year - Gregorian year (default: current year, range: 2003...2100).
 * @returns Gurpurab date and localized name fields.
 * @throws {TypeError} If year is not an integer.
 * @throws {RangeError} If year is outside 2003...2100.
 * @example findMovableGurpurab('gurunanak')
 */
export function findMovableGurpurab(
  gurpurab: MovableGurpurabKey,
  year: number = new Date().getFullYear(),
): MovableGurpurab {
  assertMovableGurpurabYearInRange(year)

  const { name, dates } = movableGurpurabs[gurpurab]
  const { month, day } = dates[year - 2003]

  return {
    gregorianDate: new Date(year, month - 1, day),
    gurpurab: {
      en: `${name.en} (${year})`,
      pa: `${name.pa} (${year})`,
      type: name.type,
      movable: true,
    },
  }
}
