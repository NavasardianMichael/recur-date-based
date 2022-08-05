export type T_CoreInitialArgs = {
    start: string,
    end: number | string
    interval?: number,
    intervalType?: keyof typeof E_IntervalTypes,
    localeString?: {
        lang?: string
        formatOptions?: Intl.DateTimeFormatOptions
    }
    extended?: {
        [key: string]: (args: Pick<T_CoreReturnType, 'date' | 'dateStr'>) => any
    }
}

export type T_CoreArgs = {
    start: Date,
    end: Date,
    interval: T_CoreInitialArgs['interval'],
    intervalType: T_CoreInitialArgs['intervalType'],
    localeString: T_CoreInitialArgs['localeString']
    extended?: T_CoreInitialArgs['extended']
}

export type T_CoreReturnType = {
    date: Date
    dateStr: string
    [key: string]: any
}

export type T_Core = (args: T_CoreInitialArgs) => T_CoreReturnType[]

export enum E_IntervalTypes {
    "day" = "day",
    "week" = "week",
    "month" = "month",
    "year" = "year"
}