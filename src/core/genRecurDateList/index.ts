import { D_Args } from "../../constants/defaults";
import { T_Args } from "../../types/commons"

export default function genRecurDateList({
    date = D_Args.date,
    interval = D_Args.interval,
    intervalType = D_Args.intervalType,
}: T_Args) {

    console.log({interval, intervalType});
    
    
    // date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 )
    return date
}