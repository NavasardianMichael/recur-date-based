export type T_CoreInitialArgs = {
    start: string,
    interval?: number,
    intervalType?: keyof typeof E_IntervalTypes,
    end?: number | string
}

export type T_CoreArgs = {
    start: string,
    interval: number,
    intervalType: keyof typeof E_IntervalTypes,
    end: string
}

export enum E_IntervalTypes {
    "day" = "day",
    "week" = "week",
    "month" = "month",
    "year" = "year"
}