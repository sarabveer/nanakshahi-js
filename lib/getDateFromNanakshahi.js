const getNanakshahiDate = require( './getNanakshahiDate' )

/**
 * Converts Nanakshahi Date into the Gregorian Calendar
 * @param {!number} year Nanakshahi Year
 * @param {!number} month Nanakshahi Month
 * @param {!number} day Nanakshahi Day
 * @return {Object} Gregorian Date
 * @example getDateFromNanakshahi( 550, 10, 23 )
 */
function getDateFromNanakshahi( year, month, day ) {
  if ( year < 535 ) {
    throw new RangeError( 'Nanakshahi Date Out of Range' )
  }

  // Calculate Gregorian Year
  let gregorianYear
  if ( month < 11 ) {
    gregorianYear = year + 1468
  } else {
    gregorianYear = year + 1469
  }

  // Set month start from Nanakshahi
  let gregorianDate
  if ( month === 1 ) {
    // Chet - March 14
    gregorianDate = new Date( gregorianYear, 2, 14 )
  } else if ( month === 2 ) {
    // Vaisakh - April 14
    gregorianDate = new Date( gregorianYear, 3, 14 )
  } else if ( month === 3 ) {
    // Jeth - May 15
    gregorianDate = new Date( gregorianYear, 4, 15 )
  } else if ( month === 4 ) {
    // Harh - June 15
    gregorianDate = new Date( gregorianYear, 5, 15 )
  } else if ( month === 5 ) {
    // Sawan - July 16
    gregorianDate = new Date( gregorianYear, 6, 16 )
  } else if ( month === 6 ) {
    // Bhadon - August 16
    gregorianDate = new Date( gregorianYear, 7, 16 )
  } else if ( month === 7 ) {
    // Assu - September 15
    gregorianDate = new Date( gregorianYear, 8, 15 )
  } else if ( month === 8 ) {
    // Katak - October 15
    gregorianDate = new Date( gregorianYear, 9, 15 )
  } else if ( month === 9 ) {
    // Maghar - November 14
    gregorianDate = new Date( gregorianYear, 10, 14 )
  } else if ( month === 10 ) {
    // Poh - December 14
    gregorianDate = new Date( gregorianYear, 11, 14 )
  } else if ( month === 11 ) {
    // Magh - January 13
    gregorianDate = new Date( gregorianYear, 0, 13 )
  } else if ( month === 12 ) {
    // Phagun - February 12
    gregorianDate = new Date( gregorianYear, 1, 12 )
  }

  // Add days to months
  gregorianDate.setDate( gregorianDate.getDate() + ( day - 1 ) )

  return getNanakshahiDate( gregorianDate )
}

module.exports = getDateFromNanakshahi
