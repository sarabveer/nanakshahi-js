"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _calendar = _interopRequireDefault(require("../calendar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pad = function pad(num, size) {
  var s = "000000000".concat(num);
  return s.substr(s.length - size);
};

var masaNames = {
  0: {
    saka: 'Caitra    ',
    saura: 'Mesa      ',
    enMalayalam: 'Chingam   ',
    mlMalayalam: 'ചിങ്ങം'
  },
  1: {
    saka: 'Vaisakha  ',
    saura: 'Vrsa      ',
    enMalayalam: 'Kanni     ',
    mlMalayalam: 'കന്നി'
  },
  2: {
    saka: 'Jyaistha  ',
    saura: 'Mithuna   ',
    enMalayalam: 'Thulam    ',
    mlMalayalam: 'തുലാം'
  },
  3: {
    saka: 'Asadha    ',
    saura: 'Karkata   ',
    enMalayalam: 'Vrischikam',
    mlMalayalam: 'വൃശ്ചികം'
  },
  4: {
    saka: 'Sravana   ',
    saura: 'Simha     ',
    enMalayalam: 'Dhanu     ',
    mlMalayalam: 'ധനു'
  },
  5: {
    saka: 'Bhadrapada',
    saura: 'Kanya     ',
    enMalayalam: 'Makaram   ',
    mlMalayalam: 'മകരം'
  },
  6: {
    saka: 'Asvina    ',
    saura: 'Tula      ',
    enMalayalam: 'Kumbham   ',
    mlMalayalam: 'കുംഭം'
  },
  7: {
    saka: 'Karttika  ',
    saura: 'Vrscika   ',
    enMalayalam: 'Meenam    ',
    mlMalayalam: 'മീനം'
  },
  8: {
    saka: 'Margasirsa',
    saura: 'Dhanus    ',
    enMalayalam: 'Medam     ',
    mlMalayalam: 'മേടം'
  },
  9: {
    saka: 'Pausa     ',
    saura: 'Makara    ',
    enMalayalam: 'Idavam    ',
    mlMalayalam: 'ഇടവം'
  },
  10: {
    saka: 'Magha     ',
    saura: 'Kumbha    ',
    enMalayalam: 'Mithunam  ',
    mlMalayalam: 'മിഥുനം'
  },
  11: {
    saka: 'Phalguna  ',
    saura: 'Mina      ',
    enMalayalam: 'Karkitakam',
    mlMalayalam: 'കർക്കടകം'
  }
};
/**
 * Serves as the base class for both the {{#crossLink "JulianDate"}}{{/crossLink}} and
 * {{#crossLink "KollavarshamDate"}}{{/crossLink}} classes.
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class BaseDate
 * @constructor
 * @param year {Number}
 * @param month {Number}
 * @param day {Number}
 */

var BaseDate =
/*#__PURE__*/
function () {
  function BaseDate() {
    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var date = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, BaseDate);

    /**
     * The year corresponding to this instance of the date.
     *
     * @property year
     * @type {Number}
     */
    this.year = year;
    /**
     * The month corresponding to this instance of the date.
     *
     * @property month
     * @type {Number}
     */

    this.month = month;
    /**
     * The date corresponding to this instance of the date.
     *
     * @property date
     * @type {Number}
     */

    this.date = date;
    /**
     * The gregorian date corresponding to this instance of the date. **Set separately after an instance is created**
     *
     * @property gregorianDate
     * @type {Date}
     */

    this.gregorianDate = null;
    /**
     * The `Julian Day` corresponding to this instance of the date. **Set separately after an instance is created**
     * Julian day is the continuous count of days since the beginning of the Julian Period used primarily by astronomers.
     *
     * _Source_: https://en.wikipedia.org/wiki/Julian_day
     *
     * @property julianDay
     * @type {Number}
     */

    this.julianDay = null;
    /**
     * The `Ahargana` corresponding to this instance of the date. **Set separately after an instance is created**
     *
     * In Sanskrit `ahoratra` means one full day and `gana` means count.
     * Hence, the Ahargana on any given day stands for the number of lunar days that have elapsed starting from an epoch.
     *
     * _Source_: http://cs.annauniv.edu/insight/Reading%20Materials/astro/sharptime/ahargana.htm
     *
     * @property ahargana
     * @type {Number}
     */

    this.ahargana = null;
    /**
     * The `Saura Masa` (Solar Calendar Month) for this instance of the date. **Set separately after an instance is created**
     *
     * @property sauraMasa
     * @type {Number}
     */

    this.sauraMasa = null;
    /**
     * The `Saura Divasa` (Solar Calendar Day) for this instance of the date. **Set separately after an instance is created**
     *
     * @property sauraDivasa
     * @type {Number}
     */

    this.sauraDivasa = null;
    /**
     * The `Naksatra` (Star) for this instance of the date. **Set separately after an instance is created**
     *
     * @property naksatra
     * @type { { saka: String, enMalayalam: string, mlMalayalam: string } }
     */

    this._naksatra = null; // eslint-disable-line no-underscore-dangle
  }

  _createClass(BaseDate, [{
    key: "toString",

    /**
     * Converts the Date to a nicely formatted string with year, month and date
     *
     * @method toString
     * @for BaseDate
     * @type {string}
     */
    value: function toString() {
      return "".concat(pad(this.year, 4), " ").concat(pad(this.month, 2), " ").concat(pad(this.date, 2));
    }
    /**
     * Returns the month names object that has Saka, Saura and Kollavarsham (English & Malayalam) month names for the specified index `masaNumber`
     *
     * @method getMasaName
     * @for BaseDate
     * @param masaNumber {Number}
     * @returns { {saka : {string}, saura : {string}, enMalayalam : {string}, mlMalayalam : {string} } }
     */

  }, {
    key: "naksatra",
    get: function get() {
      return this._naksatra || {}; // eslint-disable-line no-underscore-dangle
    },
    set: function set(val) {
      this._naksatra = val; // eslint-disable-line no-underscore-dangle
    }
    /**
     * Returns the Saura Masa name for the current instance of date.
     *
     * @property sauraMasaName
     * @type {string}
     */

  }, {
    key: "sauraMasaName",
    get: function get() {
      return BaseDate.getMasaName(this.sauraMasa).saura;
    }
    /**
     * Returns the weekday (in English) for the current instance of date.
     *
     * @property weekdayName
     * @type {string}
     */

  }, {
    key: "weekdayName",
    get: function get() {
      return _calendar.default.julianDayToWeekday(this.julianDay).en;
    }
    /**
     * Returns the weekday (in Malayalam) for the current instance of date.
     *
     * @property mlWeekdayName
     * @type {string}
     */

  }, {
    key: "mlWeekdayName",
    get: function get() {
      return _calendar.default.julianDayToWeekday(this.julianDay).ml;
    }
  }], [{
    key: "getMasaName",
    value: function getMasaName(masaNumber) {
      return masaNames[masaNumber];
    }
  }]);

  return BaseDate;
}();

var _default = BaseDate;
exports.default = _default;
module.exports = exports.default;