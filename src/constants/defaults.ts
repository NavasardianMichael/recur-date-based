import { T_CoreInitialArgs } from "../types/commons";

export const D_Args: T_CoreInitialArgs = {
    start: new Date().toDateString(),
    end: 100,
    interval: 10,
    intervalType: "month",
    formatOptions: {},
    locale: 'en',
    exclude: ['2011-11-14']
}