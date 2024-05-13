import { DEFAULT_ARGS, DIRECTIONS, ERRORS } from "./helpers/constants/commons"
import { POSTPONERS } from './helpers/constants/postponers'
import { cloneDate } from './helpers/functions/shared'
import { setTimeZoneOffset, toAdjustedTimezoneISOString } from "./helpers/functions/dates"
import { checkInvalidData, processInitialArgs } from "./helpers/functions/lib"
import { T_Core, T_CoreReturnType, T_Error, T_PostponeArgs } from './helpers/types/lib'
import { TODAY } from './helpers/constants/shared'

export const genRecurDateBasedList: T_Core = (args = DEFAULT_ARGS) =>  {
    
    const result: T_CoreReturnType[] = []
    
    try {
        checkInvalidData(args)
        
        const f_Args = processInitialArgs(args)
        
        const isDirectionForward = f_Args.direction === DIRECTIONS.forward
        let iterations: number = 0 

        const postpone = (date: T_PostponeArgs['start']) => {
            f_Args.rules.forEach(rule => {
                const postponeByDirection = POSTPONERS[f_Args.direction]
                postponeByDirection[rule.unit](date, rule.portion);
            })
        }

        while(
            isDirectionForward ?
            f_Args.start < f_Args.end :
            f_Args.start > f_Args.end
        ) {
            iterations++
            
            if(iterations === ERRORS.outputLimit.count) {
                throw new Error(ERRORS.outputLimit.errorText)
            }

            const dateStr = (
                f_Args.localeString ?
                f_Args.start.toLocaleString(f_Args.localeString.lang, f_Args.localeString.formatOptions) :
                toAdjustedTimezoneISOString(f_Args.start)
            )
            
            const currentStartDate = cloneDate(f_Args.start)

            const currentResult: T_CoreReturnType = {
                dateStr,
                date: (
                    setTimeZoneOffset(
                        (
                            f_Args.localeString?.formatOptions?.timeZone ?
                            new Date(Date.parse(dateStr)) :
                            currentStartDate
                        ), 
                        TODAY.getTimezoneOffset() / -60,
                        false
                    )
                ),
                utcDate: (
                    f_Args.localeString?.formatOptions?.timeZone ? 
                    cloneDate(currentStartDate) : 
                    setTimeZoneOffset(cloneDate(currentStartDate), -f_Args?.numericTimeZone, false)
                )
            }

            const callbackArgs: T_CoreReturnType = {
                ...currentResult,
                date: cloneDate(currentResult.date),
                utcDate: cloneDate(currentResult.utcDate),
            }

            if(
                f_Args.filter &&
                f_Args.filter(callbackArgs) === false
            ) {
                postpone(f_Args.start)
                if(typeof f_Args.end === 'number') postpone(f_Args.end)
                iterations++
            
                continue
            }

            if(f_Args.extend) {
                for(const key in f_Args.extend) {
                    currentResult[key] = f_Args.extend[key](callbackArgs)
                }
            }

            result.push(currentResult)
            
            postpone(f_Args.start)
        }
    } catch (e) {
        const error = e as T_Error
        
        if(args.onError && typeof args.onError === 'function') {
            args.onError(error);
        } else {
            throw new Error(error.message)
        }
    }

    return result
}