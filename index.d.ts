export function getNanakshahiDate(gregorianDate: object): object

export function getDateFromNanakshahi(year: number, month: number, date: number): object

export function getHolidaysForDay(gregorianDate?: object): object

export function getHolidaysForMonth(month: number, year?: number): object

export function findMovableHoliday(holiday: string, year?: number): object

export function findBikramiFromDate(date: object, astro?: boolean = true, isJulian?: boolean): object

export function findDateFromBikramiLunar(
  year: number,
  month: number,
  date: number,
  paksh?: boolean,
  leapMonth?: boolean,
  leapDay?: boolean,
  astro?: boolean = true,
): object

export function findDateFromBikramiSolar(year: number, month: number, date: number, astro?: boolean = true): object