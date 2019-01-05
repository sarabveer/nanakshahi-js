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
- [API](#api)
  * [getBikramiDate(gregorianDate, [isJulian]) ⇒ Object](#getbikramidategregoriandate-isjulian-%E2%87%92-object)
  * [getGregorianFromBikrami(year, year, tithi, [paksh]) ⇒ Object](#getgregorianfrombikramiyear-year-tithi-paksh-%E2%87%92-object)
  * [getHolidaysForDay(gregorianDate) ⇒ Array](#getholidaysfordaygregoriandate-%E2%87%92-array)
  * [getHolidaysForMonth(month) ⇒ Object](#getholidaysformonthmonth-%E2%87%92-object)
  * [getMovableHoliday(holiday, [year]) ⇒ Object](#getmovableholidayholiday-year-%E2%87%92-object)
  * [getNanakshahiDate(gregorianDate) ⇒ Object](#getnanakshahidategregoriandate-%E2%87%92-object)
- [Contributing](#contributing)

<!-- tocstop -->

## Usage

The library can be imported into Node as below:
```javascript
const n = require('nanakshahi')

const date = new Date()

n.getNanakshahiDate( date )
n.getHolidaysForDay( date )
n.getHolidaysForMonth( 1 )
n.getMovableHoliday( 'gurunanak' )
n.getBikramiDate( date )
n.getGregorianFromBikrami( 1723, 10, 7 )
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

## API

### getBikramiDate(gregorianDate, [isJulian]) ⇒ <code>Object</code>
Converts given Gregorian Date to the corresponding date in the Bikrami Calendar

**Returns**: <code>Object</code> - Bikrami Solar and Lunar Date  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| gregorianDate | <code>Object</code> |  | JavaScript Date() Object |
| [isJulian] | <code>boolean</code> | <code>false</code> | Set to true if entered date is in Julian Calendar |

**Example**  
```js
getBikramiDate( new Date() )
```
### getGregorianFromBikrami(year, year, tithi, [paksh]) ⇒ <code>Object</code>
Converts Bikrami Lunar Date into the Gregorian Calendar (Accuracy of plus or minus 1 day)

**Returns**: <code>Object</code> - Gregorian Date  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| year | <code>number</code> |  | Bikrami Year |
| year | <code>number</code> |  | Bikrami Month |
| tithi | <code>number</code> |  | Bikrami Tithi |
| [paksh] | <code>boolean</code> | <code>false</code> | Lunar Paksh. Default is Sudi, `true` for Vadi. |

**Example**  
```js
getGregorianFromBikrami( 1723, 10, 7 )
```
### getHolidaysForDay(gregorianDate) ⇒ <code>Array</code>
Returns all Gurpurabs and Holidays for a Date

**Returns**: <code>Array</code> - Holidays for the day with Date and name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| gregorianDate | <code>Object</code> | JavaScript Date() Object |

**Example**  
```js
getHolidaysForDay( new Date() )
```
### getHolidaysForMonth(month) ⇒ <code>Object</code>
Returns all Gurpurabs and Holidays for a Nanakshahi Month

**Returns**: <code>Object</code> - Holidays for the month with Date and name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Nanakshahi Month, 1-12 |

**Example**  
```js
getHolidaysForMonth( 1 )
```
### getMovableHoliday(holiday, [year]) ⇒ <code>Object</code>
Returns Gregorian Date of Movable HolidayMovable Holidays List:- `gurunanak` Parkash Guru Nanak Dev Ji- `bandishhorr` Bandi Shhorr Divas / Diwali- `holla` Holla Mahalla- `kabeer` Birthday Bhagat Kabeer Ji- `ravidaas` Birthday Bhagat Ravidaas Ji- `naamdev` Birthday Bhagat Naamdev Ji

**Returns**: <code>Object</code> - Holiday Date with Name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| holiday | <code>string</code> | Holiday which date will be calculated. |
| [year] | <code>number</code> | Gregorian year, default is current year. |

**Example**  
```js
getMovableHoliday( 'gurunanak' )
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
- Run tests with `npm test` and ensure they all pass. Testing is done with the `mocha` testing framework.
- Create a pull request with the changes.
