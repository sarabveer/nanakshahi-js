import leapYear from './leapYear'

const MIN_NANAKSHAHI_YEAR = 535

/**
 * Ensures a value is an integer.
 * @internal
 */
const assertInteger = (value: number, field: string): void => {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${field} must be an integer.`)
  }
}

/**
 * Validates that a Nanakshahi year is within supported range.
 * @internal
 */
const assertNanakshahiYear = (year: number): void => {
  assertInteger(year, 'year')
  if (year < MIN_NANAKSHAHI_YEAR) {
    throw new RangeError('Nanakshahi Year Out of Range')
  }
}

/**
 * Validates Nanakshahi month boundaries.
 * @internal
 */
function assertNanakshahiMonth(month: number): void {
  assertInteger(month, 'month')
  if (month < 1 || month > 12) {
    throw new RangeError('Nanakshahi Month must be in range [1...12].')
  }
}

/**
 * Validates generic Nanakshahi day bounds.
 * @internal
 */
function assertNanakshahiDay(date: number): void {
  assertInteger(date, 'date')
  if (date < 1 || date > 31) {
    throw new RangeError('Nanakshahi Date must be in range [1...31].')
  }
}

/**
 * Returns max allowed day for a Nanakshahi month.
 * @internal
 */
const getMaxDateForNanakshahiMonth = (month: number, year: number): 30 | 31 => {
  if (month <= 7) {
    return 31
  }

  if (month === 12 && leapYear(year)) {
    return 31
  }

  return 30
}

/**
 * Validates Nanakshahi year, month, and day as a coherent date.
 *
 * @internal
 */
const validateNanakshahiDateInput = (year: number, month: number, date: number): void => {
  assertNanakshahiYear(year)
  assertNanakshahiMonth(month)
  assertNanakshahiDay(date)

  const maxDate = getMaxDateForNanakshahiMonth(month, year)
  if (date < 1 || date > maxDate) {
    throw new RangeError(`Nanakshahi Date must be in range [1...${maxDate}] for month ${month}.`)
  }
}

export {
  assertNanakshahiYear,
  assertNanakshahiMonth,
  getMaxDateForNanakshahiMonth,
  validateNanakshahiDateInput,
}
