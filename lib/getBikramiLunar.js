const julian = require( 'julian' );
const Calendar = require( './bikrami/calendar.js' )
const Celestial = require( './bikrami/celestial/index.js' )
const mathHelper = require( './bikrami/mathHelper.js' )

const celestial = new Celestial( 'SuryaSiddhanta' );
const calendar = new Calendar( celestial );

const ujjain = {
	latitude: 23.2,
	longitude: 75.8
}

const amritsar = {
	latitude: 31.6,
	longitude: 74.9
}

function getBikramiLunar( gregorianDate ) {
    const year = gregorianDate.getFullYear()
    const julianDay = julian( gregorianDate )
    let ahargana = Calendar.julianDayToAhargana( julianDay )

    // Calculate the Tithi at 6 AM (Bikrami New Day)
    const dayFraction = 0.25 // Sunrise
	
	ahargana += dayFraction
	
    // Definition of desantara
    // http://books.google.com/books?id=kt9DIY1g9HYC&pg=PA683&lpg=PA683&dq=desantara&source=bl&ots=NLd1wFKFfN&sig=jCfG95R-6eiSff3L73DCodijo1I&hl=en&sa=X&ei=uKgHU__uKOr7yAGm0YGoBQ&ved=0CF8Q6AEwCDgK#v=onepage&q=desantara&f=false
    const desantara = ( amritsar.longitude - ujjain.longitude ) / 360

    // desantara
    ahargana -= desantara

    // time of sunrise at local latitude
    const timeEquation = celestial.getDaylightEquation( year, amritsar.latitude, ahargana )
    ahargana -= timeEquation
    const { sunriseHour, sunriseMinute } = Celestial.getSunriseTime( dayFraction, timeEquation )

    const { trueSolarLongitude, trueLunarLongitude } = celestial.setPlanetaryPositions( ahargana )

    // finding tithi and longitude of conjunction
    const tithi = Celestial.getTithi( trueSolarLongitude, trueLunarLongitude )

    // last conjunction & next conjunction
    const lastConjunctionLongitude = celestial.getLastConjunctionLongitude( ahargana, tithi )
    const nextConjunctionLongitude = celestial.getNextConjunctionLongitude( ahargana, tithi )
	
	// Find Mal Maas ("Dirty Month")
	const adhimasa = Calendar.getAdhimasa( lastConjunctionLongitude, nextConjunctionLongitude )
	
	if( adhimasa === 'Adhika-' ) {
		var malMaas = true
	} else {
		var malMaas = false
	}
	
	const months = ['Chet', 'Vaisakh', 'Jeth', 'Harh', 'Sawan', 'Bhadon', 'Assu', 'Katak', 'Maghar', 'Poh', 'Magh', 'Phagun']
	
    const monthNum = Calendar.getMasaNum( trueSolarLongitude, lastConjunctionLongitude );

    // kali and Saka era
    const kaliYear = calendar.aharganaToKali(ahargana + ( 4 - monthNum ) * 30);
    const sakaYear = Calendar.kaliToSaka(kaliYear);
	const bikramiYear = sakaYear + 135;

    let tithiDay = mathHelper.truncate(tithi) + 1

	if( tithi > 15 ) {
		var paksa = 'Vadi'
		tithiDay -= 15
	} else {
		var paksa = 'Sudi'
	}
	
	//Pooranmashi
	if(paksa === 'Sudi' && tithiDay === 15) {
		var pooranmashi = true
	} else {
		var pooranmashi = false
	}
	
	var lunarDate = {}
	
	lunarDate.gregorianDate = gregorianDate // set the input gregorian date
    lunarDate.julianDay = mathHelper.truncate(julianDay + 0.5)
    lunarDate.ahargana = mathHelper.truncate(ahargana + 0.5) // Remove the decimals
    lunarDate.malMaas = malMaas
	lunarDate.month = monthNum
	lunarDate.monthName = months[monthNum]
	lunarDate.paksh = paksa
	lunarDate.tithi = tithiDay
	lunarDate.bikramiYear = bikramiYear
	lunarDate.pooranmashi = pooranmashi
    lunarDate.tithiFraction = mathHelper.fractional(tithi)
    lunarDate.sunriseHour = sunriseHour
    lunarDate.sunriseMinute = sunriseMinute
	
    return lunarDate
}

module.exports = getBikramiLunar
