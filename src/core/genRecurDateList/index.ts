import { D_Args } from "../../constants/defaults";
import { postpone } from "../../helpers/postpone";
import { T_CoreArgs, T_CoreInitialArgs } from "../../types/commons"

export default function genRecurDateList(args: T_CoreInitialArgs) {
    
    checkAndBreakForInvalidData(args)

    const f_Args = processInitialArgs(args)

    let result = [f_Args.start.toDateString()]

    postpone(f_Args)

    return f_Args
}

export function processInitialArgs(args: T_CoreInitialArgs): T_CoreArgs {
    
    const start = new Date(args.start ?? D_Args.start)
    const interval: T_CoreArgs['interval'] = args.interval ?? D_Args.interval
    const intervalType = args.intervalType ?? D_Args.intervalType

    const processed: Omit<T_CoreArgs, 'end'> = {
        start,
        interval,
        intervalType,
    }

    return {
        ...processed,
        end: postpone(processed)
    }
}

export function checkAndBreakForInvalidData(args: T_CoreInitialArgs): void {
    args
}