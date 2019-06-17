/**
 * Convert from JD to Julian Calendar Date
 * @param {number} julianDay Julian Day count
 * @return {object} Julian Year, Month, and Day
 * @example fromJulianDayToJulianDate(2458651)
 * @private
 */
module.exports = julianDay => {
  const j = Math.trunc( julianDay ) + 1402
  const k = Math.trunc( ( j - 1 ) / 1461 )
  const l = j - 1461 * k
  const n = Math.trunc( ( l - 1 ) / 365 ) - Math.trunc( l / 1461 )
  const i = l - 365 * n + 30
  const J = Math.trunc( 80 * i / 2447 )
  const I = Math.trunc( J / 11 )

  const day = i - Math.trunc( 2447 * J / 80 )
  const month = J + 2 - 12 * I
  const year = 4 * k + n + I - 4716

  return { year, month, day }
}
