const {
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
  gregorian: { gregorianFromFixed },
  julian: { julianFromFixed },
  modernHindu: {
    HINDU_LOCATION,
    hinduDayCount,
    hinduLunarPhase,
    altHinduSunrise,
    fixedFromHinduSolar,
    hinduFullmoonFromFixed,
    ayanamsha,
    astroHinduSunset,
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

  // Get Weekday
  const weekday = dayOfWeekFromFixed( fixedDay )

  // Get Gregorian Date (in Local Standard Time)
  const { gYear, gMonth, gDay } = gregorianFromFixed( fixedDay )

  // Sunrise Time
  const sunrise = altHinduSunrise( fixedDay )

  // Calculate Tithi
  // eslint-disable-next-line max-len, prefer-const
  let { year: lunarYear, month: lunarMonth, leapMonth, day: lunarTithi, leapDay } = astro
    ? astroHinduFullmoonFromFixed( fixedDay ) : hinduFullmoonFromFixed( fixedDay )

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
    pa: leapMonth === true
      ? `${pakshNames.leap.pa}-${months[ lunarMonth - 1 ].pa}`
      : months[ lunarMonth - 1 ].pa,
    en: leapMonth === true
      ? `${pakshNames.leap.en}-${months[ lunarMonth - 1 ].en}`
      : months[ lunarMonth - 1 ].en,
  }

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

  // Sangrand
  const sangrand = astro
    ? fixedFromAstroHinduSolar( year, month, 1 )
    : fixedFromHinduSolar( year, month, 1 )
  const sangrandDate = gregorianFromFixed( sangrand )

  // Sankranti Time
  const sankranti = astro
    ? astroHinduSolarLongitudeAtOrAfter( ( ( month - 1 ) * 30 ), ( sangrand - 2 ) )
    : universalFromLocal(
      hinduSolarLongitudeAtOrAfter( ( ( month - 1 ) * 30 ), ( sangrand - 2 ) ),
      HINDU_LOCATION,
    )

  // Lunar Date Obj
  const lunarDate = {
    tithiName: ( tithi === 15 && paksh.en === 'Vadi' ) ? tithiNames[ 15 ] : tithiNames[ tithi - 1 ],
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
    nakshatra: nakshatras[ ( astro
      ? astroHinduLunarStation( fixedDay )
      : hinduLunarStation( localFromStandard( fixedDay, HINDU_LOCATION ) ) ) - 1 ],
    tithiFraction: mod( astro
      ? ( lunarPhase( universalFromStandard( sunrise, HINDU_LOCATION ) ) / 12 )
      : ( hinduLunarPhase( localFromStandard( sunrise, HINDU_LOCATION ) ) / 12 ), 1 ),
    timing: {
      start: {
        gregorianDate: new Date( unixFromMoment( tithiStart ) * 1000 ),
        time: `${fractionToTime( standardFromUniversal( tithiStart, HINDU_LOCATION ) )} IST`,
      },
      end: {
        gregorianDate: new Date( unixFromMoment( tithiEnd ) * 1000 ),
        time: `${fractionToTime( standardFromUniversal( tithiEnd, HINDU_LOCATION ) )} IST`,
      },
    },
  }

  // Solar Date Obj
  const solarDate = {
    englishDate: {
      month,
      monthName: months[ ( ( month + 1 ) % 12 ) - 1 ].en,
      date,
      year,
      day: weekdays[ weekday ].en,
    },
    punjabiDate: {
      month: toUnicodeNum( month ),
      monthName: months[ ( ( month + 1 ) % 12 ) - 1 ].pa,
      date: toUnicodeNum( date ),
      year: toUnicodeNum( year ),
      day: weekdays[ weekday ].pa,
    },
    sangrand: {
      gregorianDate: new Date( sangrandDate.year, sangrandDate.month - 1, sangrandDate.day ),
      sankranti: {
        gregorianDate: new Date( unixFromMoment( sankranti ) * 1000 ),
        time: `${fractionToTime( standardFromUniversal( sankranti, HINDU_LOCATION ) )} IST`,
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
    gregorianDate: new Date( gYear, gMonth - 1, gDay ),
    julianDay: jdFromFixed( fixedDay ),
    ahargana: hinduDayCount( fixedDay ),
    lunarDate,
    solarDate,
    sunriseTime: `${fractionToTime( sunrise )} IST`,
    sunsetTime: `${fractionToTime( astroHinduSunset( fixedDay ) )} IST`,
    kaliYear: lunarYear + 3044,
    sakaYear: lunarYear - 135,
  }

  // Add Julian Dates if before Sept. 14, 1752 C.E.
  if ( fixedDay < 639797 ) {
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

module.exports = findDateFromBikramiSolar
