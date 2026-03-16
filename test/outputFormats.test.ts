import { describe, it } from 'node:test'
import assert from 'node:assert'
import { OUTPUT_FORMATS, DIRECTIONS, INTERVAL_UNITS } from '../dist/index.mjs'

describe('OUTPUT_FORMATS', () => {
  it('is exported and is array', () => {
    assert.ok(Array.isArray(OUTPUT_FORMATS))
    assert.ok(OUTPUT_FORMATS.length > 0)
  })

  it('includes common date-only formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DD'))
    assert.ok(OUTPUT_FORMATS.includes('MM/DD/YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('DD/MM/YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('DD-MM-YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('DD.MM.YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY/MM/DD'))
  })

  it('includes 2-digit year formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('YY/MM/DD'))
    assert.ok(OUTPUT_FORMATS.includes('YY-MM-DD'))
    assert.ok(OUTPUT_FORMATS.includes('DD.MM.YY'))
    assert.ok(OUTPUT_FORMATS.includes('MM/DD/YY'))
    assert.ok(OUTPUT_FORMATS.includes('DD/MM/YY'))
  })

  it('includes compact formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('YYYYMMDD'))
    assert.ok(OUTPUT_FORMATS.includes('YYYYDDD'))
  })

  it('includes month name formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('MMM DD, YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('MMMM DD, YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('MMMM YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('MMM YYYY'))
  })

  it('includes weekday formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('EEEE, MMMM DD, YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('EEEE, DD MMM YYYY'))
    assert.ok(OUTPUT_FORMATS.includes('EEE, DD MMM YYYY HH:MM:SS'))
  })

  it('includes time-only formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('HH:MM'))
    assert.ok(OUTPUT_FORMATS.includes('HH:MM:SS'))
    assert.ok(OUTPUT_FORMATS.includes('HH:MM:SS.SSS'))
    assert.ok(OUTPUT_FORMATS.includes('HH:MM A'))
    assert.ok(OUTPUT_FORMATS.includes('HH:MM:SS A'))
    assert.ok(OUTPUT_FORMATS.includes('HH:MM:SS.SSS A'))
  })

  it('includes timezone Z formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('HH:MM Z'))
    assert.ok(OUTPUT_FORMATS.includes('HH:MM:SS Z'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DDTHH:MMZ'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DDTHH:MM:SSZ'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DDTHH:MM:SS.SSSZ'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DD HH:MM:SS Z'))
  })

  it('includes combined date-time formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DD HH:MM'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DD HH:MM:SS'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DD HH:MM:SS.SSS'))
    assert.ok(OUTPUT_FORMATS.includes('MM/DD/YYYY HH:MM'))
    assert.ok(OUTPUT_FORMATS.includes('DD/MM/YYYY HH:MM'))
    assert.ok(OUTPUT_FORMATS.includes('DD/MM/YYYY HH:MM:SS'))
    assert.ok(OUTPUT_FORMATS.includes('DD-MM-YYYY HH:MM'))
    assert.ok(OUTPUT_FORMATS.includes('DD.MM.YYYY HH:MM'))
  })

  it('includes AM/PM date-time formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('MM/DD/YYYY HH:MM A'))
    assert.ok(OUTPUT_FORMATS.includes('DD/MM/YYYY HH:MM A'))
    assert.ok(OUTPUT_FORMATS.includes('DD/MM/YYYY HH:MM:SS A'))
    assert.ok(OUTPUT_FORMATS.includes('DD/MM/YYYY HH:MM:SS.SSS A'))
    assert.ok(OUTPUT_FORMATS.includes('MMM DD, YYYY HH:MM A'))
    assert.ok(OUTPUT_FORMATS.includes('MMM DD, YYYY HH:MM:SS A'))
    assert.ok(OUTPUT_FORMATS.includes('MMM DD, YYYY HH:MM:SS.SSS A'))
    assert.ok(OUTPUT_FORMATS.includes('EEE, DD MMM YYYY HH:MM:SS A'))
    assert.ok(OUTPUT_FORMATS.includes('EEE, DD MMM YYYY HH:MM:SS.SSS A'))
  })

  it('has no duplicates', () => {
    const unique = new Set(OUTPUT_FORMATS)
    assert.strictEqual(unique.size, OUTPUT_FORMATS.length, 'no duplicate formats')
  })

  it('every format is a non-empty string', () => {
    OUTPUT_FORMATS.forEach((fmt: string) => {
      assert.strictEqual(typeof fmt, 'string')
      assert.ok(fmt.length > 0, `format should be non-empty`)
    })
  })
})

describe('DIRECTIONS', () => {
  it('is exported and is an object', () => {
    assert.ok(typeof DIRECTIONS === 'object')
    assert.ok(DIRECTIONS !== null)
  })

  it('has forward and backward', () => {
    assert.strictEqual(DIRECTIONS.forward, 'forward')
    assert.strictEqual(DIRECTIONS.backward, 'backward')
  })

  it('has exactly 2 keys', () => {
    assert.strictEqual(Object.keys(DIRECTIONS).length, 2)
  })
})

describe('INTERVAL_UNITS', () => {
  it('is exported and is an object', () => {
    assert.ok(typeof INTERVAL_UNITS === 'object')
    assert.ok(INTERVAL_UNITS !== null)
  })

  it('has all expected units', () => {
    assert.strictEqual(INTERVAL_UNITS.millisecond, 'millisecond')
    assert.strictEqual(INTERVAL_UNITS.minute, 'minute')
    assert.strictEqual(INTERVAL_UNITS.hour, 'hour')
    assert.strictEqual(INTERVAL_UNITS.day, 'day')
    assert.strictEqual(INTERVAL_UNITS.week, 'week')
    assert.strictEqual(INTERVAL_UNITS.month, 'month')
    assert.strictEqual(INTERVAL_UNITS.year, 'year')
  })

  it('has exactly 7 units', () => {
    assert.strictEqual(Object.keys(INTERVAL_UNITS).length, 7)
  })

  it('keys match their values', () => {
    Object.entries(INTERVAL_UNITS).forEach(([key, value]) => {
      assert.strictEqual(key, value, `key "${key}" matches value "${value}"`)
    })
  })
})
