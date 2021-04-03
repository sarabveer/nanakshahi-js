const { general: { angle, hr } } = require( 'calendrica' )

module.exports = {
  latitude: angle( 31, 37, 12 ),
  longitude: angle( 74, 52, 35 ),
  elevation: 0,
  zone: hr( 5 + 1 / 2 ),
}
