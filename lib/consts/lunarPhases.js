// Import Calendrica 4.0
const { astronomy: { MEAN_SYNODIC_MONTH } } = require( '../calendrica' )

const length = ( MEAN_SYNODIC_MONTH - 4 ) / 4

module.exports = [
  { emoji: '🌑', name: 'New Moon', length: 1 },
  { emoji: '🌒', name: 'Waxing Crescent', length },
  { emoji: '🌓', name: 'First Quarter', length: 1 },
  { emoji: '🌔', name: 'Waxing Gibbous', length },
  { emoji: '🌕', name: 'Full Moon', length: 1 },
  { emoji: '🌖', name: 'Waning Gibbous', length },
  { emoji: '🌗', name: 'Last Quarter', length: 1 },
  { emoji: '🌘', name: 'Waning Crescent', length },
]
