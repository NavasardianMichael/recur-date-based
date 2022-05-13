export type T_CoreInitialArgs = {
    start: string,
    end?: number | string
    interval?: number,
    intervalType?: keyof typeof E_IntervalTypes,
}

export type T_CoreArgs = {
    start: Date,
    end: Date,
    interval: number,
    intervalType: keyof typeof E_IntervalTypes,
}

export enum E_IntervalTypes {
    "day" = "day",
    "week" = "week",
    "month" = "month",
    "year" = "year"
}