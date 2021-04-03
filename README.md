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
  * [NPM](#npm)
  * [CDN](#cdn)
- [Notes](#notes)
  * [Nanakshahi Calendar](#nanakshahi-calendar)
  * [Bikrami](#bikrami)
  * [JavaScript `Date()` Object](#javascript-date-object)
- [API](#api)
  * [getDateFromNanakshahi(year, month, date)](#getdatefromnanakshahiyear-month-date)
  * [getGurpurabsForDay([gregorianDate])](#getgurpurabsfordaygregoriandate)
  * [getGurpurabsForMonth(month, [year])](#getgurpurabsformonthmonth-year)
  * [getNanakshahiDate([gregorianDate])](#getnanakshahidategregoriandate)
  * [findMovableGurpurab(gurpurab, [year])](#findmovablegurpurabgurpurab-year)
- [Acknowledgements](#acknowledgements)
- [Contributing](#contributing)
- [License](#license)

<!-- tocstop -->

## Usage

### NPM

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
n.getGurpurabsForDay( date )
n.getGurpurabsForMonth( 1 )
n.findMovableGurpurab( 'gurunanak' )
```

Want a demo?  
[![Try on RunKit](https://img.shields.io/badge/Try%20on%20RunKit-nanakshahi-brightgreen.svg?style=flat-square)](https://npm.runkit.com/nanakshahi)

### CDN

Additionally, the package is available for web use via [unpkg CDN](https://unpkg.com/nanakshahi).
```
<script src="https://unpkg.com/nanakshahi"></script>
```

Or via [jsDelivr](https://www.jsdelivr.com/package/npm/nanakshahi)
```
<script src="https://cdn.jsdelivr.net/npm/nanakshahi/dist/index.min.js"></script>
```

## Notes

### Nanakshahi Calendar

This library is based of the Nanakshahi Calendar passed by Sri Akal Takht Sahib in 2003 CE.

All Gurpurabs and Historical dates are reckoned with their Solar Dates. An exception to this are the Movable Lunar dates which are to be reckoned using the Bikrami calender until further Panthic consensus.

The Nanakshahi functions will only calculate dates after Nanakshahi adoption in 2003 CE. Any dates before March 14, 2003 CE (535 NS) will return with an `Out of Range` error.

### Bikrami

The Bikrami functions in this library were implemented to automatically calculate the Movable dates for the original Nanakshahi Calendar.

The functions are also provided as reference for researchers and historians. No support will be given to anyone attempting to build a calendar from these functions.

The accuracy of the Bikrami calculations match the dates given in *Jantri 500 Years* by Pal Singh Purewal and this library has been checked personally by Pal Singh Purewal himself.

### JavaScript `Date()` Object

In this library, the Date object has been given in local time of the client. This ensures that the Gregorian date calculated by the functions are correct regardless of Timezone.

## API

### getDateFromNanakshahi(year, month, date)
Converts Nanakshahi Date into the Gregorian Calendar

**Returns**: <code>Object</code> - Gregorian Date + Nanakshahi Date in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Nanakshahi Year |
| month | <code>number</code> | Nanakshahi Month, 1-12 |
| date | <code>number</code> | Nanakshahi Day |

**Example**  
```js
getDateFromNanakshahi( 550, 10, 23 )
```
### getGurpurabsForDay([gregorianDate])
Returns all Gurpurabs for a Date

**Returns**: <code>Array</code> - Gurpurabs for the day with Date and name in English and Punjabi  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [gregorianDate] | <code>Object</code> | <code>new Date()</code> | JavaScript Date() Object |

**Example**  
```js
getGurpurabsForDay( new Date() )
```
### getGurpurabsForMonth(month, [year])
Returns all Gurpurabs for a Nanakshahi Month

**Returns**: <code>Object</code> - Gurpurabs for the month with Date and name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Nanakshahi Month, 1-12 |
| [year] | <code>number</code> | Nanakshahi Year. Default is current Nanakshahi Year. |

**Example**  
```js
getGurpurabsForMonth( 1 )
```
### getNanakshahiDate([gregorianDate])
Converts given Gregorian Date to the corresponding date in the Nanakshahi Calendar

**Returns**: <code>Object</code> - Nanakshahi Date in English and Punjabi  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [gregorianDate] | <code>Object</code> | <code>new Date()</code> | JavaScript Date() Object |

**Example**  
```js
getNanakshahiDate( new Date() )
```
### findMovableGurpurab(gurpurab, [year])
Returns Gregorian Date of Movable Gurpurab

**Returns**: <code>Object</code> - Gurpurab Date with Name in English and Punjabi  

| Param | Type | Description |
| --- | --- | --- |
| gurpurab | <code>string</code> | Movable Gurpurabs:<br> `gurunanak` - Parkash Guru Nanak Dev Ji<br> `bandichhorr` - Bandi Chhorr Divas / Diwali<br> `holla` - Holla Mahalla<br> `kabeer` - Birthday Bhagat Kabeer Ji<br> `ravidaas` - Birthday Bhagat Ravidaas Ji<br> `naamdev` - Birthday Bhagat Naamdev Ji |
| [year] | <code>number</code> | Gregorian year, default is current year. |

**Example**  
```js
findMovableGurpurab( 'gurunanak' )
```

## Acknowledgements

I want to thank:

* Guru Sahib, who inspires us into Sikhi.

* Pal Singh Purewal, who explained various concepts in the Bikrami and Nanakshahi Calendars to me and answered my various technical and historical questions. Spent countless hours verifying the calculations done by me.

* E. M. Reingold and N. Dershowitz for their *Calendrical Calculations* book and their mathematical functions, which serve as the base for the Bikrami calculations done in this library.

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

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, as per version 3 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
