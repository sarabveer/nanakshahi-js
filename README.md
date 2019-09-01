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
  * [getDateFromNanakshahi(year, month, date) ⇒ Object](#getdatefromnanakshahiyear-month-date-%E2%87%92-object)
  * [getHolidaysForDay([gregorianDate]) ⇒ Array](#getholidaysfordaygregoriandate-%E2%87%92-array)
  * [getHolidaysForMonth(month, [year]) ⇒ Object](#getholidaysformonthmonth-year-%E2%87%92-object)
  * [getNanakshahiDate(gregorianDate) ⇒ Object](#getnanakshahidategregoriandate-%E2%87%92-object)
  * [getTithi([gregorianDate]) ⇒ Object](#gettithigregoriandate-%E2%87%92-object)
  * [findBikramiDate(date, [isJulian]) ⇒ Object](#findbikramidatedate-isjulian-%E2%87%92-object)
  * [findDateFromTithi(year, month, date, [paksh], [leapMonth], [leapDay]) ⇒ Object](#finddatefromtithiyear-month-date-paksh-leapmonth-leapday-%E2%87%92-object)
  * [findMovableHoliday(holiday, [year]) ⇒ Object](#findmovableholidayholiday-year-%E2%87%92-object)
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
n.getTithi( date )
n.findBikramiDate( date )
n.findDateFromTithi( 1723, 10, 7 )
n.findMovableHoliday( 'gurunanak' )
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

The library requires `Math.sign`, and `Array.prototype.includes`. These can be added with the Polyfill below:
```
<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=Math.sign%2CArray.prototype.includes"></script>
```

The functions `findBikramiDate()` and `findDateFromTithi()` both use `Date.prototype.toLocaleString()`, with the `Asia/Kolkata` IANA timezone, which isn't supported in IE11.

## API

### getDateFromNanakshahi(year, month, date) ⇒ <code>Object</code>
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
### getHolidaysForDay([gregorianDate]) ⇒ <code>Array</code>
Returns all Gurpurabs and Holidays for a Date

**Returns**: <code>Array</code> - Holidays for the day with Date and name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| [gregorianDate] | <code>Object</code> | JavaScript Date() Object |

**Example**  
```js
getHolidaysForDay( new Date() )
```
### getHolidaysForMonth(month, [year]) ⇒ <code>Object</code>
Returns all Gurpurabs and Holidays for a Nanakshahi Month

**Returns**: <code>Object</code> - Holidays for the month with Date and name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Nanakshahi Month, 1-12 |
| [year] | <code>number</code> | Nanakshahi Year, Default is Current year |

**Example**  
```js
getHolidaysForMonth( 1 )
```
### getNanakshahiDate(gregorianDate) ⇒ <code>Object</code>
Converts given Gregorian Date to the corresponding date in the Nanakshahi Calendar

**Returns**: <code>Object</code> - Nanakshahi Date in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| gregorianDate | <code>Object</code> | JavaScript Date() Object |

**Example**  
```js
getNanakshahiDate( new Date() )
```
### getTithi([gregorianDate]) ⇒ <code>Object</code>
Get Tithi and other Moon/Lunar Info

**Returns**: <code>Object</code> - Tithi and Moon Info  

| Param | Type | Description |
| --- | --- | --- |
| [gregorianDate] | <code>Object</code> | JavaScript Date() Object, defaults to current Date. |

**Example**  
```js
getTithi( new Date() )
```
### findBikramiDate(date, [isJulian]) ⇒ <code>Object</code>
Returns given date to the corresponding date in the Bikrami Calendar

**Returns**: <code>Object</code> - Bikrami (Includes Lunar and Solar Date)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | <code>Object</code> |  | JavaScript Date() Object |
| [isJulian] | <code>boolean</code> | <code>false</code> | Set to true if entered date is in Julian Calendar |

**Example**  
```js
findBikramiDate( new Date() )
```
### findDateFromTithi(year, month, date, [paksh], [leapMonth], [leapDay]) ⇒ <code>Object</code>
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

**Example**  
```js
findDateFromTithi( 1723, 10, 7 )
```
### findMovableHoliday(holiday, [year]) ⇒ <code>Object</code>
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

## Acknowledgements

I want to thank:

* Guru Sahib, who inspires us into Sikhi.

* Pal Singh Purewal, who explained various concepts in the Bikrami and Nanakshahi Calendars to me and answered my various technical and historical questions.

* E. M. Reingold and N. Dershowitz for their Calendrical Calculations book and Calendrica program code, which serves as the base for this library.

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
