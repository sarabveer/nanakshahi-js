const julian = require( 'julian' )
const englishMonths = require( 'months' )
const Calendar = require( 'kollavarsham/dist/calendar.js' )
const Celestial = require( 'kollavarsham/dist/celestial/index.js' )
const getPanchang = require( './getPanchang' )
const toUnicodeNum = require( './utils/toUnicodeNum' )
const months = require( './json/months' )
const pakshNames = require( './json/paksh' )

const celestial = new Celestial( 'SuryaSiddhanta' ) // NOTICE: Suraj Sidhant is not used by current Punjab Jantris, Drik system is used
const calendar = new Calendar( celestial )

/**
 * Converts Bikrami Lunar Date into the Gregorian Calendar (Accuracy of plus or minus 1 day)
 * @param {!number} year Bikrami Year
 * @param {!number} month Bikrami Month
 * @param {!number} tithi Bikrami Tithi
 * @param {boolean} [paksh=false] Lunar Paksh. Default is Sudi, `true` for Vadi.
 * @return {Object} Gregorian Date
 * @example getDateFromLunarTithi( 1723, 10, 7 )
 */
function getDateFromLunarTithi( year, month, tithi, paksh = false ) {
  // Convert Bikrami Year into Saka
  let sakaYear = year - 135
  let monthNum = month - 1
  let tithiDay = tithi

  // If Paksh is Vadi, add 15 days to tithi
  let pakshName
  if ( paksh === true ) {
    pakshName = pakshNames.vadi
    tithiDay += 15
    // Use Purnimanta System
    if ( monthNum <= 0 ) {
      monthNum += 11
      sakaYear -= 1
    } else {
      monthNum -= 1
    }
  } else {
    pakshName = pakshNames.sudi
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

  // Check agaisnt getPanchang to increase accuracy
  let finalDate
  let panchang
  let checkLunar
  days.every( date => {
    panchang = getPanchang( new Date( gregorianYear, gregorianMonth, date ) )
    checkLunar = panchang.lunarDate.englishDate
    if ( checkLunar.month === month
    && checkLunar.tithi === tithi
    && checkLunar.paksh === pakshName.en ) {
      finalDate = panchang.gregorianDate
      julianDay = panchang.julianDay // eslint-disable-line prefer-destructuring
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
      panchang = getPanchang( julian.toDate( jd ) )
      checkLunar = panchang.lunarDate.englishDate
      if ( checkLunar.month === month
      && checkLunar.tithi === tithi
      && checkLunar.paksh === pakshName.en ) {
        finalDate = panchang.gregorianDate
        julianDay = jd
        break
      }
    }

    if ( finalDate === undefined ) {
      // Check Bikrami Date for previous 45 Days
      for ( let i = 0; i < 45; i++ ) { // eslint-disable-line no-plusplus
        jd = Math.trunc( julianDay ) - i
        panchang = getPanchang( julian.toDate( jd ) )
        checkLunar = panchang.lunarDate.englishDate
        if ( checkLunar.month === month
        && checkLunar.tithi === tithi
        && checkLunar.paksh === pakshName.en ) {
          finalDate = panchang.gregorianDate
          julianDay = jd
          break
        }
      }

      // Check if Tithi is missing and use Pooranmashi/Amavas
      if ( finalDate === undefined ) {
        days.every( date => {
          panchang = getPanchang( new Date( gregorianYear, gregorianMonth, date ) )
          checkLunar = panchang.lunarDate.englishDate
          if ( checkLunar.tithi !== tithi ) {
            finalDate = panchang.gregorianDate
            julianDay = panchang.julianDay // eslint-disable-line prefer-destructuring
            return false
          }
          return true
        } )

        // If all checks fail, pass original date ¯\_(ツ)_/¯
        if ( finalDate === undefined ) {
          panchang = getPanchang( new Date( gregorianYear, gregorianMonth, gregorianDay ) )
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
    monthName: months[ month - 1 ].en,
    paksh: pakshName.en,
    tithi,
    year,
  }

  const punjabiDate = {
    month: toUnicodeNum( month ),
    monthName: months[ month - 1 ].pa,
    paksh: pakshName.pa,
    tithi: toUnicodeNum( tithi ),
    year: toUnicodeNum( year ),
  }

  // Lunar Date Obj
  const { nakshatra, tithiFraction } = panchang.lunarDate
  const lunarDate = {
    ahargana,
    englishDate,
    punjabiDate,
    pooranmashi,
    nakshatra,
    tithiFraction,
  }

  // Return Gregorian Obj
  let gregorian = { // eslint-disable-line prefer-const
    gregorianDate: finalDate,
    julianDay,
    lunarDate,
    solarDate: panchang.solarDate,
  }

  if ( julianDay < 2361221 ) {
    // Get Julian date using Julian Day at noon (12PM)
    const julianDate = Calendar.julianDayToJulianDate( Math.trunc( julianDay ) + 1 )
    gregorian.julianDate = {
      year: julianDate.year,
      month: julianDate.month,
      monthName: englishMonths[ julianDate.month - 1 ],
      date: julianDate.date,
    }
  }

  return gregorian
}

module.exports = getDateFromLunarTithi
