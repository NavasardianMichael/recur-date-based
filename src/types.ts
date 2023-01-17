export type T_CoreInitialArgs = {
    start?: string,
    end?: number | string
    interval?: number
    intervalType?: keyof typeof E_IntervalTypes
    localeString?: {
        lang?: string
        formatOptions?: Intl.DateTimeFormatOptions
    },
    exclude?: (args: Pick<T_CoreReturnType, 'date' | 'dateStr'>) => boolean,
    extend?: {
        [key: string]: (args: Pick<T_CoreReturnType, 'date' | 'dateStr'>) => any
    }
}

export type T_CoreArgs = {
    start: Date,
    end: Date,
    interval: T_CoreInitialArgs['interval']
    intervalType: T_CoreInitialArgs['intervalType']
    localeString: T_CoreInitialArgs['localeString']
    extend?: T_CoreInitialArgs['extend']
    exclude?: T_CoreInitialArgs['exclude']
}

export type T_CoreReturnType = {
    dateStr?: string
    date?: Date
    [key: string]: any
}

export type T_Core = (args: T_CoreInitialArgs) => T_CoreReturnType[]

export enum E_IntervalTypes {
    "minute" = "minute",
    "hour" = "hour",
    "day" = "day",
    "week" = "week",
    "month" = "month",
    "year" = "year"
}

export type T_PostponeArgs = Pick<T_CoreArgs, 'start' | 'interval' | 'intervalType'>