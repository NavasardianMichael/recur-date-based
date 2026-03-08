import { T_ArgsBase } from '../types/lib'

export const ERRORS = {
  outputLimit: {
    count: 99_999,
    errorText: 'Too many iterations! It has exceeded 99_999.',
  },
}

export const INTERVAL_UNITS = {
  millisecond: 'millisecond',
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
} as const

export const DIRECTIONS = {
  backward: 'backward',
  forward: 'forward',
} as const

export const DEFAULT_ARGS: Partial<T_ArgsBase> & Pick<T_ArgsBase, 'end' | 'rules' | 'direction' | 'extend'> = {
  end: 10,
  rules: [
    {
      portion: 1,
      unit: INTERVAL_UNITS.day,
    },
  ],
  direction: DIRECTIONS.forward,
  extend: {},
}
