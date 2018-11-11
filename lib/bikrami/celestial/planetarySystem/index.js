"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _index = _interopRequireDefault(require("./planets/index.js"));

var _yuga2 = _interopRequireDefault(require("./yuga.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var star;
var sun;
var moon;
var mercury;
var venus;
var mars;
var jupiter;
var saturn;
var candrocca; // Moon Apogee

var rahu; // Moon Node

var _yuga; // eslint-disable-line no-underscore-dangle


var planetsList;
/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class PlanetarySystem
 */

var PlanetarySystem =
/*#__PURE__*/
function () {
  function PlanetarySystem() {
    var system = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SuryaSiddhanta';

    _classCallCheck(this, PlanetarySystem);

    this.system = system === 'InPancasiddhantika' ? system : 'SuryaSiddhanta';
    star = new _index.default.Star();
    sun = new _index.default.Sun();
    moon = new _index.default.Moon();
    mercury = new _index.default.Mercury();
    venus = new _index.default.Venus();
    mars = new _index.default.Mars();
    jupiter = new _index.default.Jupiter();
    saturn = new _index.default.Saturn();
    candrocca = new _index.default.Candrocca(); // Moon Apogee

    rahu = new _index.default.Rahu(); // Moon Node

    _yuga = new _yuga2.default();
    this.initializeYugaRotations();
    this.initializeYuga();
    PlanetarySystem.initializePlanetaryConstants();
    planetsList = _lodash.default.keyBy([star, sun, moon, mercury, venus, mars, jupiter, saturn, candrocca, rahu], 'name');
  }

  _createClass(PlanetarySystem, [{
    key: "initializeYugaRotations",
    value: function initializeYugaRotations() {
      // common values across the systems
      sun.YugaRotation = 4320000;
      moon.YugaRotation = 57753336;
      jupiter.YugaRotation = 364220;
      var isSuryaSiddhantaSystem = this.system === 'SuryaSiddhanta'; // # Saura, HIL, p.15 && # Latadeva/Ardharatrika, HIL, p.15

      star.YugaRotation = isSuryaSiddhantaSystem ? 1582237800 : 1582237828;
      mercury.YugaRotation = isSuryaSiddhantaSystem ? 17937000 : 17937060;
      venus.YugaRotation = isSuryaSiddhantaSystem ? 7022388 : 7022376;
      mars.YugaRotation = isSuryaSiddhantaSystem ? 2296824 : 2296832;
      saturn.YugaRotation = isSuryaSiddhantaSystem ? 146564 : 146568;
      candrocca.YugaRotation = isSuryaSiddhantaSystem ? 488219 : 488203;
      rahu.YugaRotation = isSuryaSiddhantaSystem ? -232226 : -232238;
    }
  }, {
    key: "initializeYuga",
    value: function initializeYuga() {
      this.yuga.CivilDays = star.YugaRotation - sun.YugaRotation;
      this.yuga.SynodicMonth = moon.YugaRotation - sun.YugaRotation;
      this.yuga.Adhimasa = this.yuga.SynodicMonth - 12 * sun.YugaRotation;
      this.yuga.Tithi = 30 * this.yuga.SynodicMonth;
      this.yuga.Ksayadina = this.yuga.Tithi - this.yuga.CivilDays;
    }
  }, {
    key: "yuga",
    get: function get() {
      return _yuga;
    }
  }, {
    key: "planets",
    get: function get() {
      return planetsList;
    }
  }], [{
    key: "initializePlanetaryConstants",
    value: function initializePlanetaryConstants() {
      // star
      star.Rotation = 0;
      star.Sighra = 0;
      star.Apogee = 0;
      star.MandaCircumference = 0;
      star.SighraCircumference = 0; // sun

      sun.Rotation = sun.YugaRotation;
      sun.Sighra = sun.YugaRotation;
      sun.Apogee = 77 + 17 / 60;
      sun.MandaCircumference = 13 + 50 / 60;
      sun.SighraCircumference = 0; // moon

      moon.Rotation = moon.YugaRotation;
      moon.Sighra = 0;
      moon.Apogee = 0;
      moon.MandaCircumference = 31 + 50 / 60;
      moon.SighraCircumference = 0; // mercury

      mercury.Rotation = sun.YugaRotation;
      mercury.Sighra = mercury.YugaRotation;
      mercury.Apogee = 220 + 27 / 60;
      mercury.MandaCircumference = 29;
      mercury.SighraCircumference = 131.5; // venus

      venus.Rotation = sun.YugaRotation;
      venus.Sighra = venus.YugaRotation;
      venus.Apogee = 79 + 50 / 60;
      venus.MandaCircumference = 11.5;
      venus.SighraCircumference = 261; // mars

      mars.Rotation = mars.YugaRotation;
      mars.Sighra = sun.YugaRotation;
      mars.Apogee = 130 + 2 / 60;
      mars.MandaCircumference = 73.5;
      mars.SighraCircumference = 233.5; // jupiter

      jupiter.Rotation = jupiter.YugaRotation;
      jupiter.Sighra = sun.YugaRotation;
      jupiter.Apogee = 171 + 18 / 60;
      jupiter.MandaCircumference = 32.5;
      jupiter.SighraCircumference = 71; // saturn

      saturn.Rotation = saturn.YugaRotation;
      saturn.Sighra = sun.YugaRotation;
      saturn.Apogee = 236 + 37 / 60;
      saturn.MandaCircumference = 48.5;
      saturn.SighraCircumference = 39.5; // Candrocca

      candrocca.Rotation = candrocca.YugaRotation;
      candrocca.Sighra = 0;
      candrocca.Apogee = 0;
      candrocca.MandaCircumference = 0;
      candrocca.SighraCircumference = 0; // Rahu

      rahu.Rotation = rahu.YugaRotation;
      rahu.Sighra = 0;
      rahu.Apogee = 0;
      rahu.MandaCircumference = 0;
      rahu.SighraCircumference = 0;
    }
  }]);

  return PlanetarySystem;
}();

var _default = PlanetarySystem;
exports.default = _default;
module.exports = exports.default;