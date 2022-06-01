import { D_Args } from "../../constants/defaults";
import { ERRORS } from "../../constants/errors";
import { getEndDate, POSTPONERS } from "../../helpers/postpone";
import { T_CoreArgs, T_CoreInitialArgs } from "../../types/commons"

export default function genRecurDateList(args: T_CoreInitialArgs) {
    
    checkAndBreakForInvalidData(args)

    const f_Args = processInitialArgs(args)

    let result: string[] = []
    var options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
   
    while(f_Args.start < f_Args.end) {
        result.push(f_Args.start.toLocaleDateString(f_Args.locale, options))
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
        formatOptions: args.formatOptions ?? D_Args.formatOptions,
        locale: args.locale ?? D_Args.locale
    }
}

export function checkAndBreakForInvalidData(args: T_CoreInitialArgs): void {
    Object.values(ERRORS).forEach(err => {
        if(err.check(args)) throw(err.text)
        
    })
}