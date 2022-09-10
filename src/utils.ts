import { D_Args, ERRORS, VALIDATORS } from "./constants"
import { E_IntervalTypes, T_CoreArgs, T_CoreInitialArgs } from "./types"

export function cloneDate(date: Date): Date {
    return new Date(date.getTime())
}

export function getEndDate({ 
    start = D_Args.start, 
    interval = D_Args.interval, 
    intervalType = D_Args.intervalType, 
    end = D_Args.end 
}: T_CoreInitialArgs): Date {
    
    if(typeof end === 'string') return new Date(end)
    
    let f_End = new Date(start)
    POSTPONERS[intervalType](f_End, interval * Math.min(+end ?? +D_Args.end, ERRORS.outputLimit.count - 1))

    return f_End
}

export const POSTPONERS: {
    [key in E_IntervalTypes]: (date: T_CoreArgs['start'], interval: T_CoreArgs['interval']) => void
} = {
    [E_IntervalTypes.day]: (date, interval) => date.setDate(date.getDate() + interval),
    [E_IntervalTypes.week]: (date, interval) => date.setDate(date.getDate() + interval * 7),
    [E_IntervalTypes.month]: (date, interval) => date.setMonth(date.getMonth() + interval),
    [E_IntervalTypes.year]: (date, interval) => date.setFullYear(date.getFullYear() + interval),
}

export function processInitialArgs(args: T_CoreInitialArgs): T_CoreArgs {
    return {
        start: new Date(args?.start ?? D_Args.start),
        interval: args?.interval ?? D_Args.interval,
        intervalType: args?.intervalType ?? D_Args.intervalType,
        end: getEndDate(args ?? D_Args),
        localeString: args?.localeString ?? D_Args.localeString,
        extended: args?.extended,
        exclude: args?.exclude
    }
}

export function checkInvalidData(args: T_CoreArgs): void {
    Object.values(VALIDATORS).forEach(err => {
        if(err.check(args)) throw(err.errorText)
    })
}