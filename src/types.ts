export type GurpurabType = 'calendar' | 'gurpurab' | 'historical' | 'bhagat'

export type GurpurabName = {
  en: string
  pa: string
  type: GurpurabType
}

export type MovableGurpurabKey =
  typeof import('./consts/movableGurpurabs').movableGurpurabKeys[number]

export type MovableGurpurab = {
  gregorianDate: Date
  gurpurab: GurpurabName & { movable: true }
}

type DateFields<T> = {
  month: T
  monthName: string
  date: T
  year: T
  day: string
  dayShort: string
}

export type EnglishDate = DateFields<number>

export type PunjabiDate = DateFields<string>

export type NanakshahiDate = {
  gregorianDate: Date
  englishDate: EnglishDate
  punjabiDate: PunjabiDate
  leapYear: boolean
}

export type GurpurabsForMonth = {
  nanakshahiMonth: {
    englishMonth: { month: number; monthName: string; year: number }
    punjabiMonth: { month: string; monthName: string; year: string }
  }
  gurpurabs: {
    date: {
      gregorianDate: Date
      nanakshahiDate: {
        englishDate: Pick<EnglishDate, 'date' | 'day'>
        punjabiDate: Pick<PunjabiDate, 'date' | 'day'>
      }
    }
    gurpurabs: GurpurabName[]
  }[]
}
