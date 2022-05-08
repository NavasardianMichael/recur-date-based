export type T_Args = {
    date: string,
    interval?: number,
    intervalType?: keyof typeof E_IntervalTypes,
}

enum E_IntervalTypes {
    "Day",
    "Week",
    "Month",
    "Year"
}