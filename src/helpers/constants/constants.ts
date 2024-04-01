import { isNullish } from "../functions/commons";
import { isValidDate } from "../functions/dates";
import { generateErrorPreText } from "../functions/lib";
import { E_Direction, E_IntervalTypes, T_ArgsBase, T_CoreArgs, T_CoreInitialArgs, T_Rule } from "../types/types"

export const ERRORS = {
    outputLimit: {
        count: 99_999,
        errorText: 'Too many iterations! It has exceeded 99_999.'
    }
}

export const DEFAULT_ARGS: Omit<T_CoreInitialArgs, 'numericTimezone' | 'exclude' | 'onError' | 'localeString'> = {
    start: new Date(),
    end: 10,
    rules: [{
        portion: 1,
        unit: E_IntervalTypes.day
    }],
    direction: E_Direction.forward,
}

export const POSTPONERS: {
    [key in T_CoreArgs['direction']]: {
        [key in E_IntervalTypes]: (start: T_CoreArgs['start'], interval: T_Rule['portion']) => void
    }
} = {
    backward: {
        [E_IntervalTypes.millisecond]: (date, interval) => date.setTime(date.getTime() - interval),
        [E_IntervalTypes.minute]: (date, interval) => date.setMinutes(date.getMinutes() - interval),
        [E_IntervalTypes.hour]: (date, interval) => date.setHours(date.getHours() - interval),
        [E_IntervalTypes.day]: (date, interval) => date.setDate(date.getDate() - interval),
        [E_IntervalTypes.week]: (date, interval) => date.setDate(date.getDate() - interval * 7),
        [E_IntervalTypes.month]: (date, interval) => date.setMonth(date.getMonth() - interval),
        [E_IntervalTypes.year]: (date, interval) => date.setFullYear(date.getFullYear() - interval),
    },
    forward: {
        [E_IntervalTypes.millisecond]: (date, interval) => date.setTime(date.getTime() + interval),
        [E_IntervalTypes.minute]: (date, interval) => date.setMinutes(date.getMinutes() + interval),
        [E_IntervalTypes.hour]: (date, interval) => date.setHours(date.getHours() + interval),
        [E_IntervalTypes.day]: (date, interval) => date.setDate(date.getDate() + interval),
        [E_IntervalTypes.week]: (date, interval) => date.setDate(date.getDate() + interval * 7),
        [E_IntervalTypes.month]: (date, interval) => date.setMonth(date.getMonth() + interval),
        [E_IntervalTypes.year]: (date, interval) => date.setFullYear(date.getFullYear() + interval),
    }
}

export const VALIDATORS: {
    [key in keyof T_ArgsBase]: (args: T_CoreInitialArgs) => string
} = {
    start: ({ start }) => {
        if(isNullish(start)) return '';

        if(typeof start === 'number' || (typeof start !== 'string' && !isValidDate(start))) {
            return (
                `${generateErrorPreText('start', start)}. The provided value must be either a string, which can be formatted into a valid date, or a Date object.`
            )
        }

        return ''
    },
    rules: ({ rules, direction }) => {
        if(isNullish(rules)) return '';

        for(const { unit, portion } of rules) {
            if(
                (typeof portion !== 'number') || 
                isNaN(portion) || 
                !Number.isInteger(portion)
            ) {
                return (
                    `${generateErrorPreText('rules', portion)}. The provided value for "${unit}" must be a number.`
                )
            }

            if(portion <= 0) {
                console.log({direction});
                
                return (
                    direction === E_Direction.forward ?
                    `${generateErrorPreText('rules', portion)}. The provided value for "${unit}" (and for all the portions as well) must be a positive number. Use only positive portions. Instead, you can set direction property to "backward" in "genRecurDateBasedList" configs.` :
                    `${generateErrorPreText('rules', portion)}. The provided value for "${unit}" (and for all the portions as well) must be a positive number. Use only positive portions. The property "direction" is already set to "backward" in "genRecurDateBasedList" configs.`
                )
            }
    
            if(isNullish(unit)) return '';

            if(!Object.keys(E_IntervalTypes).includes(unit)) {
                return (
                    `${generateErrorPreText('rules', unit)}. The provided "unit" must be one of the types from the following list: ${Object.keys(E_IntervalTypes).join(', ')}.`
                )
            }
        }

        return ''
    },
    end: ({ end }) => {
        if(isNullish(end)) return '';

        const message = (
            `${generateErrorPreText('end', end)}. The provided value number must be either a string, which can be formatted into a valid date, or a number less than 100_000.`
        )
        
        if(
            (typeof end !== 'string' && typeof end !== 'number' && !isValidDate(end)) ||
            (typeof end === 'string' && !isValidDate(end)) ||
            (typeof end === 'number' && (end > 99_999 || isNaN(end)))
        ) return message

        return ''
    },
    direction: ({ direction }) => {
        if(isNullish(direction)) return '';

        if(!Object.keys(E_Direction).includes(direction)) {
            return (
                `${generateErrorPreText('direction', direction)}. The provided value must be one of the members from the following list: ${JSON.stringify(Object.keys(E_Direction))}.`
            )
        }

        return ''
    },
    numericTimezone: ({ numericTimezone }) => {
        if(isNullish(numericTimezone)) return '';

        if(
            (typeof numericTimezone !== 'number') || 
            isNaN(numericTimezone) || 
            !Number.isInteger(numericTimezone) || 
            numericTimezone < -12 || 
            numericTimezone > 12
        ) {
            return (
                `${generateErrorPreText('numericTimezone', numericTimezone)}. The provided value timezone must be an integer defined in a specific range (from -12 to 12).`
            )
        }

        return ''
    },
    localeString: ({ localeString }) => {
        if(isNullish(localeString)) return '';

        if(typeof localeString !== 'object') {
            return `The provided property "localeString" must be an object.`
        }

        return ''
    },
    exclude: ({ exclude }) => {
        if(isNullish(exclude)) return '';

        if(typeof exclude !== 'function') {
            return `The provided property "exclude" must be a function, which returns a boolean value.`
        }

        return ''
    },
    extend: ({ extend }) => {
        if(isNullish(extend)) return '';

        if(typeof extend !== 'object') {
            return `The provided property "extend" must be an object.`
        }

        return ''
    },
    onError: ({ onError }) => {
        if(isNullish(onError)) return '';

        if(typeof onError !== 'function') {
            return `The provided property onError must be a function.`
        }

        return ''
    }
}