import { TODAY } from '../constants/commons'

export type T_ArgsBase = {
    start: string | Date
    end: number | string | Date
    rules: T_Rules
    numericTimeZone: number 
    direction: keyof typeof E_Direction
    localeString: T_LocaleString
    exclude: (args: T_CallbackArgs) => boolean
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
    exclude?: T_ArgsBase['exclude']
}

export type T_Core = (args: T_CoreInitialArgs) => T_CoreReturnType[]

export enum E_IntervalTypes {
    millisecond = 'millisecond',
    minute = 'minute',
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month',
    year = 'year'
}

export type T_Rules = T_Rule[]

export type T_Rule = {
    unit: E_IntervalTypes
    portion: number
}

export enum E_Direction {
    backward = 'backward', 
    forward = 'forward'
}

export type T_PostponeArgs = Pick<T_CoreArgs, 'start' | 'rules'>