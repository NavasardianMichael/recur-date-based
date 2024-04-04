import { INTERVAL_UNITS, DIRECTIONS } from '../constants/commons'
import { TODAY } from '../constants/shared'
import { ObjectValuesMap } from './shared'

export type T_ArgsBase = {
    start: string | Date
    end: number | string | Date
    rules: T_Rules
    numericTimeZone: number 
    direction: ObjectValuesMap<typeof DIRECTIONS>
    localeString: T_LocaleString
    filter: (args: T_CallbackArgs) => boolean
    extend: Record<string, (args: T_CallbackArgs) => unknown>
    onError: (error: T_Error) => unknown
}

export type T_CoreInitialArgs = Partial<T_ArgsBase>

type T_LocaleString = {
    lang?: Parameters<typeof TODAY.toLocaleString>[0]
    formatOptions?: Intl.DateTimeFormatOptions
}

export type T_CoreReturnType = {
    date: Date
    utcDate: Date
    dateStr: string
    [key: string]: unknown
}

export type T_CallbackArgs = Pick<T_CoreReturnType, 'date' | 'utcDate' | 'dateStr'>

export interface T_Error extends Error {
    message: string
}

export type T_CoreArgs = {
    start: Date
    end: Date
    rules: T_ArgsBase['rules']
    direction: T_ArgsBase['direction']
    localeString: T_ArgsBase['localeString']
    numericTimeZone: T_ArgsBase['numericTimeZone']
    extend?: T_ArgsBase['extend']
    filter?: T_ArgsBase['filter']
}

export type T_Core = (args: T_CoreInitialArgs) => T_CoreReturnType[]

export type T_IntervalUnit = ObjectValuesMap<typeof INTERVAL_UNITS>
export type T_Direction = ObjectValuesMap<typeof DIRECTIONS>

export type T_Rules = T_Rule[]

export type T_Rule = {
    unit: T_IntervalUnit
    portion: number
}

export type T_PostponeArgs = Pick<T_CoreArgs, 'start' | 'rules'>