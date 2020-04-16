const {
  englishMonths,
  lunarPhases,
  months,
  nakshatras,
  pakshNames,
  tithiNames,
  weekdays,
} = require( './consts' )
const { decimalToAngle, fractionToTime, toUnicodeNum } = require( './utils' )

// Import Calendrica 4.0
const {
  astronomy: {
    standardFromUniversal,
    universalFromStandard,
    universalFromLocal,
    localFromStandard,
    lunarPhase,
  },
  general: { mod, jdFromFixed, unixFromMoment },
  julian: { julianFromFixed },
  modernHindu: {
    HINDU_LOCATION,
    hinduDayCount,
    hinduLunarPhase,
    altHinduSunrise,
    fixedFromHinduSolar,
    hinduFullmoonFromFixed,
    ayanamsha,
    fixedFromAstroHinduSolar,
    hinduLunarStation,
    astroHinduFullmoonFromFixed,
    hinduSolarLongitudeAtOrAfter,
    astroHinduSolarLongitudeAtOrAfter,
    hinduLunarDayAtOrAfter,
    astroHinduLunarDayAtOrAfter,
  },
} = require( './calendrica' )

/**
 * Converts Bikrami Solar Date into the Gregorian Calendar
 * @param {!number} year Bikrami Year
 * @param {!number} month Bikrami Month
 * @param {!number} date Bikrami Day
 * @param {boolean} [astro=true] Set to false to use Surya Sidhantta instead of Drik Gannit
 * @return {Object} Gregorian Date
 * @example findDateFromBikramiSolar( 1723, 9, 23 )
 */
function findDateFromBikramiSolar( year, month, date, astro = true ) {
  // Calculate RD from Solar Date
  const fixedDay = astro
    ? fixedFromAstroHinduSolar( year, month, date )
    : fixedFromHinduSolar( year, month, date )
  const julianDay = jdFromFixed( fixedDay )

  // Get Gregorian Date
  const gregorianDate = new Date( unixFromMoment( fixedDay ) * 1000 )
  const weekday = gregorianDate.getUTCDay()

  // Sunrise Time
  const sunrise = altHinduSunrise( fixedDay )
  const sunriseTime = `${fractionToTime( sunrise )} IST`

  // Calculate Tithi
  // eslint-disable-next-line max-len, prefer-const
  let { year: lunarYear, month: lunarMonth, leapMonth, day: lunarTithi, leapDay } = astro
    ? astroHinduFullmoonFromFixed( fixedDay ) : hinduFullmoonFromFixed( fixedDay )
  const tithiFraction = mod( astro
    ? ( lunarPhase( universalFromStandard( sunrise, HINDU_LOCATION ) ) / 12 )
    : ( hinduLunarPhase( localFromStandard( sunrise, HINDU_LOCATION ) ) / 12 ), 1 )

  // Get nakshatra
  const nakshatra = hinduLunarStation( fixedDay )

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
    : hinduLunarDayAtOrAfter( lunarTithi, ( fixedDay - 2 ) )
  const tithiEnd = astro
    ? astroHinduLunarDayAtOrAfter( lunarTithi + 1, ( fixedDay - 1 ) )
    : hinduLunarDayAtOrAfter( lunarTithi + 1, ( fixedDay - 1 ) )
  const tithiStartFrac = astro ? tithiStart : universalFromLocal( tithiStart, HINDU_LOCATION )
  const tithiEndFrac = astro ? tithiEnd : universalFromLocal( tithiEnd, HINDU_LOCATION )
  const tithiStartTime = `${fractionToTime( standardFromUniversal( tithiStartFrac, HINDU_LOCATION ) )} IST`
  const tithiEndTime = `${fractionToTime( standardFromUniversal( tithiEndFrac, HINDU_LOCATION ) )} IST`

  // Solar Month Name
  let solarMonthName = month + 1
  if ( solarMonthName > 12 ) {
    solarMonthName -= 12
  }

  // Sangrand
  const sangrand = astro
    ? fixedFromAstroHinduSolar( year, month, 1 )
    : fixedFromHinduSolar( year, month, 1 )

  // Sankranti Time
  const sankranti = astro
    ? astroHinduSolarLongitudeAtOrAfter( ( ( month - 1 ) * 30 ), ( sangrand - 2 ) )
    : hinduSolarLongitudeAtOrAfter( ( ( month - 1 ) * 30 ), ( sangrand - 2 ) )
  const sankrantiDayFrac = astro ? sankranti : universalFromLocal( sankranti, HINDU_LOCATION )
  const sankrantiTime = `${fractionToTime( standardFromUniversal( sankrantiDayFrac, HINDU_LOCATION ) )} IST`

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
        gregorianDate: new Date( unixFromMoment( tithiStartFrac ) * 1000 ),
        time: tithiStartTime,
      },
      end: {
        gregorianDate: new Date( unixFromMoment( tithiEndFrac ) * 1000 ),
        time: tithiEndTime,
      },
    },
    phase: lunarPhases[ Math.round( lunarPhase( sunrise ) / 45 ) ],
  }

  // Solar Date Obj
  const solarDate = {
    englishDate: {
      month,
      monthName: months[ solarMonthName - 1 ].en,
      date,
      year,
      day: weekdays[ weekday ].en,
    },
    punjabiDate: {
      month: toUnicodeNum( month ),
      monthName: months[ solarMonthName - 1 ].pa,
      date: toUnicodeNum( date ),
      year: toUnicodeNum( year ),
      day: weekdays[ weekday ].pa,
    },
    sangrand: {
      gregorianDate: new Date( unixFromMoment( sangrand ) * 1000 ),
      sankranti: {
        gregorianDate: new Date( unixFromMoment( sankrantiDayFrac ) * 1000 ),
        time: sankrantiTime,
      },
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
    kaliYear: lunarYear + 3044,
    sakaYear: lunarYear - 135,
  }

  if ( astro ) {
    // Include ayanamsha if using Drik
    const ayanamshaDeg = ayanamsha( fixedDay )
    gregorian.solarDate.ayanamsha = {
      decimal: ayanamshaDeg,
      dms: decimalToAngle( ayanamshaDeg ),
    }
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
    const sangrandJulianDate = julianFromFixed( sangrand )
    gregorian.solarDate.sangrand.julianDate = {
      year: sangrandJulianDate.year,
      month: sangrandJulianDate.month,
      monthName: englishMonths[ sangrandJulianDate.month - 1 ],
      date: sangrandJulianDate.day,
    }
    const sankrantiJulianDate = julianFromFixed( Math.floor( sankrantiDayFrac ) )
    gregorian.solarDate.sangrand.sankranti.julianDate = {
      year: sankrantiJulianDate.year,
      month: sankrantiJulianDate.month,
      monthName: englishMonths[ sankrantiJulianDate.month - 1 ],
      date: sankrantiJulianDate.day,
    }
    const tithiStartJulianDate = julianFromFixed( Math.floor( tithiStartFrac ) )
    gregorian.lunarDate.timing.start.julianDate = {
      year: tithiStartJulianDate.year,
      month: tithiStartJulianDate.month,
      monthName: englishMonths[ tithiStartJulianDate.month - 1 ],
      date: tithiStartJulianDate.day,
    }
    const tithiEndJulianDate = julianFromFixed( Math.floor( tithiEndFrac ) )
    gregorian.lunarDate.timing.end.julianDate = {
      year: tithiEndJulianDate.year,
      month: tithiEndJulianDate.month,
      monthName: englishMonths[ tithiEndJulianDate.month - 1 ],
      date: tithiEndJulianDate.day,
    }
  }

  return gregorian
}

module.exports = findDateFromBikramiSolar
