const julian = require( 'julian' )
const Calendar = require( 'kollavarsham/dist/calendar.js' )
const Celestial = require( 'kollavarsham/dist/celestial/index.js' )

const celestial = new Celestial( 'SuryaSiddhanta' ) // NOTICE: Suraj Sidhant is not used by current Punjab Jantris, Sideral Year is used
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
  const julianDay = julian( gregorianDate )
  let ahargana = Calendar.julianDayToAhargana( julianDay )

  // Calculate the Tithi at 6 AM (Bikrami New Day)
  const dayFraction = 0.25 // Sunrise
  ahargana += dayFraction

  // Desantara
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
  const months = [ 'Chet', 'Vaisakh', 'Jeth', 'Harh', 'Savan', 'Bhadon', 'Assu', 'Katak', 'Maghar', 'Poh', 'Magh', 'Phagun' ]
  let monthNum = Calendar.getMasaNum( trueSolarLongitude, lastConjunctionLongitude )

  // Solar Month and Day
  const solar = calendar.getSauraMasaAndSauraDivasa( ahargana, desantara )
  let solarMonth = solar.sauraMasa + 1
  if ( solarMonth >= 12 ) {
    solarMonth = 0
  }

  // Find Bikrami Year
  const kaliYear = calendar.aharganaToKali( ahargana + ( 4 - monthNum ) * 30 )
  const sakaYear = Calendar.kaliToSaka( kaliYear )
  const bikramiYear = sakaYear + 135

  // Find Paksh
  let tithiDay = Math.trunc( tithi ) + 1
  let paksh
  if ( tithi > 15 ) {
    paksh = 'Vadi'
    tithiDay -= 15
    monthNum += 1 // Use Purnimanta system (Month ends with Pooranmashi)
  } else {
    paksh = 'Sudi'
  }

  // Pooranmashi
  let pooranmashi
  if ( paksh === 'Sudi' && tithiDay === 15 ) {
    pooranmashi = true
  } else {
    pooranmashi = false
  }

  // Lunar Date Obj
  const lunarDate = {
    ahargana: Math.trunc( ahargana ), // Remove the decimals
    malMaas,
    month: monthNum + 1,
    monthName: months[ monthNum ],
    paksh,
    tithi: tithiDay,
    pooranmashi,
    tithiFraction: tithi % 1,
  }

  // Solar Date Obj
  const solarDate = {
    month: solarMonth + 1,
    monthName: months[ solarMonth ],
    date: solar.sauraDivasa,
  }

  // Return Bikrami Obj
  const bikrami = {
    gregorianDate, // set the input gregorian date
    julianDay: Math.trunc( julianDay ),
    lunarDate,
    solarDate,
    year: bikramiYear,
    sunrise,
  }

  return bikrami
}

module.exports = getBikramiDate
