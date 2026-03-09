import { CRON_FIELD_RANGES } from '../constants/cron'
import type { T_IntervalUnit } from './lib'

/** Cron step: interval units used for advancing (minus millisecond/month) or dayOfMonth (same day each month). */
export type T_CronStepType = Exclude<T_IntervalUnit, 'millisecond' | 'month'> | 'dayOfMonth'

export type T_CronFieldName = keyof typeof CRON_FIELD_RANGES
