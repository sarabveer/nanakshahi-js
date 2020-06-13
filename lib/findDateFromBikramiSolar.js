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
    standardFromUniversal,
    universalFromStandard,
    standardFromLocal,
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

  // Julian Date
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

  // Calculate Tithi Fraction
  const tithiFraction = mod( astro
    ? ( lunarPhase( universalFromStandard( sunrise, HINDU_LOCATION ) ) / 12 )
    : ( hinduLunarPhase( localFromStandard( sunrise, HINDU_LOCATION ) ) / 12 ), 1 )

  // Get nakshatra
  const nakshatra = astro ? astroHinduLunarStation( fixedDay ) : hinduLunarStation( fixedDay )

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
  const tithiStartFrac = astro
    ? standardFromUniversal(
      astroHinduLunarDayAtOrAfter( lunarTithi, ( fixedDay - 2 ) ),
      HINDU_LOCATION,
    )
    : standardFromLocal( hinduLunarDayAtOrAfter( lunarTithi, ( fixedDay - 2 ) ), HINDU_LOCATION )
  const tithiEndFrac = astro
    ? standardFromUniversal(
      astroHinduLunarDayAtOrAfter( lunarTithi + 1, ( fixedDay - 1 ) ),
      HINDU_LOCATION,
    )
    : standardFromLocal(
      hinduLunarDayAtOrAfter( lunarTithi + 1, ( fixedDay - 1 ) ),
      HINDU_LOCATION,
    )
  const tithiStartTime = `${fractionToTime( tithiStartFrac )} IST`
  const tithiEndTime = `${fractionToTime( tithiEndFrac )} IST`

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
    ? standardFromUniversal(
      astroHinduSolarLongitudeAtOrAfter( ( ( month - 1 ) * 30 ), ( sangrand - 2 ) ),
      HINDU_LOCATION,
    )
    : standardFromLocal(
      hinduSolarLongitudeAtOrAfter( ( ( month - 1 ) * 30 ), ( sangrand - 2 ) ),
      HINDU_LOCATION,
    )
  const sankrantiTime = `${fractionToTime( sankranti )} IST`

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
        gregorianDate: new Date( unixFromMoment(
          universalFromStandard( sankranti, HINDU_LOCATION ),
        ) * 1000 ),
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
    gregorianDate,
    julianDay,
    ahargana: hinduDayCount( fixedDay ),
    lunarDate,
    solarDate,
    sunriseTime,
    kaliYear: lunarYear + 3044,
    sakaYear: lunarYear - 135,
  }

  if ( julianDay < 2361221 ) {
    // Get Julian date using Julian Day at noon (12PM)
    bikramiDate.julianDate = formatEnglishDate( julianFromFixed( fixedDay ) )
    bikramiDate.solarDate.sangrand.julianDate = formatEnglishDate( julianFromFixed( sangrand ) )
    bikramiDate.solarDate.sangrand.sankranti.julianDate = formatEnglishDate(
      julianFromFixed( Math.floor( sankranti ) ),
    )
    bikramiDate.lunarDate.timing.start.julianDate = formatEnglishDate(
      julianFromFixed( Math.floor( tithiStartFrac ) ),
    )
    bikramiDate.lunarDate.timing.end.julianDate = formatEnglishDate(
      julianFromFixed( Math.floor( tithiEndFrac ) ),
    )
  }

  return bikramiDate
}

module.exports = findDateFromBikramiSolar
