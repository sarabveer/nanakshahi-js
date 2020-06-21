export function getNanakshahiDate(gregorianDate?: object = new Date()): object

export function getDateFromNanakshahi(year: number, month: number, date: number): object

export function getHolidaysForDay(gregorianDate?: object = new Date()): object

export function getHolidaysForMonth(month: number, year?: number): object

export function findMovableHoliday(holiday: string, year?: number): object

export function calculateAstroTimes(date?: object = new Date()): object

export function findBikramiFromDate(date: object, options?: object = { astro: true }): object

export function findDateFromBikramiLunar(
  year: number,
  month: number,
  date: number,
  options?: object = { astro: true },
): object

export function findDateFromBikramiSolar(
  year: number,
  month: number,
  date: number,
  options?: object = { astro: true },
): object