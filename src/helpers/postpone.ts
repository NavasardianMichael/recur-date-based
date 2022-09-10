import { D_Args } from "../constants/defaults";
import { ERRORS } from "../constants/errors";
import { E_IntervalTypes, T_CoreArgs, T_CoreInitialArgs } from "../types/commons";

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