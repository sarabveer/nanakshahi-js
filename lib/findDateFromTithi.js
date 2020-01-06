const { englishMonths, months, nakshatras, pakshNames, tithiNames, weekdays } = require( './consts' )
const { toUnicodeNum } = require( './utils' )

// Import Calendrica 4.0
const {
  general: { mod, clockFromMoment, jdFromFixed, unixFromMoment },
  julian: { julianFromFixed },
  modernHindu: {
    hinduDayCount,
    hinduLunarPhase,
    altHinduSunrise,
    hinduSolarFromFixed,
    fixedFromHinduFullmoon,
    hinduLunarStation,
  },
} = require( './calendrica' )

/**
 * Converts Bikrami Lunar Date into the Gregorian Calendar (Accuracy of plus or minus 1 day)
 * @param {!number} year Bikrami Year
 * @param {!number} month Bikrami Month
 * @param {!number} date Bikrami Tithi
 * @param {boolean} [paksh=false] Lunar Paksh. Default is Sudi, `true` for Vadi.
 * @param {boolean} [leapMonth=false] Set to true if the month is Adhika Month (Mal Maas)
 * @param {boolean} [leapDay=false] Set to true if the lunar day spans more than 1 solar day
 * @return {Object} Gregorian Date
 * @example findDateFromTithi( 1723, 10, 7 )
 */
function findDateFromTithi( year, month, date, paksh = false, leapMonth = false, leapDay = false ) {
  // Add 15 Days if Vadi (New Moon) Paksh
  const day = paksh ? date + 15 : date
  const pakshName = paksh ? pakshNames.vadi : pakshNames.sudi

  // Calculate JD from Tithi
  const fixedDay = fixedFromHinduFullmoon( year, month, leapMonth, day, leapDay )
  const sunrise = altHinduSunrise( fixedDay )
  const julianDay = jdFromFixed( fixedDay )
  const tithiFraction = mod( hinduLunarPhase( sunrise ), 1 )

  // Get nakshatra
  const nakshatra = hinduLunarStation( fixedDay )

  // Add Leap Month Prefix to Month Name
  const lunarMonthName = {
    pa: months[ month - 1 ].pa,
    en: months[ month - 1 ].en,
  }
  if ( leapMonth === true ) {
    lunarMonthName.pa = `${pakshNames.leap.pa}-${lunarMonthName.pa}`
    lunarMonthName.en = `${pakshNames.leap.en}-${lunarMonthName.en}`
  }

  // Get name of Tithi
  let tithiName
  if ( date === 15 && paksh === true ) {
    tithiName = tithiNames[ 15 ] // eslint-disable-line prefer-destructuring
  } else {
    tithiName = tithiNames[ date - 1 ]
  }

  // Calculate Solar Date
  const { year: solarYear, month: solarMonth, day: solarDay } = hinduSolarFromFixed( fixedDay )

  // Solar Month Name
  let solarMonthName = solarMonth + 1
  if ( solarMonthName > 12 ) {
    solarMonthName -= 12
  }

  // Get Dates from Julian Day
  const gregorianDate = new Date( unixFromMoment( fixedDay ) * 1000 )
  const weekday = gregorianDate.getDay()

  // Sunrise Time
  const [ hour, minute ] = clockFromMoment( sunrise )
  const sunriseTime = `${hour}:${minute} AM IST`

  // Lunar Date Obj
  const lunarDate = {
    tithiName,
    leapMonth,
    leapDay,
    englishDate: {
      month,
      monthName: lunarMonthName.en,
      paksh: pakshName.en,
      tithi: date,
      year,
    },
    punjabiDate: {
      month: toUnicodeNum( month ),
      monthName: lunarMonthName.pa,
      paksh: pakshName.pa,
      tithi: toUnicodeNum( date ),
      year: toUnicodeNum( year ),
    },
    nakshatra: nakshatras[ nakshatra - 1 ],
    tithiFraction,
  }

  // Solar Date Obj
  const solarDate = {
    englishDate: {
      month: solarMonth,
      monthName: months[ solarMonthName - 1 ].en,
      date: solarDay,
      year: solarYear,
      day: weekdays[ weekday ].en,
    },
    punjabiDate: {
      month: toUnicodeNum( solarMonth ),
      monthName: months[ solarMonthName - 1 ].pa,
      date: toUnicodeNum( solarDay ),
      year: toUnicodeNum( solarYear ),
      day: weekdays[ weekday ].pa,
    },
  }

  // Return Bikrami Obj
  let gregorian = { // eslint-disable-line prefer-const
    gregorianDate,
    julianDay,
    ahargana: hinduDayCount( fixedDay ),
    lunarDate,
    solarDate,
    sunriseTime,
    kaliYear: year + 3044,
    sakaYear: year - 135,
  }

  if ( julianDay < 2361221 ) {
    // Get Julian date using Julian Day at noon (12PM)
    const julianDate = julianFromFixed( fixedDay )
    gregorian.julianDate = {
      year: julianDate.year,
      month: julianDate.month,
      monthName: englishMonths[ julianDate.month - 1 ],
      date: julianDate.day,
    }
  }

  return gregorian
}

module.exports = findDateFromTithi
