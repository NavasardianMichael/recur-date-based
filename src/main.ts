import { ERRORS } from "./constants"
import { T_Core, T_CoreReturnType, T_PostponeArgs } from "./types"
import { checkInvalidData, POSTPONERS, processInitialArgs } from "./utils"

export const genRecurDateBasedList: T_Core = (args) =>  {
    
    let f_Args = processInitialArgs(args)

    checkInvalidData(f_Args)

    let result: T_CoreReturnType[] = []
    let iterations: number = 0 
    
    while(f_Args.start < f_Args.end) {
        iterations++

        if(iterations === ERRORS.outputLimit.count) {
            throw `${ERRORS.outputLimit.errorText} (${iterations}))`
        }

        let currentResult: T_CoreReturnType = {
            dateStr: f_Args.start.toLocaleString(f_Args.localeString.lang, f_Args.localeString.formatOptions)
        }

        const postpone = (date: T_PostponeArgs['start']) => {
            POSTPONERS[f_Args.intervalType](date, f_Args.interval);
        }

        const callbackArgs = {
            date: f_Args.start,
            dateStr: currentResult.dateStr
        }

        if(f_Args.exclude) {                        
            postpone(f_Args.start)
            if(f_Args.exclude(callbackArgs) === true) {                
                if(typeof f_Args.end === 'number') postpone(f_Args.end)
                continue
            }
        }

        if(f_Args.extended) {
            for(let key in f_Args.extended) {
                currentResult[key] = f_Args.extended[key](callbackArgs)
            }
        }

        result.push(currentResult)
        
        postpone(f_Args.start)
    }

    return result
}