import { E_IntervalTypes, T_CoreArgs, T_CoreInitialArgs } from "./types"

export const VALIDATORS = {
    positiveInterval: {
        check: ({ interval }: T_CoreArgs) => !Number.isInteger(interval) || interval <= 0,
        errorText: 'The provided interval must be positive integer',
    }
}

export const ERRORS = {
    outputLimit: {
        count: 10000,
        errorText: 'Too many iterations! It has exceeded 99999'
    }
}

export const D_Args: T_CoreInitialArgs = {
    start: new Date().toDateString(),
    end: 100,
    interval: 1,
    intervalType: E_IntervalTypes.day,
    localeString: {
        lang: 'en-US'
    },
}