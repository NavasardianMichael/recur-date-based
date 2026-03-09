import { T_CoreArgs } from '../types/lib'

export function getOutputLocale(localeString: T_CoreArgs['localeString']): string {
  if (localeString?.lang == null) return 'en-US'
  if (typeof localeString.lang === 'string') return localeString.lang
  if (Array.isArray(localeString.lang)) return String(localeString.lang[0] ?? 'en-US')
  return String(localeString.lang)
}
