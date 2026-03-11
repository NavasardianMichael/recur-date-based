import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - step-based rules', () => {
  it('daily forward: 5 days from fixed start', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 5,
      rules: [{ unit: 'day', portion: 1 }],
    })
    assert.strictEqual(list.length, 5)
    assert.strictEqual(list[0].dateStr.split('T')[0], '2024-01-01')
    assert.strictEqual(list[4].dateStr.split('T')[0], '2024-01-05')
  })

  it('daily backward: 5 days', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-10',
      end: 5,
      rules: [{ unit: 'day', portion: 1 }],
      direction: 'backward',
    })
    assert.strictEqual(list.length, 5)
    assert.strictEqual(list[0].dateStr.split('T')[0], '2024-01-10')
    assert.strictEqual(list[4].dateStr.split('T')[0], '2024-01-06')
  })

  it('weekly: 3 weeks forward', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 3,
      rules: [{ unit: 'week', portion: 1 }],
    })
    assert.strictEqual(list.length, 3)
    const d0 = new Date(list[0].date)
    const d2 = new Date(list[2].date)
    assert.strictEqual(Math.round((d2.getTime() - d0.getTime()) / (7 * 24 * 60 * 60 * 1000)), 2)
  })

  it('monthly: 4 months forward', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-15',
      end: 4,
      rules: [{ unit: 'month', portion: 1 }],
    })
    assert.strictEqual(list.length, 4)
    assert.ok(list[0].dateStr.includes('2024-01'))
    assert.ok(list[3].dateStr.includes('2024-04'))
  })

  it('hourly: 6 hours', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01T00:00:00',
      end: 6,
      rules: [{ unit: 'hour', portion: 1 }],
    })
    assert.strictEqual(list.length, 6)
  })

  it('date range: start to end (string dates)', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: '2024-01-06',
      rules: [{ unit: 'day', portion: 1 }],
    })
    assert.strictEqual(list.length, 5)
  })

  it('with outputFormat', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 2,
      rules: [{ unit: 'day', portion: 1 }],
      outputFormat: 'YYYY-MM-DD',
    })
    assert.strictEqual(list[0].dateStr, '2024-01-01')
    assert.strictEqual(list[1].dateStr, '2024-01-02')
  })

  it('with localeString.lang', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 1,
      rules: [{ unit: 'day', portion: 1 }],
      outputFormat: 'MMMM DD, YYYY',
      localeString: { lang: 'en-US' },
    })
    assert.ok(list[0].dateStr.includes('January'))
  })

  it('filter: skip some dates', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 10,
      rules: [{ unit: 'day', portion: 1 }],
      filter: ({ date }) => date.getDate() % 2 === 1,
    })
    assert.ok(list.length < 10)
    list.forEach((r) => assert.strictEqual(r.date.getUTCDate() % 2, 1))
  })

  it('extend: add custom properties', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: 2,
      rules: [{ unit: 'day', portion: 1 }],
      extend: {
        dayOfWeek: ({ date }) => date.getDay(),
        iso: ({ dateStr }) => dateStr,
      },
    })
    assert.ok('dayOfWeek' in list[0])
    assert.ok('iso' in list[0])
    assert.strictEqual(typeof list[0].dayOfWeek, 'number')
  })

  it('each item has date, utcDate, dateStr', () => {
    const list = genRecurDateBasedList({ start: '2024-01-01', end: 1, rules: [{ unit: 'day', portion: 1 }] })
    const r = list[0]
    assert.ok(r.date instanceof Date)
    assert.ok(r.utcDate instanceof Date)
    assert.strictEqual(typeof r.dateStr, 'string')
  })
})
