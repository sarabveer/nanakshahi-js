const julian = require( 'julian' )
const suncalc = require( 'suncalc' )
const { calendrica, toUnicodeNum } = require( './utils' )
const { englishMonths, months, nakshatras, pakshNames, tithiNames, weekdays } = require( './consts' )

// Import Calendrica 4.0
const {
  AMRITSAR,
  mod,
  jdFromFixed,
  julianFromFixed,
  hinduLunarPhase,
  hinduSunrise,
  hinduSolarFromFixed,
  fixedFromHinduFullmoon,
  hinduLunarStation,
} = calendrica

/**
 * Converts Bikrami Lunar Date into the Gregorian Calendar (Accuracy of plus or minus 1 day)
 * @param {!number} year Bikrami Year
 * @param {!number} month Bikrami Month
 * @param {!number} tithi Bikrami Tithi
 * @param {boolean} [paksh=false] Lunar Paksh. Default is Sudi, `true` for Vadi.
 * @param {boolean} [leapMonth=false] Set to true if the month is Adhika Month (Mal Maas)
 * @param {boolean} [leapDay=false] Set to true if the lunar day spans more than 1 solar day
 * @return {Object} Gregorian Date
 * @example getDateFromTithi( 1723, 10, 7 )
 */
function getDateFromTithi( year, month, tithi, paksh = false, leapMonth = false, leapDay = false ) {
  // Add 15 Days if Vadi (New Moon) Paksh
  const day = paksh ? tithi + 15 : tithi
  const pakshName = paksh ? pakshNames.vadi : pakshNames.sudi

  // Calculate JD from Tithi
  const fixedDay = fixedFromHinduFullmoon( year, month, leapMonth, day, leapDay )
  const julianDay = jdFromFixed( fixedDay )
  const tithiFraction = mod( hinduLunarPhase( hinduSunrise( fixedDay ) ), 1 )

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
  if ( tithi === 15 && paksh.en === 'Vadi' ) {
    tithiName = tithiNames[ 15 ] // eslint-disable-line prefer-destructuring
  } else {
    tithiName = tithiNames[ tithi - 1 ]
  }

  // Calculate Solar Date
  const { year: solarYear, month: solarMonth, day: solarDay } = hinduSolarFromFixed( fixedDay )

  // Solar Month Name
  let solarMonthName = solarMonth + 1
  if ( solarMonthName > 12 ) {
    solarMonthName -= 12
  }

  // Get Dates from Julian Day
  const gregorianLocalDate = julian.toDate( julianDay )
  const gregorianYear = gregorianLocalDate.getUTCFullYear()
  const gregorianMonth = gregorianLocalDate.getUTCMonth()
  const gregorianDay = gregorianLocalDate.getUTCDate()
  const gregorianDate = new Date( gregorianYear, gregorianMonth, gregorianDay )
  const weekday = gregorianDate.getDay()

  // Sunrise Time
  const sunriseDate = suncalc
    .getTimes( gregorianDate, AMRITSAR.latitude, AMRITSAR.longitude )
    .sunrise
  const sunriseTime = `${sunriseDate
    .toLocaleString( 'en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' } )} IST`

  // Lunar Date Obj
  const lunarDate = {
    tithiName,
    leapMonth,
    leapDay,
    englishDate: {
      month,
      monthName: lunarMonthName.en,
      paksh: pakshName.en,
      tithi,
      year,
    },
    punjabiDate: {
      month: toUnicodeNum( month ),
      monthName: lunarMonthName.pa,
      paksh: pakshName.pa,
      tithi: toUnicodeNum( tithi ),
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
    ahargana: julianDay - 588465.5,
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

module.exports = getDateFromTithi
