import { T_CoreInitialArgs } from "../types/commons";

export const ERRORS = {
    positiveInterval: {
        text: 'The provided interval must be positive integer',
        check: ({ interval }: T_CoreInitialArgs) => !Number.isInteger(interval) || interval <= 0
    }
}