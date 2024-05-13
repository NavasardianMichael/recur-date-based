import { DEFAULT_ARGS } from "../constants/commons";
import { POSTPONERS } from "../constants/postponers";
import { TODAY } from '../constants/shared';
import { VALIDATORS } from "../constants/validators";
import { T_CoreArgs, T_CoreInitialArgs } from "../types/lib";
import { isDateObject, setTimeZoneOffset } from "./dates";

export function getEndDate({
  start,
  rules,
  direction,
  end,
}: T_CoreArgs): Date {
  if (typeof end === "string") return new Date(end);

  if (isDateObject(end)) return end as Date;

  const f_End = new Date(start);

  rules.forEach((rule) => {
    POSTPONERS[direction][rule.unit](
      f_End,
      rule.portion * (+end ?? +DEFAULT_ARGS.end)
    );
  });

  return f_End;
}

// start = DEFAULT_ARGS.start, 
// rules = DEFAULT_ARGS.rules,
// direction = DEFAULT_ARGS.direction,
// end = DEFAULT_ARGS.end,

export function processInitialArgs(args: T_CoreInitialArgs): T_CoreArgs { 
  const start = new Date(args.start ?? DEFAULT_ARGS.start);
  

  let result = {
    start: args.numericTimeZone
      ? setTimeZoneOffset(start, args.numericTimeZone)
      : start,
    rules: args.rules?.length ? args.rules : DEFAULT_ARGS.rules,
    direction: args.direction ?? DEFAULT_ARGS.direction,
    localeString: args.localeString ?? {},
    extend: args.extend,
    filter: args.filter,
    numericTimeZone: args.numericTimeZone ?? TODAY.getTimezoneOffset() / 60,
    end: args.end,
  }  as T_CoreArgs

  const end = getEndDate(result);
  result.end = args.numericTimeZone
  ? setTimeZoneOffset(end, args.numericTimeZone)
  : end

  return result;
}

export function checkInvalidData(args: T_CoreInitialArgs): void {
  Object.values(VALIDATORS).forEach((checker) => {
    const errorMessage = checker(args);
    if (errorMessage) throw new Error(errorMessage);
  });
}

export const generateErrorPreText = (key: keyof T_CoreArgs, value: unknown) => {
  return `Invalid property "${key}" (received *${value ||
    (value === "" ? "empty string" : value)}*)`;
};
