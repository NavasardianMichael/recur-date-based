import { DEFAULT_ARGS, DIRECTIONS, ERRORS } from '@/helpers/constants/commons'
import { POSTPONERS } from '@/helpers/constants/postponers'
import { getCronOccurrencesOptimized } from '@/helpers/functions/cron'
import { cloneDate, getDateStr } from '@/helpers/functions/dates'
import { checkInvalidData, processInitialArgs } from '@/helpers/functions/lib'
import { T_Core, T_CoreArgs, T_CoreInitialArgs, T_CoreReturnType, T_Error, T_PostponeArgs } from '@/helpers/types/lib'

function buildResultFromDate(
  f_Args: T_CoreArgs,
  currentDate: Date
): { currentResult: T_CoreReturnType; callbackArgs: T_CoreReturnType } {
  const dateStr = getDateStr(currentDate, f_Args)
  const date = cloneDate(currentDate)
  const wallMs = Date.UTC(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours(),
    currentDate.getMinutes(),
    currentDate.getSeconds(),
    currentDate.getMilliseconds()
  )
  const utcDate = new Date(wallMs - f_Args.numericTimeZone * 60 * 60 * 1000)

  const currentResult: T_CoreReturnType = { dateStr, date, utcDate }

  const callbackArgs: T_CoreReturnType = {
    dateStr,
    date: cloneDate(currentDate),
    utcDate: new Date(utcDate.getTime()),
  }

  return { currentResult, callbackArgs }
}

/**
 * Yields list of recurring dates from `start` to `end` (date or step count), stepping by `rules` in `direction`. Each item has `date`, `utcDate`, `dateStr` and property defined in the object `extend`; `filter` can skip iterations.
 *
 * @param args - Partial config (start, end, rules, direction, outputFormat, localeString, filter, extend, onError, numericTimeZone). Defaults to `DEFAULT_ARGS`; omit `start` for "now". `rules` may be an array of unit/portion or a cron string (e.g. "0 9 * * 1-5").
 * @returns Array of {@link T_CoreReturnType}.
 * @throws {Error} On invalid config or when iteration count exceeds 99_999.
 */
export const genRecurDateBasedList = ((args: T_CoreInitialArgs = DEFAULT_ARGS) => {
  const result: T_CoreReturnType[] = []

  try {
    checkInvalidData(args)

    const f_Args = processInitialArgs(args)

    const isDirectionForward = f_Args.direction === DIRECTIONS.forward
    let iterations: number = 0
    const rules = f_Args.rules

    if (typeof rules === 'string') {
      const cronStr = rules
      const dates = getCronOccurrencesOptimized(
        f_Args.start,
        f_Args.end,
        cronStr,
        f_Args.direction,
        f_Args.endCount ?? undefined
      )
      for (const current of dates) {
        if (f_Args.endCount != null && result.length >= f_Args.endCount) break
        iterations++
        if (iterations === ERRORS.outputLimit.count) {
          throw new Error(ERRORS.outputLimit.errorText)
        }

        const { currentResult, callbackArgs } = buildResultFromDate(f_Args, current)

        if (f_Args.filter && f_Args.filter(callbackArgs) === false) continue

        if (f_Args.extend) {
          for (const key in f_Args.extend) {
            ;(currentResult as Record<string, unknown>)[key] = f_Args.extend[key](callbackArgs)
          }
        }

        result.push(currentResult)
      }
    } else {
      const postpone = (date: T_PostponeArgs['start']) => {
        rules.forEach((rule) => {
          const postponeByDirection = POSTPONERS[f_Args.direction]
          postponeByDirection[rule.unit](date, rule.portion)
        })
      }

      while (isDirectionForward ? f_Args.start < f_Args.end : f_Args.start > f_Args.end) {
        iterations++

        if (iterations === ERRORS.outputLimit.count) {
          throw new Error(ERRORS.outputLimit.errorText)
        }

        const { currentResult, callbackArgs } = buildResultFromDate(f_Args, f_Args.start)

        if (f_Args.filter && f_Args.filter(callbackArgs) === false) {
          postpone(f_Args.start)
          if (typeof f_Args.end === 'number') postpone(f_Args.end)
          iterations++

          continue
        }

        if (f_Args.extend) {
          for (const key in f_Args.extend) {
            ;(currentResult as Record<string, unknown>)[key] = f_Args.extend[key](callbackArgs)
          }
        }

        result.push(currentResult)

        postpone(f_Args.start)
      }
    }
  } catch (e) {
    const error = e as T_Error

    if (args.onError && typeof args.onError === 'function') {
      args.onError(error)
    } else {
      throw new Error(error.message)
    }
  }

  return result
}) as T_Core
