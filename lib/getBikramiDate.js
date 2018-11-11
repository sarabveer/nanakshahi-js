const julian = require( 'julian' );
const Calendar = require( './bikrami/calendar.js' )
const Celestial = require( './bikrami/celestial/index.js' )

const celestial = new Celestial( 'SuryaSiddhanta' ) // NOTICE: Suraj Sidhant is not used by current Punjab Jantris, Sideral Year is used
const calendar = new Calendar( celestial )

const ujjain = {
  latitude: 23.2,
  longitude: 75.8
}

const amritsar = {
  latitude: 31.6,
  longitude: 74.9
}

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
  if( adhimasa === 'Adhika-' ) {
    malMaas = true
  } else {
    malMaas = false
  }
  
  // Get Month
  const months = [ 'Chet', 'Vaisakh', 'Jeth', 'Harh', 'Sawan', 'Bhadon', 'Assu', 'Katak', 'Maghar', 'Poh', 'Magh', 'Phagun' ]
  const monthNum = Calendar.getMasaNum( trueSolarLongitude, lastConjunctionLongitude );
  
  // Solar Month and Day
  let { sauraMasa, sauraDivasa } = calendar.getSauraMasaAndSauraDivasa( ahargana, desantara )
  sauraMasa += 1
  if( sauraMasa >= 12 ) {
    sauraMasa = 0
  }

  // Find Bikrami Year
  const kaliYear = calendar.aharganaToKali( ahargana + ( 4 - monthNum ) * 30 );
  const sakaYear = Calendar.kaliToSaka( kaliYear );
  const bikramiYear = sakaYear + 135;

  // Find Paksh
  let tithiDay = Math.trunc( tithi ) + 1
  let paksh
  if( tithi > 15 ) {
    paksh = 'Vadi'
    tithiDay -= 15
  } else {
    paksh = 'Sudi'
  }
  
  //Pooranmashi
  let pooranmashi
  if(paksh === 'Sudi' && tithiDay === 15) {
    pooranmashi = true
  } else {
    pooranmashi = false
  }
  
  // Lunar Date Obj
  let lunarDate = {
    ahargana: Math.trunc( ahargana ), // Remove the decimals
    malMaas: malMaas,
    month: monthNum + 1,
    monthName: months[ monthNum ],
    paksh: paksh,
    tithi: tithiDay,
    pooranmashi: pooranmashi,
    tithiFraction: tithi % 1
  }
  
  // Solar Date Obj
  let solarDate = {
    month: sauraMasa + 1,
	monthName: months[ sauraMasa ],
	day: sauraDivasa
  }
  
  // Return Bikrami Obj
  let bikrami = {
    gregorianDate: gregorianDate, // set the input gregorian date
    julianDay: Math.trunc( julianDay ),
    lunarDate: lunarDate,
    solarDate: solarDate,
    year: bikramiYear,
    sunrise: sunrise
  }
  
  return bikrami
}

module.exports = getBikramiDate
