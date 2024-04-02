import { DEFAULT_ARGS, POSTPONERS, VALIDATORS } from "../constants/constants"
import { T_ArgsBase, T_CoreArgs, T_CoreInitialArgs } from "../types/types"
import { setTimezoneOffset } from "./dates"

export function getEndDate({ 
    start = DEFAULT_ARGS.start, 
    rules = DEFAULT_ARGS.rules,
    direction = DEFAULT_ARGS.direction,
    end = DEFAULT_ARGS.end,
}: T_CoreInitialArgs): Date {
console.log({end, rules});

    if(typeof end === 'string') return new Date(end)
    
    const f_End = new Date(start)
    rules.forEach(rule => {
        POSTPONERS[direction][rule.unit](f_End, rule.portion * (+end ?? +DEFAULT_ARGS.end))
    })

    return f_End
}

export function processInitialArgs(args: T_CoreInitialArgs): T_CoreArgs {   
    if(!args.rules?.length) args.rules = DEFAULT_ARGS.rules

    return {
        start: setTimezoneOffset(new Date(args.start ?? DEFAULT_ARGS.start), args.numericTimezone),
        rules: args.rules,
        direction: args.direction ?? DEFAULT_ARGS.direction,
        end: setTimezoneOffset(getEndDate(args ?? DEFAULT_ARGS), args.numericTimezone),
        localeString: args.localeString,
        extend: args.extend,
        exclude: args.exclude,
        numericTimezone: args.numericTimezone
    }
}

export function checkInvalidData(args: T_CoreInitialArgs): void {
    Object.values(VALIDATORS).forEach(checker => {
        const errorMessage = checker(args)
        if(errorMessage) throw new Error(errorMessage)
    })
}

export const generateErrorPreText = (key: keyof T_ArgsBase, value: unknown) => {
    return `Invalid property "${key}" (received ${value || (value === '' ? "empty string" : value)})`
}