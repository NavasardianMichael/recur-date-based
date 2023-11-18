export type T_ArgsBase = {
    start: string | Date
    end: number | string | Date
    rules: T_Rules
    numericTimezone: number 
    direction: keyof typeof E_Direction
    localeString: {
        lang: string
        formatOptions: Intl.DateTimeFormatOptions
    }
    exclude: (args: Pick<T_CoreReturnType, 'date' | 'dateStr'>) => boolean
    extend: {
        [key: string]: (args: Pick<T_CallbackArgs, 'date' | 'dateStr'>) => unknown
    }
    onError: (error: T_Error) => unknown
}

export type T_CoreInitialArgs = Partial<T_ArgsBase>

export type T_CallbackArgs = {
    date: Date;
    dateStr: T_ArgsBase['start'];
}

export type T_Error = {
    message: string
}

export type T_CoreArgs = {
    start: Date
    end: Date
    rules: T_ArgsBase['rules']
    direction: T_ArgsBase['direction']
    localeString: T_ArgsBase['localeString']
    extend?: T_ArgsBase['extend']
    exclude?: T_ArgsBase['exclude']
}

export type T_CoreReturnType = {
    dateStr: string
    [key: string]: unknown
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
    type: E_IntervalTypes
    portion: number
}

export enum E_Direction {
    backward = 'backward', 
    forward = 'forward'
}

export type T_PostponeArgs = Pick<T_CoreArgs, 'start' | 'rules'>

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};