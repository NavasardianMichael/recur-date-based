import { T_CoreArgs } from "./commons";

export type T_PostponeArgs = {
    start: Date,
    end: number,
    interval: T_CoreArgs['interval'],
    intervalType: T_CoreArgs['intervalType'],
    count: T_CoreArgs['interval'],
}