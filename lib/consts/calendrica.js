/*
  CALENDRICA 4.0 -- Common Lisp
  Copyright (C) E. M. Reingold and N. Dershowitz
*/

// Sidereal Year: 365.25875648148
// 365 days, 6 hours, 12 minutes, 37 seconds
const HINDU_SIDEREAL_YEAR = 365 + 279457 / 1080000

// Sidereal Month: 27.32167416268
// 27 days, 7 hours, 43 minutes, 13 seconds
const HINDU_SIDEREAL_MONTH = 27 + 4644439 / 14438334

// Synodic Month:  29.53058794607
// Mean time from new moon to new moon.
// 29 days, 12 hours, 44 minutes, 3 seconds
const HINDU_SYNODIC_MONTH = 29 + 7087771 / 13358334

// Start of Kali Yuga in J.D.
// Friday, January 23, -3101 (Gregorian)
// February 18, 3012 B.C.E. (Julian)
// 588465.5 J.D.
// -1132959 R.D.
// 0 Kali-Ahargana
const HINDU_EPOCH = 588465.5

// Fixed date of Hindu creation.
const HINDU_CREATION = HINDU_EPOCH - 1955880000 * HINDU_SIDEREAL_YEAR

// Time from aphelion to aphelion.
const HINDU_ANOMALISTIC_YEAR = 1577917828000 / ( 4320000000 - 387 )

// Time from apogee to apogee, with bija correction.
const HINDU_ANOMALISTIC_MONTH = 1577917828 / ( 57753336 - 488199 )

// Years from Kali Yuga until Bikrami era.
// 0 B.K. = 3044 K.Y.
const HINDU_SOLAR_ERA = 3044
const HINDU_LUNAR_ERA = 3044

module.exports = {
  HINDU_SIDEREAL_YEAR,
  HINDU_SIDEREAL_MONTH,
  HINDU_SYNODIC_MONTH,
  HINDU_EPOCH,
  HINDU_CREATION,
  HINDU_ANOMALISTIC_YEAR,
  HINDU_ANOMALISTIC_MONTH,
  HINDU_SOLAR_ERA,
  HINDU_LUNAR_ERA,
}
