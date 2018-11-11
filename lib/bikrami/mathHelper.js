"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 * kollavarsham
 * http://kollavarsham.org
 *
 * Copyright (c) 2014-2018 The Kollavarsham Team
 * Licensed under the MIT license.
 */

/**
 * @module mathHelper
 */
var _epsilon = 1e-8; // eslint-disable-line no-underscore-dangle

var _radianInDegrees = 180 / Math.PI; // eslint-disable-line no-underscore-dangle

/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class MathHelper
 */


var MathHelper =
/*#__PURE__*/
function () {
  function MathHelper() {
    _classCallCheck(this, MathHelper);
  }

  _createClass(MathHelper, null, [{
    key: "isNumber",
    value: function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }, {
    key: "isInt",
    value: function isInt(n) {
      return MathHelper.isNumber(n) && n % 1 === 0;
    }
  }, {
    key: "truncateDecimals",
    value: function truncateDecimals(num, digits) {
      // Thanks Nick Knowlson! - http://stackoverflow.com/a/9232092/218882
      //     (The original from that answer has a bug though, where an integer was getting rounded to "".
      //      Caught it while getting calendar.gregorianDateToJulianDay to work. 2 hours... Phew!)
      var numS = num.toString();
      var decPos = numS.indexOf('.');
      var result = decPos === -1 ? num : numS.substr(0, 1 + decPos + digits);
      var resultAsNumber = parseFloat(result);
      return isNaN(resultAsNumber) ? 0 : resultAsNumber;
    }
  }, {
    key: "truncate",
    value: function truncate(n) {
      return MathHelper.truncateDecimals(n, 0);
    }
  }, {
    key: "floor",
    value: function floor(n) {
      var result = Math.floor(n);
      return isNaN(result) ? 0 : result;
    }
  }, {
    key: "fractional",
    value: function fractional(n) {
      var result = n % 1;
      return isNaN(result) ? 0 : result;
    }
  }, {
    key: "round",
    value: function round(n) {
      return MathHelper.isNumber(n) ? MathHelper.floor(parseFloat(n) + 0.5) : 0;
    }
  }, {
    key: "square",
    value: function square(n) {
      return MathHelper.isNumber(n) ? Math.pow(parseFloat(n), 2) : 0;
    }
  }, {
    key: "zero360",
    value: function zero360(angleInDegrees) {
      var result = angleInDegrees - MathHelper.truncate(angleInDegrees / 360) * 360;
      return result < 0 ? 360 + result : result;
    }
  }, {
    key: "epsilon",
    get: function get() {
      return _epsilon;
    }
  }, {
    key: "radianInDegrees",
    get: function get() {
      return _radianInDegrees;
    }
  }]);

  return MathHelper;
}();

var _default = MathHelper;
exports.default = _default;
module.exports = exports.default;