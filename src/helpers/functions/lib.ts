import { DEFAULT_ARGS } from '@/helpers/constants/commons'
import { POSTPONERS } from '@/helpers/constants/postponers'
import { TODAY } from '@/helpers/constants/shared'
import { VALIDATORS } from '@/helpers/constants/validators'
import { T_CoreArgs, T_CoreInitialArgs, T_Rule } from '@/helpers/types/lib'
import { isDateObject, setTimeZoneOffset } from '@/helpers/functions/dates'

export function getEndDate({ start, rules, direction, end }: T_CoreArgs): Date {
  if (typeof end === 'string') return new Date(end)

  if (isDateObject(end)) return end as Date

  const f_End = new Date(start)
  const rulesList = rules as T_Rule[]

  rulesList.forEach((rule) => {
    POSTPONERS[direction][rule.unit](f_End, rule.portion * (+end || +DEFAULT_ARGS.end))
  })

  return f_End
}

export function processInitialArgs(args: T_CoreInitialArgs): T_CoreArgs {
  let start: Date
  if (args.start === undefined) {
    start = new Date(TODAY.getTime())
    if (args.numericTimeZone != null) {
      setTimeZoneOffset(start, args.numericTimeZone)
    }
  } else if (typeof args.start === 'string') {
    // String: face values are the wall-clock time, no transformation needed
    start = new Date(args.start)
  } else {
    // Date object: transform to target timezone if numericTimeZone provided
    start = new Date(args.start.getTime())
    if (args.numericTimeZone != null) {
      setTimeZoneOffset(start, args.numericTimeZone)
    }
  }

  const rules =
    args.rules === undefined ||
    (Array.isArray(args.rules) && args.rules.length === 0) ||
    (typeof args.rules === 'string' && !args.rules.trim())
      ? DEFAULT_ARGS.rules
      : args.rules

  let result = {
    start,
    rules,
    direction: args.direction ?? DEFAULT_ARGS.direction,
    localeString: args.localeString ?? {},
    outputFormat: args.outputFormat,
    extend: args.extend,
    filter: args.filter,
    numericTimeZone: args.numericTimeZone ?? -(TODAY.getTimezoneOffset() / 60),
    end: args.end,
  } as T_CoreArgs

  if (typeof rules === 'string' && typeof args.end === 'number') {
    result.endCount = args.end
    result.end = result.start
  } else {
    const end = getEndDate(result)
    if (isDateObject(args.end) && args.numericTimeZone != null) {
      result.end = setTimeZoneOffset(new Date(end.getTime()), args.numericTimeZone)
    } else {
      result.end = end
    }
  }

  return result
}

export function checkInvalidData(args: T_CoreInitialArgs): void {
  Object.values(VALIDATORS).forEach((checker) => {
    const errorMessage = checker(args)
    if (errorMessage) throw new Error(errorMessage)
  })
}
