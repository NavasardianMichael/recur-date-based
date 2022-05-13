import { E_IntervalTypes } from "../types/commons";
import { T_PostponeArgs } from "../types/postpone";
import { cloneDate } from "./commons";

export function postpone({ start, interval, intervalType }: T_PostponeArgs) {
    const clone = cloneDate(start)

    switch (intervalType) {
        case E_IntervalTypes.day:
            clone.setDate(clone.getDate() + interval);
            break;
        case E_IntervalTypes.week:
            clone.setDate(clone.getDate() + interval * 7);
            break;
        case E_IntervalTypes.month:
            clone.setMonth(clone.getMonth() + interval);
            break;
        case E_IntervalTypes.year:
            clone.setFullYear(clone.getFullYear() + interval);
            break;
        default:
            break;
    }

    return clone
}

