const { findMovableHoliday } = require( '../index' )

/*
  Movable Dates of Gurpurbs (Change Every Year)
  Data taken from:
  http://www.purewal.biz/gurpurbs_movable_dates.pdf
*/

// Range from 2003 - 2020
const years = Array( 18 ).fill( 0 ).map( ( _, i ) => i + 2003 )

describe( "findMovableHoliday( 'gurunanak' )", () => {
  const results = [
    { month: 11, date: 8 },
    { month: 11, date: 26 },
    { month: 11, date: 15 },
    { month: 11, date: 5 },
    { month: 11, date: 24 },
    { month: 11, date: 13 },
    { month: 11, date: 2 },
    { month: 11, date: 21 },
    { month: 11, date: 10 },
    { month: 11, date: 28 },
    { month: 11, date: 17 },
    { month: 11, date: 6 },
    { month: 11, date: 25 },
    { month: 11, date: 14 },
    { month: 11, date: 4 },
    { month: 11, date: 23 },
    { month: 11, date: 12 },
    { month: 11, date: 30 },
  ]

  const data = years.map( ( year, i ) => [
    year,
    ( new Date( year, results[ i ].month - 1, results[ i ].date ) ),
  ] )

  data.map( ( [ year, result ] ) => it( `Output of findMovableHoliday( 'gurunanak', ${year} ) should be: '${result}'`, () => {
    expect( findMovableHoliday( 'gurunanak', year ).gregorianDate ).toEqual( result )
  } ) )
} )

describe( "findMovableHoliday( 'holla' )", () => {
  const results = [
    { month: 3, date: 19 },
    { month: 3, date: 7 },
    { month: 3, date: 26 },
    { month: 3, date: 15 },
    { month: 3, date: 4 },
    { month: 3, date: 22 },
    { month: 3, date: 11 },
    { month: 3, date: 1 },
    { month: 3, date: 20 },
    { month: 3, date: 9 },
    { month: 3, date: 28 },
    { month: 3, date: 17 },
    { month: 3, date: 6 },
    { month: 3, date: 24 },
    { month: 3, date: 13 },
    { month: 3, date: 2 },
    { month: 3, date: 21 },
    { month: 3, date: 10 },
  ]

  const data = years.map( ( year, i ) => [
    year,
    ( new Date( year, results[ i ].month - 1, results[ i ].date ) ),
  ] )

  data.map( ( [ year, result ] ) => it( `Output of findMovableHoliday( 'holla', ${year} ) should be: '${result}'`, () => {
    expect( findMovableHoliday( 'holla', year ).gregorianDate ).toEqual( result )
  } ) )
} )

describe( "findMovableHoliday( 'bandichhorr' )", () => {
  const results = [
    { month: 10, date: 25 },
    { month: 11, date: 12 },
    { month: 11, date: 1 },
    { month: 10, date: 21 },
    { month: 11, date: 9 },
    { month: 10, date: 28 },
    { month: 10, date: 17 },
    { month: 11, date: 5 },
    { month: 10, date: 26 },
    { month: 11, date: 13 },
    { month: 11, date: 3 },
    { month: 10, date: 23 },
    { month: 11, date: 11 },
    { month: 10, date: 30 },
    { month: 10, date: 19 },
    { month: 11, date: 7 },
    { month: 10, date: 27 },
    { month: 11, date: 14 },
  ]

  const data = years.map( ( year, i ) => [
    year,
    ( new Date( year, results[ i ].month - 1, results[ i ].date ) ),
  ] )

  data.map( ( [ year, result ] ) => it( `Output of findMovableHoliday( 'bandichhorr', ${year} ) should be: '${result}'`, () => {
    expect( findMovableHoliday( 'bandichhorr', year ).gregorianDate ).toEqual( result )
  } ) )
} )

