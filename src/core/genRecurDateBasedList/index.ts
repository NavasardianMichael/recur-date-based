import { D_Args } from "../../constants/defaults";
import { ERRORS, VALIDATORS } from "../../constants/errors";
import { getEndDate, POSTPONERS } from "../../helpers/postpone";
import { T_CoreArgs, T_CoreInitialArgs, T_CoreReturnType } from "../../types/commons"

type T_Core = (args: T_CoreInitialArgs) => T_CoreReturnType[]

export const genRecurDateBasedList: T_Core = (args) =>  {
    
    checkInvalidData(args)

    const f_Args = processInitialArgs(args)

    let result: T_CoreReturnType[] = []
    
    while(f_Args.start < f_Args.end) {
        if(result.length === ERRORS.outputLimit.count) {
            throw ERRORS.outputLimit.errorText
        }

        const dateStr = f_Args.start.toLocaleString(f_Args.localeString.lang, f_Args.localeString.formatOptions)
        let currentResult: T_CoreReturnType = {
            date: f_Args.start,
            dateStr
        }

        if(f_Args.extended) {
            for(let key in f_Args.extended) {
                currentResult[key] = f_Args.extended[key]({
                    date: f_Args.start,
                    dateStr
                })
            }
        }

        result.push(currentResult)
        POSTPONERS[f_Args.intervalType](f_Args.start, f_Args.interval)
    }

    return result
}

export function processInitialArgs(args: T_CoreInitialArgs): T_CoreArgs {
    return {
        start: new Date(args.start ?? D_Args.start),
        interval: args.interval ?? D_Args.interval,
        intervalType: args.intervalType ?? D_Args.intervalType,
        end: getEndDate(args),
        localeString: args.localeString ?? D_Args.localeString,
        extended: args.extended
    }
}

export function checkInvalidData(args: T_CoreInitialArgs): void {
    Object.values(VALIDATORS).forEach(err => {
        if(err.check(args)) throw(err.errorText)
    })
}