import { E_IntervalTypes, T_CoreInitialArgs } from "../types/commons";

export const D_Args: T_CoreInitialArgs = {
    start: new Date().toDateString(),
    end: 5,
    interval: 10,
    intervalType: E_IntervalTypes.day,
    localeString: {
        lang: 'en-US'
    },
}