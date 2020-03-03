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
  astronomy: { universalFromStandard, localFromStandard, lunarPhase },
  general: { mod, jdFromFixed, unixFromMoment },
  gregorian: { fixedFromGregorian },
  julian: { fixedFromJulian, julianFromFixed },
  modernHindu: {
    HINDU_LOCATION,
    hinduDayCount,
    hinduLunarPhase,
    altHinduSunrise,
    hinduSolarFromFixed,
    hinduFullmoonFromFixed,
    ayanamsha,
    astroHinduSolarFromFixed,
    hinduLunarStation,
    astroHinduFullmoonFromFixed,
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
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const fixedDay = isJulian === true
    ? fixedFromJulian( year, month, day ) : fixedFromGregorian( year, month, day )
  const gregorianDate = new Date( unixFromMoment( fixedDay ) * 1000 )
  const weekday = gregorianDate.getUTCDay()

  // Julian Date
  const julianDay = jdFromFixed( fixedDay )

  // Sunrise Time
  const sunrise = altHinduSunrise( fixedDay )
  const time = fractionToTime( sunrise )
  const sunriseTime = `${time} IST`

  // Calculate Tithi
  // eslint-disable-next-line max-len, prefer-const
  let { year: lunarYear, month: lunarMonth, leapMonth, day: tithi, leapDay } = astro
    ? astroHinduFullmoonFromFixed( fixedDay ) : hinduFullmoonFromFixed( fixedDay )
  const tithiFraction = mod( astro
    ? ( lunarPhase( universalFromStandard( sunrise, HINDU_LOCATION ) ) / 12 )
    : ( hinduLunarPhase( localFromStandard( sunrise, HINDU_LOCATION ) ) / 12 ), 1 )

  // Get nakshatra
  const nakshatra = hinduLunarStation( fixedDay )

  // Find Paksh
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

  // Calculate Solar Date
  const { year: solarYear, month: solarMonth, day: solarDay } = astro
    ? astroHinduSolarFromFixed( fixedDay ) : hinduSolarFromFixed( fixedDay )

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

  if ( astro ) {
    // Include ayanamsha if using Drik
    const ayanamshaSunrise = ayanamsha( universalFromStandard( sunrise, HINDU_LOCATION ) )
    bikramiDate.solarDate.ayanamsha = {
      decimal: ayanamshaSunrise,
      dms: decimalToAngle( ayanamshaSunrise ),
    }
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

module.exports = findBikramiFromDate
