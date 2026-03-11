/**
 * Cron expression support (5 fields: minute, hour, day-of-month, month, day-of-week).
 * Used when `rules` is a cron string in genRecurDateBasedList.
 */
import {
  CRON_FAR_BOUND_MS,
  CRON_FIELD_NAMES,
  CRON_FIELD_RANGES,
  MAX_ITERATIONS_DAY_STEP,
  MAX_ITERATIONS_FIRST_MATCH_MINUTES,
} from '@/helpers/constants/cron'
import { ERRORS } from '@/helpers/constants/commons'
import { T_CronFieldName, T_CronStepType } from '@/helpers/types/cron'
import { T_Direction, T_ParsedCron } from '@/helpers/types/lib'
import { cloneDate } from '@/helpers/functions/dates'

/** null = any, Set = allowed values, undefined = invalid */
function parseCronField(
  str: string,
  fieldName: T_CronFieldName,
  allowSundaySeven: boolean
): Set<number> | null | undefined {
  const trimmed = str.trim()
  const [min, max] = CRON_FIELD_RANGES[fieldName]

  if (trimmed === '*') return null

  const values = new Set<number>()

  for (const part of trimmed.split(',')) {
    const stepMatch = part.match(/^(.+)\/(\d+)$/)
    const step = stepMatch ? Math.max(1, parseInt(stepMatch[2], 10)) : 1
    const rangePart = stepMatch ? stepMatch[1].trim() : part.trim()

    let rangeStart: number
    let rangeEnd: number

    if (rangePart === '*') {
      rangeStart = min
      rangeEnd = max
    } else {
      const range = rangePart.split('-')
      if (range.length === 1) {
        let v = parseInt(range[0], 10)
        if (fieldName === 'dayOfWeek' && allowSundaySeven && v === 7) v = 0
        if (isNaN(v) || v < min || v > max) return undefined
        values.add(v)
        continue
      }
      if (range.length === 2) {
        rangeStart = parseInt(range[0], 10)
        rangeEnd = parseInt(range[1], 10)
        if (fieldName === 'dayOfWeek' && allowSundaySeven) {
          if (rangeStart === 7) rangeStart = 0
          if (rangeEnd === 7) rangeEnd = 0
        }
        if (isNaN(rangeStart) || isNaN(rangeEnd) || rangeStart < min || rangeEnd > max || rangeStart > rangeEnd)
          return undefined
      } else {
        return undefined
      }
    }

    for (let i = rangeStart; i <= rangeEnd; i += step) {
      if (i >= min && i <= max) values.add(i)
    }
  }

  if (values.size === 0) return undefined
  return values
}

/**
 * Parse a 5-field cron string. Returns null if invalid.
 * Format: "minute hour dayOfMonth month dayOfWeek"
 * dayOfWeek: 0-6 (0=Sunday) or 1-7 (7=Sunday)
 */
export function parseCron(cronStr: string): T_ParsedCron | null {
  if (typeof cronStr !== 'string') return null
  const parts = cronStr.trim().split(/\s+/)
  if (parts.length !== 5) return null

  const allowSundaySeven = true
  const minute = parseCronField(parts[0], 'minute', false)
  const hour = parseCronField(parts[1], 'hour', false)
  const dayOfMonth = parseCronField(parts[2], 'dayOfMonth', false)
  const month = parseCronField(parts[3], 'month', false)
  const dayOfWeek = parseCronField(parts[4], 'dayOfWeek', allowSundaySeven)

  if (
    minute === undefined ||
    hour === undefined ||
    dayOfMonth === undefined ||
    month === undefined ||
    dayOfWeek === undefined
  )
    return null

  return { minute, hour, dayOfMonth, month, dayOfWeek }
}

/**
 * Validate cron string. Returns error message or empty string if valid.
 */
export function validateCronString(cronStr: unknown): string {
  if (typeof cronStr !== 'string') {
    return 'Cron rules must be a non-empty string with 5 fields: minute hour day-of-month month day-of-week.'
  }
  const trimmed = cronStr.trim()
  if (!trimmed) {
    return 'Cron rules must be a non-empty string with 5 fields: minute hour day-of-month month day-of-week.'
  }
  const parsed = parseCron(trimmed)
  if (!parsed) {
    return 'Invalid cron expression. Use 5 fields: minute (0-59), hour (0-23), day-of-month (1-31), month (1-12), day-of-week (0-6, 0=Sunday). Examples: "0 9 * * 1-5", "*/15 0 1 * *".'
  }
  return ''
}

function dateMatchesCron(date: Date, cron: T_ParsedCron): boolean {
  const min = date.getMinutes()
  const hour = date.getHours()
  const dom = date.getDate()
  const month = date.getMonth() + 1
  const dow = date.getDay()

  if (cron.minute !== null && !cron.minute.has(min)) return false
  if (cron.hour !== null && !cron.hour.has(hour)) return false
  if (cron.dayOfMonth !== null && !cron.dayOfMonth.has(dom)) return false
  if (cron.month !== null && !cron.month.has(month)) return false
  if (cron.dayOfWeek !== null && !cron.dayOfWeek.has(dow)) return false
  return true
}

// --- Optimized path: split by multi-value fields, fixed-step or day-step, k-way merge ---

function getSingletonValue(set: Set<number> | null): number | undefined {
  if (set === null || set.size !== 1) return undefined
  return set.values().next().value
}

/** Set date to cron time when minute/hour are fixed (for dayOfMonth step). */
function setTimeFromParsed(d: Date, parsed: T_ParsedCron): void {
  const m = getSingletonValue(parsed.minute) ?? d.getMinutes()
  const h = getSingletonValue(parsed.hour) ?? d.getHours()
  d.setHours(h, m, 0, 0)
}

function getStepType(parsed: T_ParsedCron): T_CronStepType {
  const minS = getSingletonValue(parsed.minute)
  const hourS = getSingletonValue(parsed.hour)
  const domS = getSingletonValue(parsed.dayOfMonth)
  const monthS = getSingletonValue(parsed.month)
  const dowS = getSingletonValue(parsed.dayOfWeek)

  if (domS !== undefined && parsed.month === null) return 'dayOfMonth'
  if (dowS !== undefined && domS === undefined && parsed.month === null) return 'week'
  if (monthS !== undefined && domS !== undefined) return 'year'
  if (
    minS !== undefined &&
    hourS !== undefined &&
    parsed.dayOfMonth === null &&
    parsed.month === null &&
    parsed.dayOfWeek === null
  ) {
    return 'day'
  }
  if (minS !== undefined && parsed.hour === null) return 'minute'
  return 'day'
}

function expandToSubCrons(parsed: T_ParsedCron): T_ParsedCron[] {
  for (const name of CRON_FIELD_NAMES) {
    const set = parsed[name]
    if (set !== null && set.size > 1) {
      return Array.from(set).map((val) => ({
        ...parsed,
        [name]: new Set<number>([val]),
      }))
    }
  }
  return [parsed]
}

function getFirstMatchInclusive(from: Date, parsed: T_ParsedCron, direction: T_Direction): Date | null {
  const d = cloneDate(from)
  d.setSeconds(0, 0)
  const stepType = getStepType(parsed)

  if (stepType === 'dayOfMonth') {
    for (let i = 0; i < MAX_ITERATIONS_DAY_STEP; i++) {
      setTimeFromParsed(d, parsed)
      if (dateMatchesCron(d, parsed)) return d
      if (direction === 'forward') {
        d.setDate(d.getDate() + 1)
      } else {
        d.setDate(d.getDate() - 1)
        if (d.getTime() < 0) return null
      }
    }
    return null
  }

  const step = direction === 'forward' ? 1 : -1
  for (let i = 0; i < MAX_ITERATIONS_FIRST_MATCH_MINUTES; i++) {
    if (dateMatchesCron(d, parsed)) return d
    d.setMinutes(d.getMinutes() + step)
    if (d.getTime() < 0) return null
  }
  return null
}

function advanceDateByCronStep(date: Date, stepType: T_CronStepType, direction: T_Direction): void {
  const sign = direction === 'forward' ? 1 : -1
  switch (stepType) {
    case 'minute':
      date.setMinutes(date.getMinutes() + sign * 60)
      break
    case 'hour':
    case 'day':
      date.setHours(date.getHours() + sign * 24)
      break
    case 'week':
      date.setDate(date.getDate() + sign * 7)
      break
    case 'year':
      date.setFullYear(date.getFullYear() + sign)
      break
    case 'dayOfMonth':
      break
  }
}

function getNextMatchOptimized(
  from: Date,
  parsed: T_ParsedCron,
  stepType: T_CronStepType,
  direction: T_Direction
): Date | null {
  const d = cloneDate(from)

  if (stepType === 'dayOfMonth') {
    const sign = direction === 'forward' ? 1 : -1
    d.setDate(d.getDate() + sign)
    for (let i = 0; i < MAX_ITERATIONS_DAY_STEP; i++) {
      if (d.getTime() < 0) return null
      setTimeFromParsed(d, parsed)
      if (dateMatchesCron(d, parsed)) return d
      d.setDate(d.getDate() + sign)
    }
    return null
  }

  advanceDateByCronStep(d, stepType, direction)
  if (d.getTime() < 0) return null
  return dateMatchesCron(d, parsed) ? d : null
}

function generateListForSubCron(
  start: Date,
  end: Date,
  parsed: T_ParsedCron,
  direction: T_Direction,
  maxItems: number
): Date[] {
  const list: Date[] = []
  let current = getFirstMatchInclusive(start, parsed, direction)
  const stepType = getStepType(parsed)

  while (current !== null && list.length < maxItems) {
    if (direction === 'forward' && current >= end) break
    if (direction === 'backward' && current <= end) break
    list.push(current)
    current = getNextMatchOptimized(current, parsed, stepType, direction)
  }
  return list
}

function mergeSortedLists(lists: Date[][], direction: T_Direction): Date[] {
  const K = lists.length
  const indexes = new Array(K).fill(0)
  const result: Date[] = []
  const cmp =
    direction === 'forward'
      ? (a: Date, b: Date) => a.getTime() - b.getTime()
      : (a: Date, b: Date) => b.getTime() - a.getTime()

  while (true) {
    let bestIdx = -1
    let bestDate: Date | null = null
    for (let k = 0; k < K; k++) {
      const idx = indexes[k]
      if (idx >= lists[k].length) continue
      const d = lists[k][idx]
      if (bestDate === null || cmp(d, bestDate) < 0) {
        bestDate = d
        bestIdx = k
      }
    }
    if (bestIdx === -1) break
    result.push(bestDate!)
    indexes[bestIdx]++
  }
  return result
}

/**
 * Optimized cron occurrence generation: splits multi-value fields into sub-crons, uses fixed-step or day-step per sub-cron, then k-way merges. Returns dates in [start, end) (forward) or (end, start] (backward), capped at output limit. When endCount is set, stops after that many results (uses internal far bound).
 */
export function getCronOccurrencesOptimized(
  start: Date,
  end: Date,
  cronStr: string,
  direction: T_Direction,
  endCount?: number
): Date[] {
  const maxOutput = ERRORS.outputLimit.count
  const parsed = parseCron(cronStr)
  if (!parsed) return []

  const bound =
    endCount != null
      ? new Date(start.getTime() + (direction === 'forward' ? CRON_FAR_BOUND_MS : -CRON_FAR_BOUND_MS))
      : end

  const maxItems = endCount != null ? Math.min(endCount, maxOutput) : maxOutput
  const subCrons = expandToSubCrons(parsed)

  if (subCrons.length === 1) {
    const single = generateListForSubCron(start, bound, parsed, direction, maxItems)
    const capped = single.length > maxOutput ? single.slice(0, maxOutput) : single
    return endCount != null ? capped.slice(0, endCount) : capped
  }

  const lists = subCrons.map((sub) => generateListForSubCron(start, bound, sub, direction, maxOutput))
  const merged = mergeSortedLists(lists, direction)
  const capped = merged.length > maxOutput ? merged.slice(0, maxOutput) : merged
  return endCount != null ? capped.slice(0, endCount) : capped
}
