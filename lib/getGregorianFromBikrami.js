const julian = require( 'julian' )
const months = require( 'months' )
const Calendar = require( 'kollavarsham/dist/calendar.js' )
const Celestial = require( 'kollavarsham/dist/celestial/index.js' )
const getBikramiDate = require( './getBikramiDate' )
const toUnicodeNum = require( './toUnicodeNum' )
const calendarNames = require( './calendarNames' )

const celestial = new Celestial( 'SuryaSiddhanta' ) // NOTICE: Suraj Sidhant is not used by current Punjab Jantris, Drik system is used
const calendar = new Calendar( celestial )

/**
 * Converts Bikrami Lunar Date into the Gregorian Calendar (Accuracy of plus or minus 1 day)
 * @param {!number} year Bikrami Year
 * @param {!number} year Bikrami Month
 * @param {!number} tithi Bikrami Tithi
 * @param {boolean} [paksh=false] Lunar Paksh. Default is Sudi, `true` for Vadi.
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

  // Calculate ahargana from tithi
  const kaliYear = Calendar.sakaToKali( sakaYear )
  const ahargana = calendar.kaliToAhargana( kaliYear, monthNum, tithiDay )

  // Calculate JD from ahargana
  let julianDay = Calendar.aharganaToJulianDay( ahargana )

  // Get Dates from Julian Day
  const gregorianDate = julian.toDate( julianDay )
  const gregorianYear = gregorianDate.getUTCFullYear()
  const gregorianMonth = gregorianDate.getUTCMonth()
  const gregorianDay = gregorianDate.getUTCDate()

  // Check for accuracy plus or minus 1 day
  const days = [ gregorianDay - 1, gregorianDay, gregorianDay + 1 ]

  // Check agaisnt getBikramiDate to increase accuracy
  let finalDate
  let bikramiDate
  let checkLunar
  days.every( date => {
    bikramiDate = getBikramiDate( new Date( gregorianYear, gregorianMonth, date ) )
    checkLunar = bikramiDate.lunarDate.englishDate
    if ( checkLunar.month === month
    && checkLunar.tithi === tithi
    && checkLunar.paksh === pakshName.en ) {
      finalDate = bikramiDate.gregorianDate
      julianDay = bikramiDate.julianDay // eslint-disable-line prefer-destructuring
      return false
    }
    return true
  } )

  // Check for Mal Maas and missing Tithi (ex. Holla Mahalla 2019)
  if ( finalDate === undefined ) {
    let jd

    // Check Bikrami Date for next 45 Days
    for ( let i = 0; i < 45; i++ ) { // eslint-disable-line no-plusplus
      jd = Math.trunc( julianDay ) + i
      bikramiDate = getBikramiDate( julian.toDate( jd ) )
      checkLunar = bikramiDate.lunarDate.englishDate
      if ( checkLunar.month === month
      && checkLunar.tithi === tithi
      && checkLunar.paksh === pakshName.en ) {
        finalDate = bikramiDate.gregorianDate
        julianDay = jd
        break
      }
    }

    if ( finalDate === undefined ) {
      // Check Bikrami Date for previous 45 Days
      for ( let i = 0; i < 45; i++ ) { // eslint-disable-line no-plusplus
        jd = Math.trunc( julianDay ) - i
        bikramiDate = getBikramiDate( julian.toDate( jd ) )
        checkLunar = bikramiDate.lunarDate.englishDate
        if ( checkLunar.month === month
        && checkLunar.tithi === tithi
        && checkLunar.paksh === pakshName.en ) {
          finalDate = bikramiDate.gregorianDate
          julianDay = jd
          break
        }
      }

      // Check if Tithi is missing and use Pooranmashi/Amavas
      if ( finalDate === undefined ) {
        days.every( date => {
          bikramiDate = getBikramiDate( new Date( gregorianYear, gregorianMonth, date ) )
          checkLunar = bikramiDate.lunarDate.englishDate
          if ( checkLunar.tithi !== tithi ) {
            finalDate = bikramiDate.gregorianDate
            julianDay = bikramiDate.julianDay // eslint-disable-line prefer-destructuring
            return false
          }
          return true
        } )

        // If all checks fail, pass original date ¯\_(ツ)_/¯
        if ( finalDate === undefined ) {
          finalDate = gregorianDate
        }
      }
    }
  }

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

  // Lunar Date Obj
  const lunarDate = {
    ahargana,
    englishDate,
    punjabiDate,
    pooranmashi,
  }

  // Return Gregorian Obj
  let gregorian = { // eslint-disable-line prefer-const
    gregorianDate: finalDate,
    julianDay,
    lunarDate,
  }

  if ( julianDay < 2361221 ) {
    const julianDate = Calendar.julianDayToJulianDate( julianDay )
    gregorian.julianDate = {
      year: julianDate.year,
      month: julianDate.month,
      monthName: months[ julianDate.month - 1 ],
      date: julianDate.date,
    }
  }

  return gregorian
}

module.exports = getGregorianFromBikrami
