import { D_Args } from "../../constants/defaults";
import { processEndDate } from "../../helpers/end";
import { T_CoreArgs, T_CoreInitialArgs } from "../../types/commons"

export default function genRecurDateList({
    start = D_Args.start,
    end = D_Args.end,
    interval = D_Args.interval,
    intervalType = D_Args.intervalType,
}: T_CoreInitialArgs) {
    
    const f_Args: T_CoreArgs = {
        start: start ?? D_Args.start,
        interval: interval ?? D_Args.interval,
        intervalType: intervalType ?? D_Args.intervalType,
        end: end ?? D_Args.end       
    }

    const f_End = processEndDate(f_Args)

    // date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 )
    return date
}