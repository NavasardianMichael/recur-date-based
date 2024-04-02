import { E_IntervalTypes, T_CoreArgs, T_Rule } from '../types/types';

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