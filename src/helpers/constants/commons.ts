import { E_Direction, E_IntervalTypes, T_CoreInitialArgs } from "../types/types";

export const ERRORS = {
    outputLimit: {
        count: 99_999,
        errorText: 'Too many iterations! It has exceeded 99_999.'
    }
}

export const DEFAULT_ARGS: Omit<T_CoreInitialArgs, 'numericTimeZone' | 'filter' | 'onError' | 'localeString'> = {
    start: new Date(),
    end: 10,
    rules: [{
        portion: 1,
        unit: E_IntervalTypes.day
    }],
    direction: E_Direction.forward,
}

export const TODAY = new Date()