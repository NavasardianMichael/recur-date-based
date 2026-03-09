export const CRON_FIELD_RANGES = {
  minute: [0, 59],
  hour: [0, 23],
  dayOfMonth: [1, 31],
  month: [1, 12],
  dayOfWeek: [0, 6], // 0 = Sunday
} as const

export const CRON_FIELD_NAMES = Object.keys(CRON_FIELD_RANGES) as (keyof typeof CRON_FIELD_RANGES)[]

export const CRON_FAR_BOUND_MS = 100 * 365 * 24 * 60 * 60 * 1000

export const MAX_ITERATIONS_FIRST_MATCH_MINUTES = 8 * 24 * 60
export const MAX_ITERATIONS_DAY_STEP = 32
