import { DEFAULT_ARGS } from "../constants/commons"
import { POSTPONERS } from '../constants/postponers'
import { VALIDATORS } from '../constants/validators'
import { T_ArgsBase, T_CoreArgs, T_CoreInitialArgs } from '../types/lib'
import { isDateObject, setTimeZoneOffset } from "./dates"

export function getEndDate({ 
    start = DEFAULT_ARGS.start, 
    rules = DEFAULT_ARGS.rules,
    direction = DEFAULT_ARGS.direction,
    end = DEFAULT_ARGS.end,
}: T_CoreInitialArgs): Date {

    if(typeof end === 'string') return new Date(end)

    if(isDateObject(end)) return end as Date
    
    const f_End = new Date(start)
    
    rules.forEach(rule => {
        POSTPONERS[direction][rule.unit](f_End, rule.portion * (+end ?? +DEFAULT_ARGS.end))
    })

    return f_End
}

export function processInitialArgs(args: T_CoreInitialArgs): T_CoreArgs {   
    if(!args.rules?.length) args.rules = DEFAULT_ARGS.rules
    const start = new Date(args.start ?? DEFAULT_ARGS.start)
    const end = getEndDate(args ?? DEFAULT_ARGS)

    return {
        start: args.numericTimeZone ? setTimeZoneOffset(start, args.numericTimeZone) : start,
        rules: args.rules,
        direction: args.direction ?? DEFAULT_ARGS.direction,
        end: args.numericTimeZone ? setTimeZoneOffset(end, args.numericTimeZone) : end,
        localeString: args.localeString,
        extend: args.extend,
        filter: args.filter,
        numericTimeZone: args.numericTimeZone
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