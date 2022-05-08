import { T_Args } from "../../types/commons"

export default function genRecurDateList({
    date,
    interval = 1,
    intervalType = "Day" 
}: T_Args) {

    console.log({interval, intervalType});
    
    
    // date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 )
    return date
}