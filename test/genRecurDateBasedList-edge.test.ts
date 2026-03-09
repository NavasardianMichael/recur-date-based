import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - edge cases', () => {
  it('start omitted: uses "now" (default)', () => {
    const list = genRecurDateBasedList({ end: 3, rules: [{ unit: 'day', portion: 1 }] })
    assert.strictEqual(list.length, 3)
  })

  it('empty rules falls back to default (1 day)', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 3,
      rules: [],
    })
    assert.strictEqual(list.length, 3)
  })

  it('direction backward with positive portions', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-10',
      end: '2024-01-05',
      rules: [{ unit: 'day', portion: 1 }],
      direction: 'backward',
    })
    assert.ok(list.length >= 1)
    assert.ok(list[0].date >= list[list.length - 1].date)
  })

  it('numericTimeZone', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 1,
      rules: [{ unit: 'day', portion: 1 }],
      numericTimeZone: 0,
    })
    assert.strictEqual(list.length, 1)
  })

  it('without numericTimeZone: date and dateStr same moment (dateStr is stringified date), utcDate in UTC (0)', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-15T12:00:00',
      end: 1,
      rules: [{ unit: 'day', portion: 1 }],
      outputFormat: 'YYYY-MM-DD HH:MM',
    })
    const r = list[0]
    const inputAsLocal = new Date('2024-01-15T12:00:00')
    assert.strictEqual(r.dateStr.slice(0, 10), '2024-01-15', 'dateStr date part')
    const [, timePart] = r.dateStr.split(' ')
    const [h, m] = timePart.split(':').map(Number)
    assert.strictEqual(h, r.date.getHours(), 'dateStr hour matches date (same moment)')
    assert.strictEqual(m, r.date.getMinutes(), 'dateStr minute matches date (same moment)')
    assert.strictEqual(h, inputAsLocal.getHours(), 'dateStr in user local timezone')
    assert.strictEqual(m, inputAsLocal.getMinutes(), 'dateStr minute in user local')
    assert.ok(r.utcDate.toISOString().endsWith('Z'), 'utcDate in UTC (0 offset)')
  })

  it('onError: invalid config does not throw when onError provided', () => {
    let caught: unknown = null
    const list = genRecurDateBasedList({
      start: 'invalid-date',
      end: 5,
      rules: [{ unit: 'day', portion: 1 }],
      onError: (e) => {
        caught = e
      },
    })
    assert.ok(caught instanceof Error)
    assert.strictEqual(list.length, 0)
  })

  it('invalid end throws when no onError', () => {
    assert.throws(
      () =>
        genRecurDateBasedList({
          start: '2024-01-01',
          end: 'not-a-date',
          rules: [{ unit: 'day', portion: 1 }],
        }),
      /Invalid/
    )
  })

  it('invalid cron throws when no onError', () => {
    assert.throws(
      () =>
        genRecurDateBasedList({
          start: '2024-01-01',
          end: 5,
          rules: 'invalid cron',
        }),
      /Cron|Invalid/
    )
  })

  it('cron with end as string date', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: '2024-01-03',
      rules: '0 9 * * *',
    })
    assert.ok(list.length >= 1)
  })

  it('localeString with formatOptions.timeZone', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 1,
      rules: [{ unit: 'day', portion: 1 }],
      localeString: { formatOptions: { timeZone: 'UTC' } },
    })
    assert.strictEqual(list.length, 1)
  })

  it('multiple units in rules (e.g. 2 days)', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 5,
      rules: [{ unit: 'day', portion: 2 }],
    })
    assert.strictEqual(list.length, 5)
    const d0 = new Date(list[0].date).getTime()
    const d1 = new Date(list[1].date).getTime()
    assert.strictEqual(Math.round((d1 - d0) / (24 * 60 * 60 * 1000)), 2)
  })

  it('filter returns false skips iteration', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 5,
      rules: [{ unit: 'day', portion: 1 }],
      filter: () => false,
    })
    assert.strictEqual(list.length, 0)
  })
})
