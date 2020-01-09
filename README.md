<!-- Do not modify README.md, instead modify README.hbs -->

# nanakshahi-js
A JavaScript Library to get Nanakshahi Dates and Gurpurabs

[![npm](https://img.shields.io/npm/v/nanakshahi.svg?style=flat-square)](https://www.npmjs.com/package/nanakshahi)
[![Travis (.org)](https://img.shields.io/travis/Sarabveer/nanakshahi-js.svg?style=flat-square)](https://travis-ci.org/Sarabveer/nanakshahi-js)
[![GitHub license](https://img.shields.io/github/license/Sarabveer/nanakshahi-js.svg?style=flat-square)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Sarabveer/nanakshahi-js.svg?style=flat-square)](https://github.com/Sarabveer/nanakshahi-js/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Sarabveer/nanakshahi-js.svg?style=flat-square)](https://github.com/Sarabveer/nanakshahi-js/pulls)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/nanakshahi/badge)](https://www.jsdelivr.com/package/npm/nanakshahi)

## Contents

<!-- toc -->

- [Usage](#usage)
  * [Polyfill](#polyfill)
- [API](#api)
  * [getDateFromNanakshahi(year, month, date)](#getdatefromnanakshahiyear-month-date)
  * [getHolidaysForDay([gregorianDate])](#getholidaysfordaygregoriandate)
  * [getHolidaysForMonth(month, [year])](#getholidaysformonthmonth-year)
  * [getNanakshahiDate(gregorianDate)](#getnanakshahidategregoriandate)
  * [findMovableHoliday(holiday, [year])](#findmovableholidayholiday-year)
  * [findBikramiFromDate(date, [astro], [isJulian])](#findbikramifromdatedate-astro-isjulian)
  * [findDateFromBikramiLunar(year, month, date, [paksh], [leapMonth], [leapDay], [astro])](#finddatefrombikramilunaryear-month-date-paksh-leapmonth-leapday-astro)
- [Acknowledgements](#acknowledgements)
- [Contributing](#contributing)

<!-- tocstop -->

## Usage

Install the library via NPM:
```
npm install nanakshahi
```

The library can be imported into Node as below:
```javascript
const n = require('nanakshahi')

const date = new Date()

n.getNanakshahiDate( date )
n.getDateFromNanakshahi( 550, 10, 23 )
n.getHolidaysForDay( date )
n.getHolidaysForMonth( 1 )
n.findMovableHoliday( 'gurunanak' )
n.findBikramiFromDate( date )
n.findDateFromBikramiLunar( 1723, 10, 7 )
```

Additionally, the package is available for web use via [unpkg CDN](https://unpkg.com/nanakshahi).
```
<script src="https://unpkg.com/nanakshahi"></script>
```

Or via [jsDelivr](https://www.jsdelivr.com/package/npm/nanakshahi)
```
<script src="https://cdn.jsdelivr.net/npm/nanakshahi/dist/index.min.js"></script>
```

Want a demo?  
[![Try on RunKit](https://img.shields.io/badge/Try%20on%20RunKit-nanakshahi-brightgreen.svg?style=flat-square)](https://npm.runkit.com/nanakshahi)

### Polyfill

While the library does run on most modern browsers, it does not work on IE11.

The library requires `Math.sign` and `Array.prototype.includes`. These can be added with the Polyfill below to add IE11 support:
```
<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=Math.sign%2CArray.prototype.includes"></script>
```

## API

### getDateFromNanakshahi(year, month, date)
Converts Nanakshahi Date into the Gregorian Calendar

**Returns**: <code>Object</code> - Gregorian Date  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Nanakshahi Year |
| month | <code>number</code> | Nanakshahi Month, 1-12 |
| date | <code>number</code> | Nanakshahi Day |

**Example**  
```js
getDateFromNanakshahi( 550, 10, 23 )
```
### getHolidaysForDay([gregorianDate])
Returns all Gurpurabs and Holidays for a Date

**Returns**: <code>Array</code> - Holidays for the day with Date and name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| [gregorianDate] | <code>Object</code> | JavaScript Date() Object |

**Example**  
```js
getHolidaysForDay( new Date() )
```
### getHolidaysForMonth(month, [year])
Returns all Gurpurabs and Holidays for a Nanakshahi Month

**Returns**: <code>Object</code> - Holidays for the month with Date and name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Nanakshahi Month, 1-12 |
| [year] | <code>number</code> | Nanakshahi Year, default is Current Gregorian Year |

**Example**  
```js
getHolidaysForMonth( 1 )
```
### getNanakshahiDate(gregorianDate)
Converts given Gregorian Date to the corresponding date in the Nanakshahi Calendar

**Returns**: <code>Object</code> - Nanakshahi Date in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| gregorianDate | <code>Object</code> | JavaScript Date() Object |

**Example**  
```js
getNanakshahiDate( new Date() )
```
### findMovableHoliday(holiday, [year])
Returns Gregorian Date of Movable HolidayMovable Holidays List:- `gurunanak` Parkash Guru Nanak Dev Ji- `bandishhorr` Bandi Shhorr Divas / Diwali- `holla` Holla Mahalla- `kabeer` Birthday Bhagat Kabeer Ji- `ravidaas` Birthday Bhagat Ravidaas Ji- `naamdev` Birthday Bhagat Naamdev Ji

**Returns**: <code>Object</code> - Holiday Date with Name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| holiday | <code>string</code> | Holiday which date will be calculated. |
| [year] | <code>number</code> | Gregorian year, default is current year. |

**Example**  
```js
findMovableHoliday( 'gurunanak' )
```
### findBikramiFromDate(date, [astro], [isJulian])
Returns given date to the corresponding date in the Bikrami Calendar

**Returns**: <code>Object</code> - Bikrami (Includes Lunar and Solar Date)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | <code>Object</code> |  | JavaScript Date() Object |
| [astro] | <code>boolean</code> | <code>true</code> | Set to false to use Surya Sidhantta instead of Drik Gannit |
| [isJulian] | <code>boolean</code> | <code>false</code> | Set to true if entered date is in Julian Calendar |

**Example**  
```js
findBikramiFromDate( new Date() )
```
### findDateFromBikramiLunar(year, month, date, [paksh], [leapMonth], [leapDay], [astro])
Converts Bikrami Lunar Date into the Gregorian Calendar (Accuracy of plus or minus 1 day)

**Returns**: <code>Object</code> - Gregorian Date  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| year | <code>number</code> |  | Bikrami Year |
| month | <code>number</code> |  | Bikrami Month |
| date | <code>number</code> |  | Bikrami Tithi |
| [paksh] | <code>boolean</code> | <code>false</code> | Lunar Paksh. Default is Sudi, `true` for Vadi. |
| [leapMonth] | <code>boolean</code> | <code>false</code> | Set to true if the month is Adhika Month (Mal Maas) |
| [leapDay] | <code>boolean</code> | <code>false</code> | Set to true if the lunar day spans more than 1 solar day |
| [astro] | <code>boolean</code> | <code>true</code> | Set to false to use Surya Sidhantta instead of Drik Gannit |

**Example**  
```js
findDateFromBikramiLunar( 1723, 10, 7 )
```

## Acknowledgements

I want to thank:

* Guru Sahib, who inspires us into Sikhi.

* Pal Singh Purewal, who explained various concepts in the Bikrami and Nanakshahi Calendars to me and answered my various technical and historical questions. Spent countless hours verifying the calculations done by me.

* E. M. Reingold and N. Dershowitz for their Calendrical Calculations book and Calendrica program code, which serves as the base for the Bikrami calculations done in this library.

* My father, Jasjit Singh, whose curiosity in the Nanakshahi and Bikrami calendar systems inspired me find answers to his technical questions.

## Contributing

We're happy to accept suggestions and pull requests!

To get started, clone this repo and run `npm install` inside this directory. 

This repository follows the **Airbnb's Javascript Style Guide**, with a few minor modifications. Notably, spaces should be included inside parentheses and brackets (weird, right!). An ESLint file is provided,
and your code will automatically be checked on-commit for style.
It is recommended to install an ESLint plugin for your editor (VS Code's `ESLint` plugin works out of the box), so you can receive
linter suggestions as you type.

When writing commit messages, please follow the **[seven rules](https://chris.beams.io/posts/git-commit/#seven-rules)**. 
Markdown and HTML JSDoc documentation is generated automatically, on commit,
however if you'd like to preview any changes to documentation, `npm run build-docs` will
update `README.md`. `README.md` should *not* be edited, instead apply modifications to `README.hbs`.

The general workflow for contributing:

- Fork/create a new branch.
- Write or update existing tests with expected results
- Implement functions/changes
- Add JSDoc function documentation and examples.
- Create a pull request with the changes.
