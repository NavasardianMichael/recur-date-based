import { E_IntervalTypes, T_CoreArgs } from "../types/commons";
import { T_PostponeArgs } from "../types/end";

export function postpone(args: T_PostponeArgs) {
    return DATE_SETTERS[args.intervalType](args)
}

// export function getDateSetter(args: T_PostponeArgs) {
//     const { start, type } = args
//     const setters = {
//         day: (args) => date.getDate() + args.
//     }
// }

export const DATE_SETTERS: { [key in E_IntervalTypes]: (args: T_PostponeArgs) => Date } = {
    day: (args: T_PostponeArgs) => {
        args.start.setDate(args.start.getDate() + args.interval * args.end)
        return args.start
    },
    week: (args: T_PostponeArgs) => {
        args.start.setDate(args.start.getDate() + args.interval * args.end * 7)
        return args.start
    },
    month: (args: T_PostponeArgs) => {
        args.start.setMonth(args.start.getMonth() + args.interval * args.end)
        return args.start
    },
    year: (args: T_PostponeArgs) => {
        args.start.setFullYear(args.start.getFullYear() + args.interval * args.end)
        return args.start
    },
}

export function processEndDate(args: T_CoreArgs): Date {
    if(typeof args.end === 'string') return new Date(args.end)
    const dateSetter = getDateSetter(args.intervalType)
    return postpone({
        start: new Date(args.start),
        type: args.type,
        count: args.type,
    })
}