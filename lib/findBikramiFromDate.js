const {
  lunarPhases,
  months,
  nakshatras,
  pakshNames,
  tithiNames,
  weekdays,
} = require( './consts' )
const {
  decimalToAngle,
  formatEnglishDate,
  fractionToTime,
  toUnicodeNum,
} = require( './utils' )

// Import Calendrica 4.0
const {
  astronomy: {
    universalFromLocal,
    standardFromUniversal,
    universalFromStandard,
    localFromStandard,
    lunarPhase,
  },
  general: { mod, dayOfWeekFromFixed, jdFromFixed, unixFromMoment },
  gregorian: { fixedFromGregorian, gregorianFromFixed },
  julian: { fixedFromJulian, julianFromFixed },
  modernHindu: {
    HINDU_LOCATION,
    hinduDayCount,
    hinduLunarPhase,
    altHinduSunrise,
    hinduSolarFromFixed,
    fixedFromHinduSolar,
    hinduFullmoonFromFixed,
    ayanamsha,
    astroHinduSolarFromFixed,
    fixedFromAstroHinduSolar,
    hinduLunarStation,
    astroHinduFullmoonFromFixed,
    hinduSolarLongitudeAtOrAfter,
    astroHinduSolarLongitudeAtOrAfter,
    hinduLunarDayAtOrAfter,
    astroHinduLunarDayAtOrAfter,
    astroHinduLunarStation,
  },
} = require( './calendrica' )

/**
 * Returns given date to the corresponding date in the Bikrami Calendar
 * @param {Object} date JavaScript Date() Object
 * @param {boolean} [astro=true] Set to false to use Surya Sidhantta instead of Drik Gannit
 * @param {boolean} [isJulian=false] Set to true if entered date is in Julian Calendar
 * @return {Object} Bikrami (Includes Lunar and Solar Date)
 * @example findBikramiFromDate( new Date() )
 */
function findBikramiFromDate( date, astro = true, isJulian = false ) {
  // Calculate RD from Date
  const fixedDay = isJulian === true
    ? fixedFromJulian( date.getFullYear(), date.getMonth() + 1, date.getDate() )
    : fixedFromGregorian( date.getFullYear(), date.getMonth() + 1, date.getDate() )

  // Julian Date
  const julianDay = jdFromFixed( fixedDay )

  // Get Weekday
  const weekday = dayOfWeekFromFixed( fixedDay )

  // Get Gregorian Date (in Local Standard Time)
  const { year, month, day } = gregorianFromFixed( fixedDay )

  // Sunrise Time
  const sunrise = altHinduSunrise( fixedDay )
  const sunriseTime = `${fractionToTime( sunrise )} IST`

  // Calculate Tithi
  // eslint-disable-next-line max-len, prefer-const
  const { year: lunarYear, month: lunarMonth, leapMonth, day: lunarTithi, leapDay } = astro
    ? astroHinduFullmoonFromFixed( fixedDay )
    : hinduFullmoonFromFixed( fixedDay )

  // Calculate Tithi Fraction
  const tithiFraction = mod( astro
    ? ( lunarPhase( universalFromStandard( sunrise, HINDU_LOCATION ) ) / 12 )
    : ( hinduLunarPhase( localFromStandard( sunrise, HINDU_LOCATION ) ) / 12 ),
  1 )

  // Get nakshatra
  const nakshatra = astro
    ? astroHinduLunarStation( fixedDay )
    : hinduLunarStation( localFromStandard( fixedDay, HINDU_LOCATION ) )

  // Find Paksh
  let tithi = lunarTithi
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
  const tithiName = ( tithi === 15 && paksh.en === 'Vadi' ) ? tithiNames[ 15 ] : tithiNames[ tithi - 1 ]

  // Tithi Time
  const tithiStart = astro
    ? astroHinduLunarDayAtOrAfter( lunarTithi, ( fixedDay - 2 ) )
    : universalFromLocal( hinduLunarDayAtOrAfter( lunarTithi, ( fixedDay - 2 ) ), HINDU_LOCATION )
  const tithiEnd = astro
    ? astroHinduLunarDayAtOrAfter( lunarTithi + 1, ( fixedDay - 1 ) )
    : universalFromLocal(
      hinduLunarDayAtOrAfter( lunarTithi + 1, ( fixedDay - 1 ) ),
      HINDU_LOCATION,
    )
  const tithiStartTime = `${fractionToTime( standardFromUniversal( tithiStart, HINDU_LOCATION ) )} IST`
  const tithiEndTime = `${fractionToTime( standardFromUniversal( tithiEnd, HINDU_LOCATION ) )} IST`

  // Calculate Solar Date
  const { year: solarYear, month: solarMonth, day: solarDay } = astro
    ? astroHinduSolarFromFixed( fixedDay )
    : hinduSolarFromFixed( fixedDay )

  // Solar Month Name
  let solarMonthName = solarMonth + 1
  if ( solarMonthName > 12 ) {
    solarMonthName -= 12
  }

  // Sangrand
  const sangrand = astro
    ? fixedFromAstroHinduSolar( solarYear, solarMonth, 1 )
    : fixedFromHinduSolar( solarYear, solarMonth, 1 )
  const sangrandDate = gregorianFromFixed( sangrand )

  // Sankranti Time
  const sankranti = astro
    ? astroHinduSolarLongitudeAtOrAfter( ( ( solarMonth - 1 ) * 30 ), ( sangrand - 2 ) )
    : universalFromLocal(
      hinduSolarLongitudeAtOrAfter( ( ( solarMonth - 1 ) * 30 ), ( sangrand - 2 ) ),
      HINDU_LOCATION,
    )
  const sankrantiTime = `${fractionToTime( standardFromUniversal( sankranti, HINDU_LOCATION ) )} IST`

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
    timing: {
      start: {
        gregorianDate: new Date( unixFromMoment( tithiStart ) * 1000 ),
        time: tithiStartTime,
      },
      end: {
        gregorianDate: new Date( unixFromMoment( tithiEnd ) * 1000 ),
        time: tithiEndTime,
      },
    },
    phase: lunarPhases[ Math.round( lunarPhase( sunrise ) / 45 ) ],
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
    sangrand: {
      gregorianDate: new Date( sangrandDate.year, sangrandDate.month - 1, sangrandDate.day ),
      sankranti: {
        gregorianDate: new Date( unixFromMoment( sankranti ) * 1000 ),
        time: sankrantiTime,
      },
    },
  }

  if ( astro ) {
    // Include ayanamsha if using Drik
    const ayanamshaDeg = ayanamsha( fixedDay )
    solarDate.ayanamsha = {
      decimal: ayanamshaDeg,
      dms: decimalToAngle( ayanamshaDeg ),
    }
  }

  // Return Bikrami Obj
  let bikramiDate = { // eslint-disable-line prefer-const
    gregorianDate: new Date( year, month - 1, day ),
    julianDay,
    ahargana: hinduDayCount( fixedDay ),
    lunarDate,
    solarDate,
    sunriseTime,
    kaliYear: lunarYear + 3044,
    sakaYear: lunarYear - 135,
  }

  if ( julianDay < 2361221 || isJulian === true ) {
    // Get Julian date using Julian Day at noon (12PM)
    bikramiDate.julianDate = formatEnglishDate( julianFromFixed( fixedDay ) )
    bikramiDate.solarDate.sangrand.julianDate = formatEnglishDate( julianFromFixed( sangrand ) )
    bikramiDate.solarDate.sangrand.sankranti.julianDate = formatEnglishDate(
      julianFromFixed( Math.floor( standardFromUniversal( sankranti, HINDU_LOCATION ) ) ),
    )
    bikramiDate.lunarDate.timing.start.julianDate = formatEnglishDate(
      julianFromFixed( Math.floor( standardFromUniversal( tithiStart, HINDU_LOCATION ) ) ),
    )
    bikramiDate.lunarDate.timing.end.julianDate = formatEnglishDate(
      julianFromFixed( Math.floor( standardFromUniversal( tithiEnd, HINDU_LOCATION ) ) ),
    )
  }

  return bikramiDate
}

module.exports = findBikramiFromDate
