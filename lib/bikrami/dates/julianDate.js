"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _baseDate = _interopRequireDefault(require("./baseDate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Represents a Julian date's year, month and day
 * `toGregorianDateFromSaka` method of the {{#crossLink "Kollavarsham"}}{{/crossLink}} class returns an instance of this type for dates
 * older than `1st January 1583 AD`
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class JulianDate
 * @constructor
 * @param [year=1] {Number} Julian year
 * @param [month=1] {Number} Julian month
 * @param [day=1] {Number} Julian day
 * @extends BaseDate
 */
var JulianDate =
/*#__PURE__*/
function (_BaseDate) {
  _inherits(JulianDate, _BaseDate);

  function JulianDate() {
    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, JulianDate);

    return _possibleConstructorReturn(this, _getPrototypeOf(JulianDate).call(this, year, month, day));
  }

  return JulianDate;
}(_baseDate.default);

var _default = JulianDate;
exports.default = _default;
module.exports = exports.default;