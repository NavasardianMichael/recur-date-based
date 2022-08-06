import { T_CoreInitialArgs } from "../types/commons";

export const VALIDATORS = {
    positiveInterval: {
        check: ({ interval }: T_CoreInitialArgs) => !Number.isInteger(interval) || interval <= 0,
        errorText: 'The provided interval must be positive integer',
    }
}

export const ERRORS = {
    outputLimit: {
        count: 10000,
        errorText: 'Too many iterations!'
    }
}