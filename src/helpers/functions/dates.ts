import { T_ArgsBase, T_CoreArgs, T_OutputFormat } from '@/helpers/types/lib'
import { getOutputLocale } from '@/helpers/functions/locale'
import { hasFormatOptions, pad, pad3 } from '@/helpers/functions/shared'

export function cloneDate(date: Date): Date {
  return new Date(date.getTime())
}

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

const MAX_INTL_CACHE_SIZE = 32
const INTL_FORMAT_CACHE = new Map<
  string,
  {
    monthShort: Intl.DateTimeFormat
    monthLong: Intl.DateTimeFormat
    weekdayLong: Intl.DateTimeFormat
    weekdayShort: Intl.DateTimeFormat
  }
>()

function getIntlFormatters(locale: string, useUtc: boolean) {
  const key = `${locale}\0${useUtc}`
  let cached = INTL_FORMAT_CACHE.get(key)
  if (!cached) {
    if (INTL_FORMAT_CACHE.size >= MAX_INTL_CACHE_SIZE) INTL_FORMAT_CACHE.clear()
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

function getTimezoneOffsetString(date: Date): string {
  const offsetMin = -date.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const absMin = Math.abs(offsetMin)
  const h = Math.floor(absMin / 60)
  const m = absMin % 60
  return `${sign}${pad(h)}:${pad(m)}`
}

/**
 * Formats a date using a supported output format string from {@link OUTPUT_FORMATS}.
 *
 * **Tokens (all uppercase):** YYYY/YY (year), MM/M (month), DD/D (day), HH (hour; 12h when format contains ` A`), MM in time context (minutes), SS (seconds), SSS (milliseconds), A (AM/PM), EEE/EEEE (weekday short/long), MMM/MMMM (month short/long), DDD (day of year), Z (timezone offset e.g. +00:00). Uses local time; use result’s utcDate for UTC. Month and weekday names use the given locale.
 *
 * @param date - The Date instance to format.
 * @param format - One of the strings in {@link OUTPUT_FORMATS} (e.g. `'YYYY-MM-DD'`, `'YYYY-MM-DD HH:MM'`, `'MM/DD/YYYY HH:MM:SS A'`, `'DD MMM YYYY HH:MM:SS'`, `'MMMM YYYY'`).
 * @param locale - BCP 47 locale string for month and weekday names (default `'en-US'`).
 * @returns The formatted date string with all tokens replaced.
 */
export function formatDateByOutputFormat(date: Date, format: T_OutputFormat, locale: string = 'en-US'): string {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ms = date.getMilliseconds()

  const use12h = format.includes(' A')
  const hour24 = hours
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const ampm = hours < 12 ? 'AM' : 'PM'

  const {
    monthShort: monthShortFmt,
    monthLong: monthLongFmt,
    weekdayLong: weekdayLongFmt,
    weekdayShort: weekdayShortFmt,
  } = getIntlFormatters(locale, false)
  const monthShort = monthShortFmt.format(date)
  const monthLong = monthLongFmt.format(date)
  const weekdayLong = weekdayLongFmt.format(date)
  const weekdayShort = weekdayShortFmt.format(date)

  const dayOfYear = getDayOfYear(date, false)
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

export function getDateStr(currentDate: Date, f_Args: T_CoreArgs): string {
  const outputLocale = getOutputLocale(f_Args.localeString)
  if (f_Args.outputFormat) {
    return formatDateByOutputFormat(currentDate, f_Args.outputFormat, outputLocale)
  }
  if (f_Args.localeString?.lang != null || hasFormatOptions(f_Args.localeString)) {
    return currentDate.toLocaleString(f_Args.localeString!.lang, f_Args.localeString!.formatOptions)
  }
  return toAdjustedTimezoneISOString(currentDate)
}
