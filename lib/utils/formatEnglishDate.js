const { englishMonths } = require( '../consts' )

/**
 * Given object with year,month,day format to English (Gregorian, Julian) Date
 * @param {date} object Object with year, month, and date
 * @return {object} Returns object with Month name.
 * @example formatEnglishDate( { 1666, 12, 22 } )
 * @private
 */
module.exports = ( { year, month, day: date } ) => ( {
  year,
  month,
  monthName: englishMonths[ month - 1 ],
  date,
} )
