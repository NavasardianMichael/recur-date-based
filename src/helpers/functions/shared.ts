export function cloneDate(date: Date): Date {
  return new Date(date.getTime())
}

export const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0')
export const pad3 = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(3, '0')

export const isNullish = (value: unknown) => value == null
