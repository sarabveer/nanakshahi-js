"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * kollavarsham
 * http://kollavarsham.org
 *
 * Copyright (c) 2014-2018 The Kollavarsham Team
 * Licensed under the MIT license.
 */

/**
 * @module planets
 */

/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Planet
 * @constructor
 */
var Planet = function Planet() {
  _classCallCheck(this, Planet);

  /**
   * Name of the planet subclass
   *
   * @property name
   * @type {string}
   */
  this.name = null;
  /**
   * **TODO: Description**
   *
   * @property YugaRotation
   * @type {Number}
   */

  this.YugaRotation = 0; // sidereal rotations

  /**
   * **TODO: Description**
   *
   * @property Rotation
   * @type {Number}
   */

  this.Rotation = 0;
  /**
   * **TODO: Description**
   *
   * @property Sighra
   * @type {Number}
   */

  this.Sighra = 0;
  /**
   * **TODO: Description**
   *
   * @property MeanPosition
   * @type {Number}
   */

  this.MeanPosition = 0;
  /**
   * **TODO: Description**
   *
   * @property Apogee
   * @type {Number}
   */

  this.Apogee = 0;
  /**
   * **TODO: Description**
   *
   * @property MandaCircumference
   * @type {Number}
   */

  this.MandaCircumference = 0;
  /**
   * **TODO: Description**
   *
   * @property SighraCircumference
   * @type {Number}
   */

  this.SighraCircumference = 0;
};
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Star
 * @extends Planet
 */


var Star =
/*#__PURE__*/
function (_Planet) {
  _inherits(Star, _Planet);

  function Star() {
    var _this;

    _classCallCheck(this, Star);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Star).call(this));
    _this.name = 'star';
    return _this;
  }

  return Star;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Sun
 * @extends Planet
 */


var Sun =
/*#__PURE__*/
function (_Planet2) {
  _inherits(Sun, _Planet2);

  function Sun() {
    var _this2;

    _classCallCheck(this, Sun);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Sun).call(this));
    _this2.name = 'sun';
    return _this2;
  }

  return Sun;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Moon
 * @extends Planet
 */


var Moon =
/*#__PURE__*/
function (_Planet3) {
  _inherits(Moon, _Planet3);

  function Moon() {
    var _this3;

    _classCallCheck(this, Moon);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Moon).call(this));
    _this3.name = 'moon';
    return _this3;
  }

  return Moon;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Mercury
 * @extends Planet
 */


var Mercury =
/*#__PURE__*/
function (_Planet4) {
  _inherits(Mercury, _Planet4);

  function Mercury() {
    var _this4;

    _classCallCheck(this, Mercury);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Mercury).call(this));
    _this4.name = 'mercury';
    return _this4;
  }

  return Mercury;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Venus
 * @extends Planet
 */


var Venus =
/*#__PURE__*/
function (_Planet5) {
  _inherits(Venus, _Planet5);

  function Venus() {
    var _this5;

    _classCallCheck(this, Venus);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Venus).call(this));
    _this5.name = 'venus';
    return _this5;
  }

  return Venus;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Mars
 * @extends Planet
 */


var Mars =
/*#__PURE__*/
function (_Planet6) {
  _inherits(Mars, _Planet6);

  function Mars() {
    var _this6;

    _classCallCheck(this, Mars);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Mars).call(this));
    _this6.name = 'mars';
    return _this6;
  }

  return Mars;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Jupiter
 * @extends Planet
 */


var Jupiter =
/*#__PURE__*/
function (_Planet7) {
  _inherits(Jupiter, _Planet7);

  function Jupiter() {
    var _this7;

    _classCallCheck(this, Jupiter);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(Jupiter).call(this));
    _this7.name = 'jupiter';
    return _this7;
  }

  return Jupiter;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Saturn
 * @extends Planet
 */


var Saturn =
/*#__PURE__*/
function (_Planet8) {
  _inherits(Saturn, _Planet8);

  function Saturn() {
    var _this8;

    _classCallCheck(this, Saturn);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(Saturn).call(this));
    _this8.name = 'saturn';
    return _this8;
  }

  return Saturn;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Candrocca
 * @extends Planet
 */


var Candrocca =
/*#__PURE__*/
function (_Planet9) {
  _inherits(Candrocca, _Planet9);

  function Candrocca() {
    var _this9;

    _classCallCheck(this, Candrocca);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Candrocca).call(this));
    _this9.name = 'candrocca';
    return _this9;
  }

  return Candrocca;
}(Planet);
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Rahu
 * @extends Planet
 */


var Rahu =
/*#__PURE__*/
function (_Planet10) {
  _inherits(Rahu, _Planet10);

  function Rahu() {
    var _this10;

    _classCallCheck(this, Rahu);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(Rahu).call(this));
    _this10.name = 'rahu';
    return _this10;
  }

  return Rahu;
}(Planet);

var _default = {
  Planet: Planet,
  Star: Star,
  Sun: Sun,
  Moon: Moon,
  Mercury: Mercury,
  Venus: Venus,
  Mars: Mars,
  Jupiter: Jupiter,
  Saturn: Saturn,
  Candrocca: Candrocca,
  Rahu: Rahu
};
exports.default = _default;
module.exports = exports.default;