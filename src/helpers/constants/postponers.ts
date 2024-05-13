import { T_CoreArgs, T_IntervalUnit, T_Rule } from '../types/lib';
import { INTERVAL_UNITS } from './commons';

export const POSTPONERS: Record<T_CoreArgs['direction'], Record<T_IntervalUnit, (start: T_CoreArgs['start'], interval: T_Rule['portion']) => void>> = {
    backward: {
        [INTERVAL_UNITS.millisecond]: (date, interval) => date.setTime(date.getTime() - interval),
        [INTERVAL_UNITS.minute]: (date, interval) => date.setMinutes(date.getMinutes() - interval),
        [INTERVAL_UNITS.hour]: (date, interval) => date.setHours(date.getHours() - interval),
        [INTERVAL_UNITS.day]: (date, interval) => date.setDate(date.getDate() - interval),
        [INTERVAL_UNITS.week]: (date, interval) => date.setDate(date.getDate() - interval * 7),
        [INTERVAL_UNITS.month]: (date, interval) => date.setMonth(date.getMonth() - interval),
        [INTERVAL_UNITS.year]: (date, interval) => date.setFullYear(date.getFullYear() - interval),
    },
    forward: {
        [INTERVAL_UNITS.millisecond]: (date, interval) => date.setTime(date.getTime() + interval),
        [INTERVAL_UNITS.minute]: (date, interval) => date.setMinutes(date.getMinutes() + interval),
        [INTERVAL_UNITS.hour]: (date, interval) => date.setHours(date.getHours() + interval),
        [INTERVAL_UNITS.day]: (date, interval) => date.setDate(date.getDate() + interval),
        [INTERVAL_UNITS.week]: (date, interval) => date.setDate(date.getDate() + interval * 7),
        [INTERVAL_UNITS.month]: (date, interval) => date.setMonth(date.getMonth() + interval),
        [INTERVAL_UNITS.year]: (date, interval) => date.setFullYear(date.getFullYear() + interval),
    }
}