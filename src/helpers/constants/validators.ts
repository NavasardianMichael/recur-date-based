import { isNullish } from '@/helpers/functions/shared'
import { isValidDate } from '@/helpers/functions/dates'
import { generateErrorPreText, hasFormatOptions } from '@/helpers/functions/shared'
import { validateCronString } from '@/helpers/functions/cron'
import { T_ArgsBase, T_CoreInitialArgs, T_Rule } from '@/helpers/types/lib'
import { DIRECTIONS, ERRORS, INTERVAL_UNITS } from '@/helpers/constants/commons'
import { OUTPUT_FORMATS } from '@/helpers/constants/formats'

export const VALIDATORS: Record<keyof T_ArgsBase, (args: T_CoreInitialArgs) => string> = {
  start: ({ start }) => {
    if (isNullish(start) || isValidDate(start!)) return ''

    return `${generateErrorPreText('start', start)}. The provided value must be either a string, which can be formatted into a valid date, or a Date.`
  },
  rules: ({ rules, direction }) => {
    if (isNullish(rules)) return ''

    if (typeof rules === 'string') {
      return validateCronString(rules)
    }

    for (const { unit, portion } of rules as T_Rule[]) {
      if (typeof portion !== 'number' || isNaN(portion) || !Number.isInteger(portion)) {
        return `${generateErrorPreText('rules', portion)}. The provided value for *${unit}* must be a number.`
      }

      if (portion <= 0) {
        return direction === DIRECTIONS.forward
          ? `${generateErrorPreText('rules', portion)}. The provided value for *portion* must be a positive number. Use only positive portions. Instead, you can set direction property to *backward* in *genRecurDateBasedList* configs.`
          : `${generateErrorPreText('rules', portion)}. The provided value for *portion* must be a positive number. Use only positive portions. The property *direction* is already set to *backward* in *genRecurDateBasedList* configs.`
      }

      if (isNullish(unit)) return ''

      if (!Object.keys(INTERVAL_UNITS).includes(unit)) {
        return `${generateErrorPreText('rules', unit)}. The provided *unit* must be one of the types from the following list: ${Object.keys(INTERVAL_UNITS).join(', ')}.`
      }
    }

    return ''
  },
  end: ({ end, rules }) => {
    if (typeof rules === 'string') {
      if (isNullish(end)) {
        return 'When `rules` is a string (cron), `end` is required: date, string or number (count of occurrences).'
      }
    }

    if (isNullish(end)) return ''

    if (
      (typeof end !== 'string' && typeof end !== 'number' && !isValidDate(end!)) ||
      (typeof end === 'string' && !isValidDate(end)) ||
      (typeof end === 'number' && (end > ERRORS.outputLimit.count || isNaN(end)))
    ) {
      return `${generateErrorPreText('end', end)}. The provided value must be either a string, which can be formatted into a valid date, or a number less than 100_000.`
    }

    return ''
  },
  direction: ({ direction }) => {
    if (isNullish(direction)) return ''

    if (!Object.keys(DIRECTIONS).includes(direction!)) {
      return `${generateErrorPreText('direction', direction)}. The provided value must be one of the members from the following list: ${JSON.stringify(Object.keys(DIRECTIONS))}.`
    }

    return ''
  },
  numericTimeZone: ({ numericTimeZone }) => {
    if (isNullish(numericTimeZone)) return ''

    if (
      typeof numericTimeZone !== 'number' ||
      isNaN(numericTimeZone) ||
      !Number.isInteger(numericTimeZone) ||
      numericTimeZone < -12 ||
      numericTimeZone > 12
    ) {
      return `${generateErrorPreText('numericTimeZone', numericTimeZone)}. The provided value timezone must be an integer defined in a specific range (from -12 to 12).`
    }

    return ''
  },
  localeString: ({ localeString, numericTimeZone, outputFormat }) => {
    if (isNullish(localeString)) return ''

    if (typeof localeString !== 'object') {
      return `The provided property *localeString* must be an object.`
    }

    if (numericTimeZone != null && localeString.formatOptions?.timeZone != null) {
      return `There is an unresolved conflict in the provided configuration object. Either provide *timeZone* property in *localeString.formatOptions* or define the timezone using the property *numericTimeZone*.`
    }

    if (outputFormat != null && hasFormatOptions(localeString)) {
      return `Using *outputFormat* and *localeString.formatOptions* at the same time may cause conflicts in the output format. Either provide *outputFormat* or *localeString.formatOptions* in the configuration object, but not both.`
    }

    return ''
  },
  outputFormat: ({ outputFormat, localeString }) => {
    if (isNullish(outputFormat)) return ''

    if (typeof outputFormat !== 'string') {
      return `${generateErrorPreText('outputFormat', outputFormat)}. The provided value must be one of the supported format strings. Use OUTPUT_FORMATS from the library.`
    }

    if (!OUTPUT_FORMATS.includes(outputFormat)) {
      return `${generateErrorPreText('outputFormat', outputFormat)}. The format must be one of the supported strings. Use one of the *OUTPUT_FORMATS* exported from the library.`
    }

    if (hasFormatOptions(localeString)) {
      return `Using *outputFormat* and *localeString.formatOptions* at the same time may cause conflicts in the output format. Either provide *outputFormat* or *localeString.formatOptions* in the configuration object, but not both.`
    }

    return ''
  },
  filter: ({ filter }) => {
    if (isNullish(filter)) return ''

    if (typeof filter !== 'function') {
      return `The provided property *filter* must be a function, which returns a boolean value.`
    }

    return ''
  },
  extend: ({ extend }) => {
    if (isNullish(extend)) return ''

    if (typeof extend !== 'object') {
      return `The provided property *extend* must be an object.`
    }

    return ''
  },
  onError: ({ onError }) => {
    if (isNullish(onError)) return ''

    if (typeof onError !== 'function') {
      return `The provided property onError must be a function.`
    }

    return ''
  },
}
