import { T_ArgsBase, T_OutputFormat } from '../types/lib'
import { pad, pad3 } from './shared'

export const setTimeZoneOffset = (date: Date, offset: number, resetCurrent: boolean = true) => {
  if (resetCurrent) date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000)
  date.setTime(date.getTime() + offset * 60 * 60 * 1000)

  return date
}

export const isDateObject = (date: unknown) => {
  return Object.prototype.toString.call(date) === '[object Date]'
}

export const isValidDate = (date: T_ArgsBase['start']) => {
  const processedDate = new Date(date)

  if (isDateObject(processedDate)) {
    return !!processedDate.getTime()
  }

  return false
}

export const toAdjustedTimezoneISOString = (date: Date) => {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  )
}

function getDayOfYear(date: Date, useUtc: boolean = false): number {
  if (useUtc) {
    const y = date.getUTCFullYear()
    const start = Date.UTC(y, 0, 0)
    const diff = date.getTime() - start
    return Math.floor(diff / (24 * 60 * 60 * 1000))
  }
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

const INTL_FORMAT_CACHE = new Map<
  string,
  { monthShort: Intl.DateTimeFormat; monthLong: Intl.DateTimeFormat; weekdayLong: Intl.DateTimeFormat; weekdayShort: Intl.DateTimeFormat }
>()

function getIntlFormatters(locale: string, useUtc: boolean) {
  const key = `${locale}\0${useUtc}`
  let cached = INTL_FORMAT_CACHE.get(key)
  if (!cached) {
    const intlOpts = useUtc ? { timeZone: 'UTC' as const } : {}
    cached = {
      monthShort: new Intl.DateTimeFormat(locale, { month: 'short', ...intlOpts }),
      monthLong: new Intl.DateTimeFormat(locale, { month: 'long', ...intlOpts }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long', ...intlOpts }),
      weekdayShort: new Intl.DateTimeFormat(locale, { weekday: 'short', ...intlOpts }),
    }
    INTL_FORMAT_CACHE.set(key, cached)
  }
  return cached
}

/** Format timezone offset as +HH:mm or -HH:mm (e.g. +00:00, -05:00). */
function getTimezoneOffsetString(date: Date): string {
  const offsetMin = -date.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const absMin = Math.abs(offsetMin)
  const h = Math.floor(absMin / 60)
  const m = absMin % 60
  return `${sign}${pad(h)}:${pad(m)}`
}

/**
 * Format a date according to a supported output format string.
 * All tokens are uppercase: YYYY/YY, MM/M, DD/D, HH, MM (minutes in time), SS, SSS, A (AM/PM), EEE/EEEE (weekday), MMM/MMMM, DDD (day of year), Z (timezone).
 * Format containing ` GMT` uses UTC. Month/weekday names use the given locale (default 'en-US').
 */
export function formatDateByOutputFormat(date: Date, format: T_OutputFormat, locale: string = 'en-US'): string {
  const useUtc = format.includes(' GMT')
  const year = useUtc ? date.getUTCFullYear() : date.getFullYear()
  const month = useUtc ? date.getUTCMonth() : date.getMonth()
  const day = useUtc ? date.getUTCDate() : date.getDate()
  const hours = useUtc ? date.getUTCHours() : date.getHours()
  const minutes = useUtc ? date.getUTCMinutes() : date.getMinutes()
  const seconds = useUtc ? date.getUTCSeconds() : date.getSeconds()
  const ms = useUtc ? date.getUTCMilliseconds() : date.getMilliseconds()

  const use12h = format.includes(' A')
  const hour24 = hours
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const ampm = hours < 12 ? 'AM' : 'PM'

  const { monthShort: monthShortFmt, monthLong: monthLongFmt, weekdayLong: weekdayLongFmt, weekdayShort: weekdayShortFmt } = getIntlFormatters(locale, useUtc)
  const monthShort = monthShortFmt.format(date)
  const monthLong = monthLongFmt.format(date)
  const weekdayLong = weekdayLongFmt.format(date)
  const weekdayShort = weekdayShortFmt.format(date)

  const dayOfYear = getDayOfYear(date, useUtc)
  const tzStr = getTimezoneOffsetString(date)
  const monthPadded = pad(month + 1)
  const dayPadded = pad(day)

  // 1. Weekday (EEEE/EEE) and month names (longest first)
  let out = format
    .replace(/EEEE/g, weekdayLong)
    .replace(/EEE/g, weekdayShort)
    .replace(/MMMM/g, monthLong)
    .replace(/MMM/g, monthShort)

  // 2. Year
  out = out.replace(/YYYY/g, String(year)).replace(/YY/g, String(year).slice(-2))

  // 3. Day of year
  out = out.replace(/DDD/g, pad3(dayOfYear))

  // 4. Minutes in time context (before month MM): :MM: or :MM. or :MM at end
  out = out.replace(/:MM(?=:|\.|$)/g, `:${pad(minutes)}`)

  // 5. Hour (HH), seconds (SS), ms (SSS), AM/PM (A)
  const hourStr = use12h ? pad(hour12) : pad(hour24)
  out = out
    .replace(/HH/g, hourStr)
    .replace(/SSS/g, pad3(ms))
    .replace(/SS/g, pad(seconds))
    .replace(/ A$/g, ` ${ampm}`)
    .replace(/ A /g, ` ${ampm} `)
    .replace(/^A /g, `${ampm} `)
    .replace(/ A/g, ` ${ampm}`)

  // 6. Month 2-digit (MM in date context)
  out = out.replace(/MM/g, monthPadded)

  // 7. Day 2-digit
  out = out.replace(/DD/g, dayPadded)

  // 8. Single M / D (unpadded month/day)
  out = out.replace(/(?<![DM])D(?!D)/g, String(day)).replace(/(?<![DM])M(?!M)/g, String(month + 1))

  // 9. Timezone Z
  out = out.replace(/ Z$/g, ` ${tzStr}`).replace(/Z$/g, tzStr)

  return out
}
