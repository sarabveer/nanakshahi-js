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
    hinduSolarFromFixed,
    fixedFromHinduSolar,
    fixedFromHinduFullmoon,
    ayanamsha,
    astroHinduSolarFromFixed,
    fixedFromAstroHinduSolar,
    hinduLunarStation,
    fixedFromAstroHinduFullmoon,
    hinduSolarLongitudeAtOrAfter,
    astroHinduSolarLongitudeAtOrAfter,
    hinduLunarDayAtOrAfter,
    astroHinduLunarDayAtOrAfter,
  },
} = require( './calendrica' )

/**
 * Converts Bikrami Lunar Date into the Gregorian Calendar
 * @param {!number} year Bikrami Year
 * @param {!number} month Bikrami Month
 * @param {!number} date Bikrami Tithi
 * @param {boolean} [paksh=false] Lunar Paksh. Default is Sudi, `true` for Vadi.
 * @param {boolean} [leapMonth=false] Set to true if the month is Adhika Month (Mal Maas)
 * @param {boolean} [leapDay=false] Set to true if the lunar day spans more than 1 solar day
 * @param {boolean} [astro=true] Set to false to use Surya Sidhantta instead of Drik Gannit
 * @return {Object} Gregorian Date
 * @example findDateFromBikramiLunar( 1723, 10, 7 )
 */
function findDateFromBikramiLunar(
  year, month, date, paksh = false, leapMonth = false, leapDay = false, astro = true,
) {
  // Add 15 Days if Vadi (New Moon) Paksh
  const day = paksh ? date + 15 : date
  const pakshName = paksh ? pakshNames.vadi : pakshNames.sudi

  // Calculate RD from Tithi
  const fixedDay = astro
    ? fixedFromAstroHinduFullmoon( year, month, leapMonth, day, leapDay )
    : fixedFromHinduFullmoon( year, month, leapMonth, day, leapDay )
  const sunrise = altHinduSunrise( fixedDay )
  const julianDay = jdFromFixed( fixedDay )
  const tithiFraction = mod( astro
    ? ( lunarPhase( universalFromStandard( sunrise, HINDU_LOCATION ) ) / 12 )
    : ( hinduLunarPhase( localFromStandard( sunrise, HINDU_LOCATION ) ) / 12 ), 1 )

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

  // Tithi Time
  const tithiStart = astro
    ? astroHinduLunarDayAtOrAfter( day, ( fixedDay - 2 ) )
    : hinduLunarDayAtOrAfter( day, ( fixedDay - 2 ) )
  const tithiEnd = astro
    ? astroHinduLunarDayAtOrAfter( day + 1, ( fixedDay - 1 ) )
    : hinduLunarDayAtOrAfter( day + 1, ( fixedDay - 1 ) )
  const tithiStartFrac = astro ? tithiStart : universalFromLocal( tithiStart, HINDU_LOCATION )
  const tithiEndFrac = astro ? tithiEnd : universalFromLocal( tithiEnd, HINDU_LOCATION )
  const tithiStartTime = `${fractionToTime( standardFromUniversal( tithiStartFrac, HINDU_LOCATION ) )} IST`
  const tithiEndTime = `${fractionToTime( standardFromUniversal( tithiEndFrac, HINDU_LOCATION ) )} IST`

  // Calculate Solar Date
  const { year: solarYear, month: solarMonth, day: solarDay } = astro
    ? astroHinduSolarFromFixed( fixedDay ) : hinduSolarFromFixed( fixedDay )

  // Solar Month Name
  let solarMonthName = solarMonth + 1
  if ( solarMonthName > 12 ) {
    solarMonthName -= 12
  }

  // Sangrand
  const sangrand = astro
    ? fixedFromAstroHinduSolar( solarYear, solarMonth, 1 )
    : fixedFromHinduSolar( solarYear, solarMonth, 1 )

  // Sankranti Time
  const sankranti = astro
    ? astroHinduSolarLongitudeAtOrAfter( ( ( solarMonth - 1 ) * 30 ), ( sangrand - 2 ) )
    : hinduSolarLongitudeAtOrAfter( ( ( solarMonth - 1 ) * 30 ), ( sangrand - 2 ) )
  const sankrantiDayFrac = astro ? sankranti : universalFromLocal( sankranti, HINDU_LOCATION )
  const sankrantiTime = `${fractionToTime( standardFromUniversal( sankrantiDayFrac, HINDU_LOCATION ) )} IST`

  // Get Dates from Julian Day
  const gregorianDate = new Date( unixFromMoment( fixedDay ) * 1000 )
  const weekday = gregorianDate.getUTCDay()

  // Sunrise Time
  const sunriseTime = `${fractionToTime( sunrise )} IST`

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
    kaliYear: year + 3044,
    sakaYear: year - 135,
  }

  if ( astro ) {
    // Include ayanamsha if using Drik
    const ayanamshaSunrise = ayanamsha( universalFromStandard( sunrise, HINDU_LOCATION ) )
    gregorian.solarDate.ayanamsha = {
      decimal: ayanamshaSunrise,
      dms: decimalToAngle( ayanamshaSunrise ),
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

module.exports = findDateFromBikramiLunar
