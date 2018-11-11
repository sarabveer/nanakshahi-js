"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mathHelper = _interopRequireDefault(require("./../mathHelper.js"));

var _index = _interopRequireDefault(require("./planetarySystem/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *
 *  **INTERNAL/PRIVATE**
 *
 * @class Celestial
 */
var Celestial =
/*#__PURE__*/
function () {
  function Celestial() {
    var system = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SuryaSiddhanta';

    _classCallCheck(this, Celestial);

    var planetarySystem = new _index.default(system);
    this.planets = planetarySystem.planets;
    this.yuga = planetarySystem.yuga;
    this.backLastConjunctionAhargana = -1;
    this.backNextConjunctionAhargana = -1;
    this.backLastConjunctionLongitude = -1;
    this.backNextConjunctionLongitude = -1;
  }

  _createClass(Celestial, [{
    key: "setPlanetaryPositions",
    value: function setPlanetaryPositions(ahargana) {
      var $planets = this.planets; // Lunar apogee and node at sunrise

      $planets.candrocca.MeanPosition = _mathHelper.default.zero360(this.getMeanLongitude(ahargana, $planets.candrocca.YugaRotation) + 90);
      $planets.rahu.MeanPosition = _mathHelper.default.zero360(this.getMeanLongitude(ahargana, $planets.rahu.YugaRotation) + 180); // mean and true sun at sunrise

      var meanSolarLongitude = this.getMeanLongitude(ahargana, $planets.sun.YugaRotation);
      $planets.sun.MeanPosition = meanSolarLongitude;

      var trueSolarLongitude = _mathHelper.default.zero360(meanSolarLongitude - this.getMandaEquation(meanSolarLongitude - $planets.sun.Apogee, 'sun')); // mean and true moon at sunrise


      var meanLunarLongitude = this.getMeanLongitude(ahargana, $planets.moon.YugaRotation);
      $planets.moon.MeanPosition = meanLunarLongitude;
      $planets.moon.Apogee = $planets.candrocca.MeanPosition;

      var trueLunarLongitude = _mathHelper.default.zero360(meanLunarLongitude - this.getMandaEquation(meanLunarLongitude - $planets.moon.Apogee, 'moon')); // The below was a separate method named calculations.planetary (ported from planetary_calculations in perl)


      var planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];

      for (var i = 0; i < planetNames.length; i++) {
        $planets[planetNames[i]].MeanPosition = this.getMeanLongitude(ahargana, $planets[planetNames[i]].Rotation);
      }

      return {
        trueSolarLongitude: trueSolarLongitude,
        trueLunarLongitude: trueLunarLongitude
      };
    }
  }, {
    key: "getMeanLongitude",
    value: function getMeanLongitude(ahargana, rotation) {
      // https://en.wikipedia.org/wiki/Mean_longitude
      // https://en.wikipedia.org/wiki/Ecliptic_coordinate_system#Spherical_coordinates
      return 360 * _mathHelper.default.fractional(rotation * ahargana / this.yuga.CivilDays);
    }
  }, {
    key: "getDaylightEquation",
    value: function getDaylightEquation(year, latitude, ahargana) {
      // Good read - http://en.wikipedia.org/wiki/Equation_of_time#Calculating_the_equation_of_time
      var meanSolarLongitude = this.getMeanLongitude(ahargana, this.planets.sun.YugaRotation); // Sayana Solar Longitude and Declination

      var sayanaMeanSolarLongitude = meanSolarLongitude + 54 / 3600 * (year - 499);
      var sayanaDeclination = Celestial.declination(sayanaMeanSolarLongitude); // See Sewell, p.10
      // Equation of day light by Analemma (https://en.wikipedia.org/wiki/Analemma)

      var x = Math.tan(latitude / _mathHelper.default.radianInDegrees) * Math.tan(sayanaDeclination / _mathHelper.default.radianInDegrees);
      return 0.5 * Math.asin(x) / Math.PI;
    }
  }, {
    key: "getMandaEquation",
    value: function getMandaEquation(argument, planet) {
      return Math.asin(this.planets[planet].MandaCircumference / 360 * Math.sin(argument / _mathHelper.default.radianInDegrees)) * _mathHelper.default.radianInDegrees;
    }
  }, {
    key: "getTrueLunarLongitude",
    value: function getTrueLunarLongitude(ahargana) {
      var meanLunarLongitude = this.getMeanLongitude(ahargana, this.planets.moon.YugaRotation);
      var apogee = this.getMeanLongitude(ahargana, this.planets.candrocca.YugaRotation) + 90;
      return _mathHelper.default.zero360(meanLunarLongitude - this.getMandaEquation(meanLunarLongitude - apogee, 'moon'));
    }
  }, {
    key: "getTrueSolarLongitude",
    value: function getTrueSolarLongitude(ahargana) {
      var meanSolarLongitude = this.getMeanLongitude(ahargana, this.planets.sun.YugaRotation);
      return _mathHelper.default.zero360(meanSolarLongitude - this.getMandaEquation(meanSolarLongitude - this.planets.sun.Apogee, 'sun'));
    }
  }, {
    key: "getEclipticLongitude",
    value: function getEclipticLongitude(ahargana) {
      var eclipticLongitude = Math.abs(this.getTrueLunarLongitude(ahargana) - this.getTrueSolarLongitude(ahargana));

      if (eclipticLongitude >= 180) {
        eclipticLongitude = 360 - eclipticLongitude;
      }

      return eclipticLongitude;
    }
  }, {
    key: "findConjunction",
    value: function findConjunction(leftX, leftY, rightX, rightY) {
      var width = (rightX - leftX) / 2;
      var centreX = (rightX + leftX) / 2;

      if (width < _mathHelper.default.epsilon) {
        return this.getTrueSolarLongitude(centreX);
      } else {
        var centreY = this.getEclipticLongitude(centreX);
        var relation = Celestial.threeRelation(leftY, centreY, rightY);

        if (relation < 0) {
          rightX += width;
          rightY = this.getEclipticLongitude(rightX);
          return this.findConjunction(centreX, centreY, rightX, rightY);
        } else if (relation > 0) {
          leftX -= width;
          leftY = this.getEclipticLongitude(leftX);
          return this.findConjunction(leftX, leftY, centreX, centreY);
        } else {
          leftX += width / 2;
          leftY = this.getEclipticLongitude(leftX);
          rightX -= width / 2;
          rightY = this.getEclipticLongitude(rightX);
          return this.findConjunction(leftX, leftY, rightX, rightY);
        }
      }
    }
  }, {
    key: "getConjunction",
    value: function getConjunction(ahargana) {
      var leftX = ahargana - 2;
      var leftY = this.getEclipticLongitude(leftX);
      var rightX = ahargana + 2;
      var rightY = this.getEclipticLongitude(rightX);
      return this.findConjunction(leftX, leftY, rightX, rightY);
    }
  }, {
    key: "getLastConjunctionLongitude",
    value: function getLastConjunctionLongitude(ahargana, tithi) {
      var newNew = this.yuga.CivilDays / (this.planets.moon.YugaRotation - this.planets.sun.YugaRotation);
      ahargana -= tithi * (newNew / 30);

      if (Math.abs(ahargana - this.backLastConjunctionAhargana) < 1) {
        return this.backLastConjunctionLongitude;
      } else if (Math.abs(ahargana - this.backNextConjunctionAhargana) < 1) {
        this.backLastConjunctionAhargana = this.backNextConjunctionAhargana;
        this.backLastConjunctionLongitude = this.backNextConjunctionLongitude;
        return this.backNextConjunctionLongitude;
      } else {
        this.backLastConjunctionAhargana = ahargana;
        this.backLastConjunctionLongitude = this.getConjunction(ahargana);
        return this.backLastConjunctionLongitude;
      }
    }
  }, {
    key: "getNextConjunctionLongitude",
    value: function getNextConjunctionLongitude(ahargana, tithi) {
      var newNew = this.yuga.CivilDays / (this.planets.moon.YugaRotation - this.planets.sun.YugaRotation);
      ahargana += (30 - tithi) * (newNew / 30);

      if (Math.abs(ahargana - this.backNextConjunctionAhargana) < 1) {
        return this.backNextConjunctionLongitude;
      } else {
        this.backNextConjunctionAhargana = ahargana;
        this.backNextConjunctionLongitude = this.getConjunction(ahargana);
        return this.backNextConjunctionLongitude;
      }
    }
  }], [{
    key: "threeRelation",
    value: function threeRelation(left, center, right) {
      if (left < center && center < right) {
        return 1;
      } else if (right < center && center < left) {
        return -1;
      }

      return 0;
    }
  }, {
    key: "declination",
    value: function declination(longitude) {
      // https://en.wikipedia.org/wiki/Declination
      return Math.asin(Math.sin(longitude / _mathHelper.default.radianInDegrees) * Math.sin(24 / _mathHelper.default.radianInDegrees)) * _mathHelper.default.radianInDegrees;
    }
  }, {
    key: "getSunriseTime",
    value: function getSunriseTime(time, equationOfTime) {
      // TODO: Add Tests if/when feasible
      var sunriseTime = (time - equationOfTime) * 24;

      var sunriseHour = _mathHelper.default.truncate(sunriseTime);

      var sunriseMinute = _mathHelper.default.truncate(60 * _mathHelper.default.fractional(sunriseTime));

      return {
        sunriseHour: sunriseHour,
        sunriseMinute: sunriseMinute
      };
    }
  }, {
    key: "getTithi",
    value: function getTithi(trueSolarLongitude, trueLunarLongitude) {
      var eclipticLongitude = trueLunarLongitude - trueSolarLongitude;
      eclipticLongitude = _mathHelper.default.zero360(eclipticLongitude);
      return eclipticLongitude / 12;
    }
  }]);

  return Celestial;
}();

var _default = Celestial;
exports.default = _default;
module.exports = exports.default;