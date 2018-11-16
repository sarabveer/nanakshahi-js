const months = require( 'months' )
const Calendar = require( 'kollavarsham/dist/calendar.js' )
const Celestial = require( 'kollavarsham/dist/celestial/index.js' )
const calendarNames = require( './calendarNames' )
const toUnicodeNum = require( './toUnicodeNum' )

const celestial = new Celestial( 'SuryaSiddhanta' ) // NOTICE: Suraj Sidhant is not used by current Punjab Jantris, Drik system is used
const calendar = new Calendar( celestial )

/**
 * Converts given Bikrami Lunar Date to the corresponding date in the Gregorian Calendar
 * @param {!number} year Bikrami Year
 * @param {!month} year Bikrami Month
 * @param {!tithi} tithi Bikrami Tithi
 * @param {boolean} [paksh=false] Lunar Paksh. Default is Sudi, true for Vadi.
 * @return {Object} Gregorian Date
 * @example getGregorianFromBikrami( 1723, 9, 7 )
 */
function getGregorianFromBikrami( year, month, tithi, paksh = false ) {
  // Convert Bikrami Year into Saka
  let sakaYear = year - 135
  let monthNum = month - 1
  let tithiDay = tithi

  // If Paksh is Vadi, add 15 days to tithi
  let pakshName
  if ( paksh === true ) {
    pakshName = calendarNames.paksh.vadi
    tithiDay += 15
    // Use Purnimanta System
    if ( monthNum <= 0 ) {
      monthNum += 11
      sakaYear -= 1
    } else {
      monthNum -= 1
    }
  } else {
    pakshName = calendarNames.paksh.sudi
  }

  const kaliYear = Calendar.sakaToKali( sakaYear )
  const ahargana = calendar.kaliToAhargana( kaliYear, monthNum, tithiDay )

  const julianDay = Calendar.aharganaToJulianDay( ahargana )

  const gregorianDate = Calendar.julianDayToGregorianDate( julianDay )
  const julianDate = Calendar.julianDayToJulianDate( julianDay )

  // Pooranmashi
  let pooranmashi
  if ( paksh === false && tithi === 15 ) {
    pooranmashi = true
  } else {
    pooranmashi = false
  }

  const englishDate = {
    month,
    monthName: calendarNames.months.en[ month - 1 ],
    paksh: pakshName.en,
    tithi,
    year,
  }

  const punjabiDate = {
    month: toUnicodeNum( month ),
    monthName: calendarNames.months.pa[ month - 1 ],
    paksh: pakshName.pa,
    tithi: toUnicodeNum( tithi ),
    year: toUnicodeNum( year ),
  }

  const lunarDate = {
    ahargana,
    englishDate,
    punjabiDate,
    pooranmashi,
  }

  const julian = {
    year: julianDate.year,
    month: julianDate.month,
    monthName: months[ julianDate.month - 1 ],
    date: julianDate.date,
  }

  const gregorian = {
    gregorianDate,
    julianDay,
    lunarDate,
    julianDate: julian,
  }

  return gregorian
}

module.exports = getGregorianFromBikrami
