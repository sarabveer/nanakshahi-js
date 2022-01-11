const { getDateFromNanakshahi } = require( '../index' )

// List of Anniversary Gurpurabs
const data = [
  { // 500th Parkash Guru Angad Dev Ji
    gDate: new Date( 2004, 3, 18 ),
    nDate: { year: 536, month: 2, date: 5 },
  },
  { // 525th Parkash Guru Amardas Ji
    gDate: new Date( 2004, 4, 23 ),
    nDate: { year: 536, month: 3, date: 9 },
  },
  { // 400th First Parkash SGGS Ji
    gDate: new Date( 2004, 8, 1 ),
    nDate: { year: 536, month: 6, date: 17 },
  },
  { // 375th Parkash Guru HarRai Sahib Ji
    gDate: new Date( 2005, 0, 31 ),
    nDate: { year: 536, month: 11, date: 19 },
  },
  { // 350th Parkash Guru Harkrishan Sahib Ji
    gDate: new Date( 2006, 6, 23 ),
    nDate: { year: 538, month: 5, date: 8 },
  },
  { // 475th Parkash Guru Ramdas Ji
    gDate: new Date( 2009, 9, 9 ),
    nDate: { year: 541, month: 7, date: 25 },
  },
  { // 450th Parkash Guru Arjan Dev Ji
    gDate: new Date( 2013, 4, 2 ),
    nDate: { year: 545, month: 2, date: 19 },
  },
  { // 300th Parkash Guru Gobind Singh Ji
    gDate: new Date( 2017, 0, 5 ),
    nDate: { year: 548, month: 10, date: 23 },
  },
  { // 425th Parkash Guru Hargobind Sahib Ji
    gDate: new Date( 2020, 6, 5 ),
    nDate: { year: 552, month: 4, date: 21 },
  },
  { // 400th Parkash Guru Tegh Bahadur Sahib Ji
    gDate: new Date( 2021, 3, 18 ),
    nDate: { year: 553, month: 2, date: 5 },
  },
]

describe( 'getDateFromNanakshahi()', () => {
  data.map( ( { gDate, nDate } ) => it( `Output of getDateFromNanakshahi( ${nDate} ) should be: '${gDate}'`, () => {
    const { year, month, date } = nDate
    expect( getDateFromNanakshahi( year, month, date ).gregorianDate ).toEqual( gDate )
  } ) )
} )
