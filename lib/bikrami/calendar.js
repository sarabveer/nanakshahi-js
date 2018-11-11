"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _julianDate = _interopRequireDefault(require("./dates/julianDate.js"));

var _mathHelper = _interopRequireDefault(require("./mathHelper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// TODO: Refactor this out
var samkranti = {
  // eslint-disable-line no-underscore-dangle
  ahargana: true,
  Year: true,
  Month: true,
  Day: true,
  Hour: true,
  Min: true
};
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Calendar
 */

var Calendar =
/*#__PURE__*/
function () {
  function Calendar(celestial) {
    _classCallCheck(this, Calendar);

    this.celestial = celestial;
  }

  _createClass(Calendar, [{
    key: "nextDate",
    value: function nextDate(date) {
      // TODO: This looks like a concern of the calling library - But could be exposed as a static utility method (0 usages other than tests)
      date.setUTCDate(date.getUTCDate() + 1);
      return date;
    }
  }, {
    key: "julianInEngland",
    value: function julianInEngland(julianDay) {
      // TODO: This might be exposed as a static utility method (0 usages other than tests)
      // Gregorian calendar was first introduced in most of Europe in 1582,
      // but it wasn't adopted in England (and so in US and Canada) until 1752
      //
      // - http://www.timeanddate.com/calendar/julian-gregorian-switch.html
      //
      // This returns true between
      //      October 14th, 1582 and September 14th, 1752, both dates exclusive
      return julianDay >= 2299160 && julianDay <= 2361221;
    }
  }, {
    key: "aharganaToKali",
    value: function aharganaToKali(ahargana) {
      return _mathHelper.default.truncate(ahargana * this.celestial.planets.sun.YugaRotation / this.celestial.yuga.CivilDays);
    }
  }, {
    key: "kaliToAhargana",
    value: function kaliToAhargana(yearKali, masaNum, tithiDay) {
      var sauraMasas = yearKali * 12 + masaNum; // expired saura masas

      var adhiMasas = _mathHelper.default.truncate(sauraMasas * this.celestial.yuga.Adhimasa / (12 * this.celestial.planets.sun.YugaRotation)); // expired adhimasas


      var candraMasas = sauraMasas + adhiMasas; // expired candra masas

      var tithis = 30 * candraMasas + tithiDay - 1; // expired tithis

      var avamas = _mathHelper.default.truncate(tithis * this.celestial.yuga.Ksayadina / this.celestial.yuga.Tithi); // expired avamas


      return tithis - avamas;
    }
  }, {
    key: "findSamkranti",
    value: function findSamkranti(leftAhargana, rightAhargana) {
      var width = (rightAhargana - leftAhargana) / 2;
      var centreAhargana = (rightAhargana + leftAhargana) / 2;

      if (width < _mathHelper.default.epsilon) {
        return centreAhargana;
      } else {
        var centreTslong = this.celestial.getTrueSolarLongitude(centreAhargana);
        centreTslong -= _mathHelper.default.truncate(centreTslong / 30) * 30;

        if (centreTslong < 5) {
          return this.findSamkranti(leftAhargana, centreAhargana);
        } else {
          return this.findSamkranti(centreAhargana, rightAhargana);
        }
      }
    }
  }, {
    key: "calculateSamkranti",
    value: function calculateSamkranti(ahargana, desantara) {
      samkranti.ahargana = this.findSamkranti(ahargana, ahargana + 1) + desantara; // below line is the fix that Yano-san worked in for Kerala dates - #20140223 cf. try_calculations

      var roundedSamkranti = _mathHelper.default.truncate(samkranti.ahargana) + 0.5;
      var samkrantiModernDate = Calendar.julianDayToModernDate(Calendar.aharganaToJulianDay(roundedSamkranti));

      if (_julianDate.default.prototype.isPrototypeOf(samkrantiModernDate)) {
        samkranti.Year = samkrantiModernDate.year;
        samkranti.Month = samkrantiModernDate.month;
        samkranti.Day = samkrantiModernDate.date;
      } else {
        samkranti.Year = samkrantiModernDate.getFullYear();
        samkranti.Month = samkrantiModernDate.getMonth() + 1;
        samkranti.Day = samkrantiModernDate.getDate();
      }

      var fractionalDay = _mathHelper.default.fractional(samkranti.ahargana) * 24;
      samkranti.Hour = _mathHelper.default.truncate(fractionalDay);
      samkranti.Min = _mathHelper.default.truncate(60 * _mathHelper.default.fractional(fractionalDay));
    }
  }, {
    key: "isTodaySauraMasaFirst",
    value: function isTodaySauraMasaFirst(ahargana, desantara) {
      /*
       //    Definition of the first day
       //    samkranti is between today's 0:00 and 24:00
       //    ==
       //    at 0:00 before 30x, at 24:00 after 30x
       */
      var trueSolarLongitudeToday = this.celestial.getTrueSolarLongitude(ahargana - desantara);
      var trueSolarLongitudeTomorrow = this.celestial.getTrueSolarLongitude(ahargana - desantara + 1);
      trueSolarLongitudeToday -= _mathHelper.default.truncate(trueSolarLongitudeToday / 30) * 30;
      trueSolarLongitudeTomorrow -= _mathHelper.default.truncate(trueSolarLongitudeTomorrow / 30) * 30;

      if (25 < trueSolarLongitudeToday && trueSolarLongitudeTomorrow < 5) {
        // eslint-disable-line yoda
        this.calculateSamkranti(ahargana, desantara);
        return true;
      }

      return false;
    }
  }, {
    key: "getSauraMasaAndSauraDivasa",
    value: function getSauraMasaAndSauraDivasa(ahargana, desantara) {
      // If today is the first day then 1
      // Otherwise yesterday's + 1
      var month;
      var day;
      ahargana = _mathHelper.default.truncate(ahargana);

      if (this.isTodaySauraMasaFirst(ahargana, desantara)) {
        day = 1;
        var tsLongTomorrow = this.celestial.getTrueSolarLongitude(ahargana + 1);
        month = _mathHelper.default.truncate(tsLongTomorrow / 30) % 12;
        month = (month + 12) % 12;
      } else {
        var _this$getSauraMasaAnd = this.getSauraMasaAndSauraDivasa(ahargana - 1, desantara),
            sauraMasa = _this$getSauraMasaAnd.sauraMasa,
            sauraDivasa = _this$getSauraMasaAnd.sauraDivasa;

        month = sauraMasa;
        day = sauraDivasa + 1;
      }

      return {
        sauraMasa: month,
        sauraDivasa: day
      };
    }
  }], [{
    key: "timeIntoFractionalDay",
    value: function timeIntoFractionalDay(date) {
      // TODO: Incorporate this into calculating the multiple-naksatra-per-day (time precision)
      // The year, month and day from the passed in date is discarded and only the time is used.
      // And even from the time information only the hour and minute is used and seconds, milliseconds etc. is discarded
      if (!(date instanceof Date)) {
        throw new Error('Invalid parameter. \'date\' should be an instance of \'Date\'');
      }

      var hour = date.getHours();
      var minute = date.getMinutes();
      return (hour * 60 + minute) / (24 * 60);
    }
  }, {
    key: "gregorianDateToJulianDay",
    value: function gregorianDateToJulianDay(date) {
      //  TODO:
      // Annotate all the magic numbers below !
      // There is some explanation here - http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      if (month < 3) {
        year -= 1;
        month += 12;
      }

      var julianDay = _mathHelper.default.truncate(365.25 * year) + _mathHelper.default.truncate(30.59 * (month - 2)) + day + 1721086.5;

      if (year < 0) {
        julianDay -= 1;

        if (year % 4 === 0 && month > 3) {
          julianDay += 1;
        }
      }

      if (julianDay >= 2299160) {
        julianDay += _mathHelper.default.truncate(year / 400) - _mathHelper.default.truncate(year / 100) + 2;
      }

      return julianDay;
    }
  }, {
    key: "julianDayToJulianDate",
    value: function julianDayToJulianDate(julianDay) {
      var j = _mathHelper.default.truncate(julianDay) + 1402;

      var k = _mathHelper.default.truncate((j - 1) / 1461);

      var l = j - 1461 * k;

      var n = _mathHelper.default.truncate((l - 1) / 365) - _mathHelper.default.truncate(l / 1461);

      var i = l - 365 * n + 30;

      var J = _mathHelper.default.truncate(80 * i / 2447);

      var I = _mathHelper.default.truncate(J / 11);

      var day = i - _mathHelper.default.truncate(2447 * J / 80);

      var month = J + 2 - 12 * I;
      var year = 4 * k + n + I - 4716;
      return new _julianDate.default(year, month, day);
    }
  }, {
    key: "julianDayToGregorianDate",
    value: function julianDayToGregorianDate(julianDay) {
      var a = julianDay + 68569;

      var b = _mathHelper.default.truncate(a / 36524.25);

      var c = a - _mathHelper.default.truncate(36524.25 * b + 0.75);

      var e = _mathHelper.default.truncate((c + 1) / 365.2425);

      var f = c - _mathHelper.default.truncate(365.25 * e) + 31;

      var g = _mathHelper.default.truncate(f / 30.59);

      var h = _mathHelper.default.truncate(g / 11);

      var day = _mathHelper.default.truncate(f - _mathHelper.default.truncate(30.59 * g) + (julianDay - _mathHelper.default.truncate(julianDay)));

      var month = _mathHelper.default.truncate(g - 12 * h + 2);

      var year = _mathHelper.default.truncate(100 * (b - 49) + e + h);

      var result = new Date(year, month - 1, day);

      if (year > 0 && year <= 99) {
        result.setFullYear(year);
      }

      return result;
    }
  }, {
    key: "julianDayToModernDate",
    value: function julianDayToModernDate(julianDay) {
      // Will return JulianDate object for any date before 1st January 1583 AD and Date objects for later dates
      return julianDay < 2299239 ? Calendar.julianDayToJulianDate(julianDay) : Calendar.julianDayToGregorianDate(julianDay);
    }
  }, {
    key: "julianDayToAhargana",
    value: function julianDayToAhargana(julianDay) {
      return julianDay - 588465.50;
    }
  }, {
    key: "aharganaToJulianDay",
    value: function aharganaToJulianDay(ahargana) {
      return 588465.50 + ahargana;
    }
  }, {
    key: "kaliToSaka",
    value: function kaliToSaka(yearKali) {
      return yearKali - 3179;
    }
  }, {
    key: "sakaToKali",
    value: function sakaToKali(yearSaka) {
      return yearSaka + 3179;
    }
  }, {
    key: "julianDayToWeekday",
    value: function julianDayToWeekday(julianDay) {
      return Calendar.weekdays[_mathHelper.default.truncate(julianDay + 0.5) % 7];
    }
  }, {
    key: "getAdhimasa",
    value: function getAdhimasa(lastConjunctionLongitude, nextConjunctionLongitude) {
      var n1 = _mathHelper.default.truncate(lastConjunctionLongitude / 30);

      var n2 = _mathHelper.default.truncate(nextConjunctionLongitude / 30);

      return Math.abs(n1 - n2) < _mathHelper.default.epsilon ? 'Adhika-' : '';
    }
  }, {
    key: "getMasaNum",
    value: function getMasaNum(trueSolarLongitude, lastConjunctionLongitude) {
      var masaNum = _mathHelper.default.truncate(trueSolarLongitude / 30) % 12;

      if (masaNum === _mathHelper.default.truncate(lastConjunctionLongitude / 30) % 12) {
        masaNum += 1;
      }

      masaNum = (masaNum + 12) % 12;
      return masaNum;
    }
  }, {
    key: "getNaksatra",
    value: function getNaksatra(trueLunarLongitude) {
      return Calendar.naksatras[_mathHelper.default.truncate(trueLunarLongitude * 27 / 360)];
    }
  }, {
    key: "weekdays",
    get: function get() {
      return {
        0: {
          en: 'Monday',
          ml: 'തിങ്കൾ'
        },
        1: {
          en: 'Tuesday',
          ml: 'ചൊവ്വ'
        },
        2: {
          en: 'Wednesday',
          ml: 'ബുധൻ'
        },
        3: {
          en: 'Thursday',
          ml: 'വ്യാഴം'
        },
        4: {
          en: 'Friday',
          ml: 'വെള്ളി'
        },
        5: {
          en: 'Saturday',
          ml: 'ശനി'
        },
        6: {
          en: 'Sunday',
          ml: 'ഞായർ'
        }
      };
    }
  }, {
    key: "months",
    get: function get() {
      return {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
      };
    }
  }, {
    key: "naksatras",
    get: function get() {
      return {
        0: {
          saka: 'Asvini',
          enMalayalam: 'Ashwathi',
          mlMalayalam: 'അശ്വതി'
        },
        1: {
          saka: 'Bharani',
          enMalayalam: 'Bharani',
          mlMalayalam: 'ഭരണി'
        },
        2: {
          saka: 'Krttika',
          enMalayalam: 'Karthika',
          mlMalayalam: 'കാർത്തിക'
        },
        3: {
          saka: 'Rohini',
          enMalayalam: 'Rohini',
          mlMalayalam: 'രോഹിണി'
        },
        4: {
          saka: 'Mrgasira',
          enMalayalam: 'Makiryam',
          mlMalayalam: 'മകയിരം'
        },
        5: {
          saka: 'Ardra',
          enMalayalam: 'Thiruvathira',
          mlMalayalam: 'തിരുവാതിര'
        },
        6: {
          saka: 'Punarvasu',
          enMalayalam: 'Punartham',
          mlMalayalam: 'പുണർതം'
        },
        7: {
          saka: 'Pusya',
          enMalayalam: 'Pooyam',
          mlMalayalam: 'പൂയം'
        },
        8: {
          saka: 'Aslesa',
          enMalayalam: 'Aayilyam',
          mlMalayalam: 'ആയില്യം'
        },
        9: {
          saka: 'Magha',
          enMalayalam: 'Makam',
          mlMalayalam: 'മകം'
        },
        10: {
          saka: 'P-phalguni',
          enMalayalam: 'Pooram',
          mlMalayalam: 'പൂരം'
        },
        11: {
          saka: 'U-phalguni',
          enMalayalam: 'Uthram',
          mlMalayalam: 'ഉത്രം'
        },
        12: {
          saka: 'Hasta',
          enMalayalam: 'Atham',
          mlMalayalam: 'അത്തം'
        },
        13: {
          saka: 'Citra',
          enMalayalam: 'Chithra',
          mlMalayalam: 'ചിത്ര'
        },
        14: {
          saka: 'Svati',
          enMalayalam: 'Chothi',
          mlMalayalam: 'ചോതി'
        },
        15: {
          saka: 'Visakha',
          enMalayalam: 'Vishakham',
          mlMalayalam: 'വിശാഖം'
        },
        16: {
          saka: 'Anuradha',
          enMalayalam: 'Anizham',
          mlMalayalam: 'അനിഴം'
        },
        17: {
          saka: 'Jyestha',
          enMalayalam: 'Thrikketta',
          mlMalayalam: 'തൃക്കേട്ട'
        },
        18: {
          saka: 'Mula',
          enMalayalam: 'Moolam',
          mlMalayalam: 'മൂലം'
        },
        19: {
          saka: 'P-asadha',
          enMalayalam: 'Pooradam',
          mlMalayalam: 'പൂരാടം'
        },
        20: {
          saka: 'U-asadha',
          enMalayalam: 'Uthradam',
          mlMalayalam: 'ഉത്രാടം'
        },
        21: {
          saka: 'Sravana',
          enMalayalam: 'Thiruvonam',
          mlMalayalam: 'തിരുവോണം'
        },
        22: {
          saka: 'Dhanistha',
          enMalayalam: 'Avittam',
          mlMalayalam: 'അവിട്ടം'
        },
        23: {
          saka: 'Satabhisaj',
          enMalayalam: 'Chathayam',
          mlMalayalam: 'ചതയം'
        },
        24: {
          saka: 'P-bhadrapada',
          enMalayalam: 'Poororuttathi',
          mlMalayalam: 'പൂരുരുട്ടാതി'
        },
        25: {
          saka: 'U-bhadrapada',
          enMalayalam: 'Uthrattathi',
          mlMalayalam: 'ഉത്രട്ടാതി'
        },
        26: {
          saka: 'Revati',
          enMalayalam: 'Revathi',
          mlMalayalam: 'രേവതി'
        },
        27: {
          saka: 'Asvini',
          enMalayalam: 'Ashwathi',
          mlMalayalam: 'അശ്വതി'
        }
      };
    }
  }]);

  return Calendar;
}();

var _default = Calendar;
exports.default = _default;
module.exports = exports.default;