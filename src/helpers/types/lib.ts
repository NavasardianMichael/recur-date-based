import { INTERVAL_UNITS, DIRECTIONS } from '@/helpers/constants/commons'
import { OUTPUT_FORMATS } from '@/helpers/constants/formats'
import { TODAY } from '@/helpers/constants/shared'
import { ObjectValuesMap } from '@/helpers/types/shared'

export type T_ArgsBase = {
  start: string | Date
  end: number | string | Date
  rules: T_Rules
  numericTimeZone: number
  direction: ObjectValuesMap<typeof DIRECTIONS>
  localeString: T_LocaleString
  outputFormat?: T_OutputFormat
  filter: (args: T_CallbackArgs) => boolean
  extend: Record<string, (args: T_CallbackArgs) => unknown>
  onError: (error: T_Error) => unknown
}

export type T_CoreInitialArgs = Partial<T_ArgsBase>

type T_LocaleString = {
  lang?: Parameters<typeof TODAY.toLocaleString>[0]
  formatOptions?: Intl.DateTimeFormatOptions
}

export type T_CoreReturnType<T = {}> = {
  date: Date
  utcDate: Date
  dateStr: string
} & T

export type T_CallbackArgs = Pick<T_CoreReturnType, 'date' | 'utcDate' | 'dateStr'>

export interface T_Error extends Error {
  message: string
}

export type T_CronString = string

/** Parsed cron: each field is a set of allowed values, or null for "any". */
export type T_ParsedCron = {
  minute: Set<number> | null
  hour: Set<number> | null
  dayOfMonth: Set<number> | null
  month: Set<number> | null
  dayOfWeek: Set<number> | null
}

export type T_CoreArgs = {
  start: Date
  end: Date
  /** When rules is a cron string and end was a number, max occurrences to return. */
  endCount?: number
  rules: T_ArgsBase['rules']
  direction: T_ArgsBase['direction']
  localeString: T_ArgsBase['localeString']
  outputFormat?: T_ArgsBase['outputFormat']
  numericTimeZone: T_ArgsBase['numericTimeZone']
  extend?: T_ArgsBase['extend']
  filter?: T_ArgsBase['filter']
}

export type T_Core = <E extends Record<string, unknown> = {}>(
  args?: Omit<T_CoreInitialArgs, 'extend'> & {
    extend?: { [K in keyof E]: (args: T_CallbackArgs) => E[K] }
  }
) => T_CoreReturnType<E>[]

export type T_IntervalUnit = ObjectValuesMap<typeof INTERVAL_UNITS>
export type T_Direction = ObjectValuesMap<typeof DIRECTIONS>

/** Step-based recurrence (array of unit/portion) or a single cron expression string (5 fields). */
export type T_Rules = T_Rule[] | T_CronString

export type T_Rule = {
  unit: T_IntervalUnit
  portion: number
}

export type T_PostponeArgs = Pick<T_CoreArgs, 'start' | 'rules'>

/**
 * Union type of every supported output format string. Each value is one of the strings in the OUTPUT_FORMATS array (ISO, US/European date-time, month-year, RFC-style, time-only, etc.). Use for the outputFormat option or as the second argument to formatDate.
 *
 * @see OUTPUT_FORMATS
 */
export type T_OutputFormat = (typeof OUTPUT_FORMATS)[number]
