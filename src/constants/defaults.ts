import { E_IntervalTypes, T_CoreInitialArgs } from "../types/commons";

export const D_Args: T_CoreInitialArgs = {
    start: new Date().toDateString(),
    end: 100,
    interval: 10,
    intervalType: E_IntervalTypes.month,
    localeString: {
        lang: 'en',
        formatOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    }
}