import { T_CoreInitialArgs } from "../types/types"
import { pad } from "./commons"

export const setTimezoneOffset = (date: Date, offset: number, resetCurrent: boolean = true) => {
    if(resetCurrent) date.setTime(date.getTime() + (date.getTimezoneOffset() * 60 * 1000))
    date.setTime(date.getTime() + (offset * 60 * 60 * 1000))
    
    return date
}

export const isValidDate = (date: T_CoreInitialArgs['start']) => {
    const processedDate = new Date(date)
    
    if (Object.prototype.toString.call(processedDate) === "[object Date]") {
        return !!processedDate.getTime()
    }

    return false
}

export const toAdjustedTimezoneISOString = (date: Date) => {
    return (
        date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds())
    )
}