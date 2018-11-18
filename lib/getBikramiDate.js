const julian = require( 'julian' )
const months = require( 'months' )
const Calendar = require( 'kollavarsham/dist/calendar.js' )
const Celestial = require( 'kollavarsham/dist/celestial/index.js' )
const toUnicodeNum = require( './toUnicodeNum' )
const calendarNames = require( './calendarNames' )

const celestial = new Celestial( 'SuryaSiddhanta' ) // NOTICE: Suraj Sidhant is not used by current Punjab Jantris, Drik system is used
const calendar = new Calendar( celestial )

const ujjain = {
  latitude: 23.2,
  longitude: 75.8,
}

const amritsar = {
  latitude: 31.6,
  longitude: 74.9,
}

/**
 * Converts given Gregorian Date to the corresponding date in the Bikrami Calendar
 * @param {Object} gregorianDate JavaScript Date() Object
 * @return {Object} Bikrami Solar and Lunar Date
 * @example getBikramiDate( new Date() )
 */
function getBikramiDate( gregorianDate ) {
  const year = gregorianDate.getFullYear()
  const month = gregorianDate.getMonth()
  const day = gregorianDate.getDate()

  // Julian Day at 12AM UTC
  const julianDay = julian( new Date( Date.UTC( year, month, day ) ) )

  // Get Julian date using Julian Day at noon (12PM)
  const julianDate = Calendar.julianDayToJulianDate( Math.trunc( julianDay ) + 1 )

  // Calculate Amount of Lunar Days since the start of Kali Yuga
  let ahargana = Calendar.julianDayToAhargana( julianDay )

  // Calculate the Tithi at 6 AM (Bikrami New Day)
  const dayFraction = 0.25 // Sunrise
  ahargana += dayFraction

  // Desantara (Longitudinal correction)
  const desantara = ( amritsar.longitude - ujjain.longitude ) / 360
  ahargana -= desantara

  // Time of sunrise at local latitude
  const timeEquation = celestial.getDaylightEquation( year, amritsar.latitude, ahargana )
  const sunrise = Celestial.getSunriseTime( dayFraction, timeEquation )
  ahargana -= timeEquation

  // Calculate location via Planets
  const { trueSolarLongitude, trueLunarLongitude } = celestial.setPlanetaryPositions( ahargana )

  // Find tithi and longitude of conjunction
  const tithi = Celestial.getTithi( trueSolarLongitude, trueLunarLongitude )

  // Last conjunction and next conjunction
  const lastConjunctionLongitude = celestial.getLastConjunctionLongitude( ahargana, tithi )
  const nextConjunctionLongitude = celestial.getNextConjunctionLongitude( ahargana, tithi )

  // Find Mal Maas ("Dirty Month")
  const adhimasa = Calendar.getAdhimasa( lastConjunctionLongitude, nextConjunctionLongitude )
  let malMaas
  if ( adhimasa === 'Adhika-' ) {
    malMaas = true
  } else {
    malMaas = false
  }

  // Get Month
  let monthNum = Calendar.getMasaNum( trueSolarLongitude, lastConjunctionLongitude )

  // Solar Month and Day
  const solar = calendar.getSauraMasaAndSauraDivasa( ahargana, desantara )
  let solarMonth = solar.sauraMasa + 1
  if ( solarMonth >= 12 ) {
    solarMonth -= 12
  }

  // Find Bikrami Year
  const kaliYear = calendar.aharganaToKali( ahargana + ( 4 - monthNum ) * 30 )
  let bikramiYear = Calendar.kaliToSaka( kaliYear ) + 135

  // Find Paksh and switch to Purnimanta system
  let tithiDay = Math.trunc( tithi ) + 1
  let paksh
  if ( tithiDay > 15 ) {
    paksh = calendarNames.paksh.vadi
    tithiDay -= 15
    if ( malMaas !== true ) {
      monthNum += 1 // Use Purnimanta system (Month ends with Pooranmashi)
    }
  } else {
    paksh = calendarNames.paksh.sudi
  }
  if ( monthNum >= 12 ) {
    monthNum -= 12
    if ( monthNum === 0 ) {
      bikramiYear += 1 // Add Year for Chet Vadi (Phagan Vadi in Amanta System)
    }
  }

  // Pooranmashi
  let pooranmashi
  if ( paksh.en === 'Sudi' && tithiDay === 15 ) {
    pooranmashi = true
  } else {
    pooranmashi = false
  }

  // Get Bikrami Solar Year
  let solarYear = bikramiYear
  if ( solarMonth === 0 && monthNum === 11 ) {
    solarYear += 1
  } else if ( solarMonth === 11 && monthNum === 0 ) {
    solarYear -= 1
  }

  // Lunar Date Obj
  const lunarDate = {
    ahargana: Math.trunc( ahargana ),
    malMaas,
    pooranmashi,
    englishDate: {
      month: monthNum + 1,
      monthName: calendarNames.months.en[ monthNum ],
      paksh: paksh.en,
      tithi: tithiDay,
      year: bikramiYear,
    },
    punjabiDate: {
      month: toUnicodeNum( monthNum + 1 ),
      monthName: calendarNames.months.pa[ monthNum ],
      paksh: paksh.pa,
      tithi: toUnicodeNum( tithiDay ),
      year: toUnicodeNum( bikramiYear ),
    },
    tithiFraction: tithi % 1,
  }

  // Solar Date Obj
  const solarDate = {
    englishDate: {
      month: solarMonth + 1,
      monthName: calendarNames.months.en[ solarMonth ],
      date: solar.sauraDivasa,
      year: solarYear,
    },
    punjabiDate: {
      month: toUnicodeNum( solarMonth + 1 ),
      monthName: calendarNames.months.pa[ solarMonth ],
      tithi: toUnicodeNum( solar.sauraDivasa ),
      year: toUnicodeNum( solarYear ),
    },
  }

  // Return Bikrami Obj
  let bikrami = { // eslint-disable-line prefer-const
    gregorianDate, // set the input gregorian date
    julianDay,
    lunarDate,
    solarDate,
    sunrise,
  }

  if ( julianDay < 2361221 ) {
    bikrami.julianDate = {
      year: julianDate.year,
      month: julianDate.month,
      monthName: months[ julianDate.month - 1 ],
      date: julianDate.date,
    }
  }

  return bikrami
}

module.exports = getBikramiDate
