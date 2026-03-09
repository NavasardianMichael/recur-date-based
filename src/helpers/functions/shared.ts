import type { T_ArgsBase, T_CoreArgs } from '../types/lib'

export const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0')
export const pad3 = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(3, '0')

export const isNullish = (value: unknown) => value == null

export function hasFormatOptions(localeString: T_ArgsBase['localeString'] | undefined): boolean {
  return Boolean(localeString?.formatOptions && Object.keys(localeString.formatOptions).length > 0)
}

export const generateErrorPreText = (key: keyof T_CoreArgs, value: unknown) =>
  `Invalid property "${key}" (received *${value === '' ? 'empty string' : value}*)`
