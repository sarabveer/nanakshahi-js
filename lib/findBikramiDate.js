const julian = require( 'julian' )
const suncalc = require( 'suncalc' )
const { calendrica, fromJulianToGregorian, toUnicodeNum } = require( './utils' )
const { englishMonths, months, nakshatras, pakshNames, tithiNames, weekdays } = require( './consts' )

// Import Calendrica 4.0
const {
  AMRITSAR,
  mod,
  fixedFromJd,
  julianFromFixed,
  hinduSunrise,
  hinduLunarPhase,
  hinduSolarFromFixed,
  hinduFullmoonFromFixed,
  hinduLunarStation,
} = calendrica

/**
 * Returns given date to the corresponding date in the Panchang
 * @param {Object} date JavaScript Date() Object
 * @param {boolean} [isJulian=false] Set to true if entered date is in Julian Calendar
 * @return {Object} Bikrami (Includes Lunar and Solar Date)
 * @example findBikramiDate( new Date() )
 */
function findBikramiDate( date, isJulian = false ) {
  let year
  let month
  let day
  let julianDay
  if ( isJulian === true ) {
    julianDay = fromJulianToGregorian( date )
    year = julian.toDate( julianDay ).getUTCFullYear()
    month = julian.toDate( julianDay ).getUTCMonth()
    day = julian.toDate( julianDay ).getUTCDate()
  } else {
    year = date.getFullYear()
    month = date.getMonth()
    day = date.getDate()
    // Julian Day at 12AM UTC
    julianDay = parseFloat( julian( new Date( Date.UTC( year, month, day ) ) ) )
  }
  const gregorianDate = new Date( year, month, day )
  const weekday = gregorianDate.getDay()

  // Sunrise Time
  const sunriseDate = suncalc
    .getTimes( gregorianDate, AMRITSAR.latitude, AMRITSAR.longitude )
    .sunrise
  const sunriseTime = `${sunriseDate
    .toLocaleString( 'en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' } )} IST`

  // Calculate Tithi
  const fixedDay = fixedFromJd( julianDay )
  // eslint-disable-next-line max-len, prefer-const
  let { year: lunarYear, month: lunarMonth, leapMonth, leapDay, day: tithi } = hinduFullmoonFromFixed( fixedDay )
  const tithiFraction = mod( hinduLunarPhase( hinduSunrise( fixedDay ) ), 1 )

  // Get nakshatra
  const nakshatra = hinduLunarStation( fixedDay )

  // Find Paksh and switch to Purnimanta system
  let paksh
  if ( tithi > 15 ) {
    paksh = pakshNames.vadi
    tithi -= 15
  } else {
    paksh = pakshNames.sudi
  }

  // Add Leap Month Prefix to Month Name
  const lunarMonthName = {
    pa: months[ lunarMonth - 1 ].pa,
    en: months[ lunarMonth - 1 ].en,
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

  // Lunar Date Obj
  const lunarDate = {
    tithiName,
    leapMonth,
    leapDay,
    englishDate: {
      month: lunarMonth,
      monthName: lunarMonthName.en,
      paksh: paksh.en,
      tithi,
      year: lunarYear,
    },
    punjabiDate: {
      month: toUnicodeNum( lunarMonth ),
      monthName: lunarMonthName.pa,
      paksh: paksh.pa,
      tithi: toUnicodeNum( tithi ),
      year: toUnicodeNum( lunarYear ),
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
  let bikramiDate = { // eslint-disable-line prefer-const
    gregorianDate,
    julianDay,
    ahargana: julianDay - 588465.5,
    lunarDate,
    solarDate,
    sunriseTime,
    kaliYear: lunarYear + 3044,
    sakaYear: lunarYear - 135,
  }

  if ( julianDay < 2361221 || isJulian === true ) {
    // Get Julian date using Julian Day at noon (12PM)
    const julianDate = julianFromFixed( fixedDay )
    bikramiDate.julianDate = {
      year: julianDate.year,
      month: julianDate.month,
      monthName: englishMonths[ julianDate.month - 1 ],
      date: julianDate.day,
    }
  }

  return bikramiDate
}

module.exports = findBikramiDate
