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

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000
  return Math.floor(diff / (24 * 60 * 60 * 1000))
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
 * Supports YYYY/MM/DD and yyyy/mm/dd conventions; mm in date = month, in time = minutes.
 * Z or " Z" = timezone offset. Uses 'en-US' for month names (MMM, MMMM) when locale is not provided.
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

  const intlOpts = useUtc ? { timeZone: 'UTC' as const } : {}
  const monthShort = new Intl.DateTimeFormat(locale, { month: 'short', ...intlOpts }).format(date)
  const monthLong = new Intl.DateTimeFormat(locale, { month: 'long', ...intlOpts }).format(date)
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long', ...intlOpts }).format(date)
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'short', ...intlOpts }).format(date)

  const dayOfYear = getDayOfYear(date)
  const tzStr = getTimezoneOffsetString(date)
  const monthPadded = pad(month + 1)
  const dayPadded = pad(day)

  // 1. Weekday and month names (longest first)
  let out = format
    .replace(/dddd/g, weekdayLong)
    .replace(/ddd/g, weekdayShort)
    .replace(/MMMM/g, monthLong)
    .replace(/MMM/g, monthShort)

  // 2. Year
  out = out
    .replace(/YYYY/g, String(year))
    .replace(/yyyy/g, String(year))
    .replace(/YY/g, String(year).slice(-2))
    .replace(/yy/g, String(year).slice(-2))

  // 3. Day of year
  out = out.replace(/DDD/g, pad3(dayOfYear)).replace(/ddd/g, pad3(dayOfYear))

  // 4. Minutes in time context (before replacing month mm): :mm: or :mm. or :mm at end
  out = out.replace(/:mm(?=:|\.|$)/g, `:${pad(minutes)}`)

  // 5. Hour (hh only in time context: hh:mm or hh:mm:ss etc.), seconds, ms, AM/PM
  const hourStr = use12h ? pad(hour12) : pad(hour24)
  out = out
    .replace(/HH/g, pad(hour24))
    .replace(/hh(?=:)/g, hourStr)
    .replace(/ss/g, pad(seconds))
    .replace(/SSS/g, pad3(ms))
    .replace(/ A$/g, ` ${ampm}`)
    .replace(/ A /g, ` ${ampm} `)
    .replace(/^A /g, `${ampm} `)
    .replace(/ A/g, ` ${ampm}`)

  // 6. Month 2-digit: MM and mm in date context (-mm-, /mm/, .mm., leading mm/)
  out = out.replace(/MM/g, monthPadded)
  out = out.replace(/-mm-/g, `-${monthPadded}-`).replace(/\/mm\//g, `/${monthPadded}/`).replace(/\.mm\./g, `.${monthPadded}.`)
  out = out.replace(/^mm\//g, `${monthPadded}/`).replace(/^mm-/g, `${monthPadded}-`)
  out = out.replace(/\/mm$/g, `/${monthPadded}`).replace(/-mm$/g, `-${monthPadded}`)
  out = out.replace(/\bmm\b/g, monthPadded)

  // 7. Day 2-digit
  out = out.replace(/DD/g, dayPadded).replace(/\bdd\b/g, dayPadded)
  out = out.replace(/-dd-/g, `-${dayPadded}-`).replace(/\/dd\//g, `/${dayPadded}/`).replace(/\.dd\./g, `.${dayPadded}.`)
  out = out.replace(/^dd\//g, `${dayPadded}/`).replace(/^dd-/g, `${dayPadded}-`)
  out = out.replace(/\/dd$/g, `/${dayPadded}`).replace(/-dd$/g, `-${dayPadded}`)

  // 8. Single M / D (unpadded month/day) - only when not part of MM/DD
  out = out.replace(/(?<![DM])D(?!D)/g, String(day)).replace(/(?<![DM])M(?!M)/g, String(month + 1))

  // 9. Timezone Z
  out = out.replace(/ Z$/g, ` ${tzStr}`).replace(/Z$/g, tzStr)

  return out
}
