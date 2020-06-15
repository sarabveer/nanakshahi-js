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
    hinduSolarFromFixed,
    fixedFromHinduSolar,
    fixedFromHinduFullmoon,
    ayanamsha,
    astroHinduSunset,
    astroHinduSolarFromFixed,
    fixedFromAstroHinduSolar,
    hinduLunarStation,
    fixedFromAstroHinduFullmoon,
    hinduSolarLongitudeAtOrAfter,
    astroHinduSolarLongitudeAtOrAfter,
    hinduLunarDayAtOrAfter,
    astroHinduLunarDayAtOrAfter,
    astroHinduLunarStation,
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

  // Get Weekday
  const weekday = dayOfWeekFromFixed( fixedDay )

  // Get Gregorian Date (in Local Standard Time)
  const { gYear, gMonth, gDay } = gregorianFromFixed( fixedDay )

  // Sunrise Time
  const sunrise = altHinduSunrise( fixedDay )

  // Add Leap Month Prefix to Month Name
  const lunarMonthName = {
    pa: leapMonth === true
      ? `${pakshNames.leap.pa}-${months[ month - 1 ].pa}`
      : months[ month - 1 ].pa,
    en: leapMonth === true
      ? `${pakshNames.leap.en}-${months[ month - 1 ].en}`
      : months[ month - 1 ].en,
  }

  // Tithi Time
  const tithiStart = astro
    ? astroHinduLunarDayAtOrAfter( day, ( fixedDay - 2 ) )
    : universalFromLocal( hinduLunarDayAtOrAfter( day, ( fixedDay - 2 ) ), HINDU_LOCATION )
  const tithiEnd = astro
    ? astroHinduLunarDayAtOrAfter( day + 1, ( fixedDay - 1 ) )
    : universalFromLocal(
      hinduLunarDayAtOrAfter( day + 1, ( fixedDay - 1 ) ),
      HINDU_LOCATION,
    )

  // Calculate Solar Date
  const { year: solarYear, month: solarMonth, day: solarDay } = astro
    ? astroHinduSolarFromFixed( fixedDay )
    : hinduSolarFromFixed( fixedDay )

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

  // Lunar Date Obj
  const lunarDate = {
    tithiName: ( date === 15 && paksh === true ) ? tithiNames[ 15 ] : tithiNames[ date - 1 ],
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
      month: solarMonth,
      monthName: months[ ( ( solarMonth + 1 ) % 12 ) - 1 ].en,
      date: solarDay,
      year: solarYear,
      day: weekdays[ weekday ].en,
    },
    punjabiDate: {
      month: toUnicodeNum( solarMonth ),
      monthName: months[ ( ( solarMonth + 1 ) % 12 ) - 1 ].pa,
      date: toUnicodeNum( solarDay ),
      year: toUnicodeNum( solarYear ),
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
    kaliYear: year + 3044,
    sakaYear: year - 135,
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

module.exports = findDateFromBikramiLunar
