const leapYear = require( 'leap-year' )
const { toUnicode } = require( 'gurmukhi-utils' )

function getNanakshahiDate( gregorianDate ) {
	const gregorianDay = gregorianDate.getDate()
	const gregorianMonth = gregorianDate.getMonth() + 1 // Start from 1
	const gregorianYear = gregorianDate.getFullYear()
	const weekday = gregorianDate.getDay()
	const leap = leapYear( gregorianYear )
	
	// Calculate Nanakshahi Date
	let nanakshahiDay
	let nanakshahiMonth
	
	if(gregorianMonth === 1 && gregorianDay <= 12) {
		nanakshahiDay = gregorianDay + 18
		if(nanakshahiDay > 30) {
			nanakshahiMonth = 11
			nanakshahiDay = nanakshahiDay - 30
		} else {
			nanakshahiMonth = 10
		}
	} else if(gregorianMonth === 1 && gregorianDay > 12) {
		nanakshahiDay = gregorianDay - 12
		nanakshahiMonth = 11
	} else if(gregorianMonth === 2 && gregorianDay <= 11) {
		nanakshahiDay = gregorianDay + 19
		if(nanakshahiDay > 30) {
			nanakshahiMonth = 12
			nanakshahiDay = nanakshahiDay - 30
		} else {
			nanakshahiMonth = 11
		}
	} else if(gregorianMonth === 2 && gregorianDay > 11) {
		nanakshahiDay = gregorianDay - 11
		nanakshahiMonth = 12
	} else if(gregorianMonth === 3 && gregorianDay <= 13) {
		//Check if its not a Leap Year
		if(leap === false) {
			nanakshahiDay = gregorianDay + 17
			if(nanakshahiDay > 30) {
				nanakshahiMonth = 1
				nanakshahiDay = nanakshahiDay - 30
			} else {
				nanakshahiMonth = 12
			}
		} else {
			nanakshahiDay = gregorianDay + 18
			if(nanakshahiDay > 31) {
				nanakshahiMonth = 1
				nanakshahiDay = nanakshahiDay - 31
			} else {
				nanakshahiMonth = 12
			}
		}
	} else if(gregorianMonth === 3 && gregorianDay > 13) {
		nanakshahiDay = gregorianDay - 13
		nanakshahiMonth = 1
	} else if(gregorianMonth === 4 && gregorianDay <= 13) {
		nanakshahiDay = gregorianDay + 18
		if(nanakshahiDay > 31) {
			nanakshahiMonth = 2
			nanakshahiDay = nanakshahiDay - 31
		} else {
			nanakshahiMonth = 1
		}
	} else if(gregorianMonth === 4 && gregorianDay > 13) {
		nanakshahiDay = gregorianDay - 13
		nanakshahiMonth = 2
	} else if(gregorianMonth === 5 && gregorianDay <= 14 ) {
		nanakshahiDay = gregorianDay + 17
		if(nanakshahiDay > 31) {
			nanakshahiMonth = 3
			nanakshahiDay = nanakshahiDay - 31
		} else {
			nanakshahiMonth = 2
		}
	} else if(gregorianMonth === 5 && gregorianDay > 14) {
		nanakshahiDay = gregorianDay - 14
		nanakshahiMonth = 3
	} else if(gregorianMonth === 6 && gregorianDay <= 14) {
		nanakshahiDay = gregorianDay + 17
		if(nanakshahiDay > 31) {
			nanakshahiMonth = 4
			nanakshahiDay = nanakshahiDay - 31
		} else {
			nanakshahiMonth = 3
		}
	} else if(gregorianMonth === 6 && gregorianDay > 14) {
		nanakshahiDay = gregorianDay - 14
		nanakshahiMonth = 4
	} else if(gregorianMonth === 7 && gregorianDay <= 15) {
		nanakshahiDay = gregorianDay + 16
		if(nanakshahiDay > 31) {
			nanakshahiMonth = 5
			nanakshahiDay = nanakshahiDay - 31
		} else {
			nanakshahiMonth = 4
		}
	} else if(gregorianMonth === 7 && gregorianDay > 15) {
		nanakshahiDay = gregorianDay - 15
		nanakshahiMonth = 5
	} else if(gregorianMonth === 8 && gregorianDay <= 15) {
		nanakshahiDay = gregorianDay + 16
		if(nanakshahiDay > 31) {
			nanakshahiMonth = 6
			nanakshahiDay = nanakshahiDay - 31
		} else {
			nanakshahiMonth = 5
		}
	} else if(gregorianMonth === 8 && gregorianDay > 15) {
		nanakshahiDay = gregorianDay - 15
		nanakshahiMonth = 6
	} else if(gregorianMonth === 9 && gregorianDay <= 14) {
		nanakshahiDay = gregorianDay + 16
		if(nanakshahiDay > 30) {
			nanakshahiMonth = 7
			nanakshahiDay = nanakshahiDay - 30
		} else {
			nanakshahiMonth = 6
		}
	} else if(gregorianMonth === 9 && gregorianDay > 14) {
		nanakshahiDay = gregorianDay - 14
		nanakshahiMonth = 7
	} else if(gregorianMonth === 10 && gregorianDay <= 14) {
		nanakshahiDay = gregorianDay + 16
		if(nanakshahiDay > 30) {
			nanakshahiMonth = 8
			nanakshahiDay = nanakshahiDay - 30
		} else {
			nanakshahiMonth = 7
		}
	} else if(gregorianMonth === 10 && gregorianDay > 14) {
		nanakshahiDay = gregorianDay - 14
		nanakshahiMonth = 8
	} else if(gregorianMonth === 11 && gregorianDay <= 13) {
		nanakshahiDay = gregorianDay + 17
		if(nanakshahiDay > 30) {
			nanakshahiMonth = 9
			nanakshahiDay = nanakshahiDay - 30
		} else {
			nanakshahiMonth = 8
		}
	} else if(gregorianMonth === 11 && gregorianDay > 13) {
		nanakshahiDay = gregorianDay - 13
		nanakshahiMonth = 9
	} else if(gregorianMonth === 12 && gregorianDay <= 13) {
		nanakshahiDay = gregorianDay + 17
		if(nanakshahiDay > 30) {
			nanakshahiMonth = 10
			nanakshahiDay = nanakshahiDay - 30
		} else {
			nanakshahiMonth = 9
		}
	} else if(gregorianMonth === 12 && gregorianDay > 13) {
		nanakshahiDay = gregorianDay - 13
		nanakshahiMonth = 10
	} else {
		nanakshahiDay = 0
		nanakshahiMonth = 0
	}
	
	// Calculate Nanakshahi Year - March 14 (1 Chet) Nanakshahi New Year
	let nanakshahiYear
	
	if( gregorianMonth < 3 ) {
		nanakshahiYear = gregorianYear - 1469
	} else if( gregorianMonth === 3 && gregorianDay < 14 ) {
		nanakshahiYear = gregorianYear - 1469
	} else {
		nanakshahiYear = gregorianYear - 1468
	}
	// Array of Months
	const monthsEnglish = [ 'Chet', 'Vaisakh', 'Jeth', 'Harh', 'Savan', 'Bhadon', 'Assu', 'Katak', 'Maghar', 'Poh', 'Magh', 'Phagun' ]
	const monthsPunjabi = [ 'ਚੇਤ', 'ਵੈਸਾਖ', 'ਜੇਠ', 'ਹਾੜ', 'ਸਾਵਣ', 'ਭਾਦੋਂ', 'ਅੱਸੂ', 'ਕੱਤਕ', 'ਮੱਘਰ', 'ਪੋਹ', 'ਮਾਘ', 'ਫੱਗਣ' ]
	
	// Array of Weekdays
	const daysEnglish = [ 'Aitvaar', 'Somvaar', 'Mangalvaar', 'Budhvaar', 'Veervaar', 'Shukarvaar', 'Shanivaar' ]
	const daysPunjabi = [ 'ਐਤਵਾਰ', 'ਸੋਮਵਾਰ', 'ਮੰਗਲਵਾਰ', 'ਬੁੱਧਵਾਰ', 'ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵਾਰ', 'ਸ਼ਨੀਵਾਰ' ]
	
	let englishDate = {
		month: nanakshahiMonth,
		monthName: monthsEnglish[ nanakshahiMonth - 1 ],
		date: nanakshahiDay,
		year: nanakshahiYear,
		day: daysEnglish[ weekday ]
	}
	
	let punjabiDate = {
		month: toUnicode( nanakshahiMonth ),
		monthName: monthsPunjabi[ nanakshahiMonth - 1 ],
		date: toUnicode( nanakshahiDay ),
		year: toUnicode( nanakshahiYear ),
		day: daysPunjabi[ weekday ]
	}
	
	let nanakshahi = {
		gregorianDate: gregorianDate,
		english: englishDate,
		punjabi: punjabiDate,
		leapYear: leap
	}
	
	return nanakshahi
}

module.exports = getNanakshahiDate