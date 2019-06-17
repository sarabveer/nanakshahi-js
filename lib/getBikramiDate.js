const julian = require( 'julian' )
const suncalc = require( 'suncalc' )
const { englishMonths, months, nakshatras, pakshNames, tithiNames, weekdays } = require( './consts' )
const { calendrica, fromJulianDayToJulianDate, fromJulianToGregorian, toUnicodeNum } = require( './utils' )

// Import Calendrica 4.0
const {
  HINDU_SOLAR_ERA,
  HINDU_LUNAR_ERA,
  AMRITSAR,
  next,
  amod,
  hinduSunrise,
  hinduZodiac,
  hinduCalendarYear,
  hinduSolarLongitude,
  hinduLunarDayFromMoment,
  hinduLunarPhase,
  hinduLunarLongitude,
  hinduNewMoonBefore,
} = calendrica

/**
 * Returns given date to the corresponding date in the Panchang
 * @param {Object} date JavaScript Date() Object
 * @param {boolean} [isJulian=false] Set to true if entered date is in Julian Calendar
 * @return {Object} Panchang (Includes Lunar and Solar Date)
 * @example getBikramiDate( new Date() )
 */
module.exports = ( date, isJulian = false ) => {
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

  // Calculate Tithi by finding Latitude of Moon
  const lunarSunrise = hinduSunrise( julianDay )
  let tithi = hinduLunarDayFromMoment( lunarSunrise )
  const tithiFraction = hinduLunarPhase( lunarSunrise ) % 1


  // Check if Lunar Leap Month
  const lastNewMoon = hinduNewMoonBefore( lunarSunrise )
  const nextNewMoon = hinduNewMoonBefore( Math.floor( lastNewMoon ) + 35 )
  const checkSolarMonth = hinduZodiac( lastNewMoon )
  const leapMonth = ( checkSolarMonth === hinduZodiac( nextNewMoon ) )

  // Get Lunar Month
  let lunarMonth = amod( checkSolarMonth + 1, 12 )

  // Get Lunar Year
  let lunarYear = hinduCalendarYear( month <= 2 ? julianDay + 180 : julianDay ) - HINDU_LUNAR_ERA

  // Find Paksh and switch to Purnimanta system
  let paksh
  if ( tithi > 15 ) {
    paksh = pakshNames.vadi
    tithi -= 15
    if ( leapMonth !== true ) {
      lunarMonth += 1 // Use Purnimanta system (Month ends with Pooranmashi)
    }
  } else {
    paksh = pakshNames.sudi
  }
  if ( lunarMonth >= 12 ) {
    lunarMonth -= 12
    if ( lunarMonth === 0 ) {
      lunarYear += 1 // Add Year for Chet Vadi (Phagan Vadi in Amanta System)
    }
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

  let tithiName
  if ( tithi === 15 && paksh.en === 'Vadi' ) {
    tithiName = tithiNames[ 15 ] // eslint-disable-line prefer-destructuring
  } else {
    tithiName = tithiNames[ tithi - 1 ]
  }

  // Check if Lunar Leap Day
  const leapDay = ( hinduLunarDayFromMoment( lunarSunrise )
    === hinduLunarDayFromMoment( hinduSunrise( julianDay - 1 ) ) )

  // Get nakshatra
  const nakshatra = Math.trunc( hinduLunarLongitude( lunarSunrise ) * 27 / 360 )

  // Solar Month
  const solarSunrise = hinduSunrise( julianDay + 1 )
  const solarMonth = hinduZodiac( solarSunrise )
  let solarMonthName = solarMonth + 1
  if ( solarMonthName >= 12 ) {
    solarMonthName -= 12
  }

  // Solar Year
  const solarYear = hinduCalendarYear( solarSunrise ) - HINDU_SOLAR_ERA

  // Solar Day
  const solarApprox = julianDay - 3 - ( Math.floor( hinduSolarLongitude( solarSunrise ) ) % 30 )
  const p = i => hinduZodiac( hinduSunrise( i + 1 ) ) === solarMonth
  const begin = next( solarApprox, p )
  const solarDay = julianDay - begin + 1

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
    nakshatra: nakshatras[ nakshatra ],
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
    const julianDate = fromJulianDayToJulianDate( Math.trunc( julianDay ) + 1 )
    bikramiDate.julianDate = {
      year: julianDate.year,
      month: julianDate.month,
      monthName: englishMonths[ julianDate.month - 1 ],
      date: julianDate.date,
    }
  }

  return bikramiDate
}
