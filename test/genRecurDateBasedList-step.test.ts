import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - step-based rules', () => {
  // ── Daily ─────────────────────────────────────────────────────────
  describe('daily rules', () => {
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

    it('every 2 days', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 5,
        rules: [{ unit: 'day', portion: 2 }],
      })
      assert.strictEqual(list.length, 5)
      const d0 = list[0].date.getTime()
      const d1 = list[1].date.getTime()
      assert.strictEqual(Math.round((d1 - d0) / (24 * 60 * 60 * 1000)), 2)
    })

    it('every 3 days forward from date range', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-16',
        rules: [{ unit: 'day', portion: 3 }],
      })
      assert.strictEqual(list.length, 5) // Jan 1, 4, 7, 10, 13
      assert.strictEqual(list[0].date.getDate(), 1)
      assert.strictEqual(list[1].date.getDate(), 4)
      assert.strictEqual(list[2].date.getDate(), 7)
      assert.strictEqual(list[3].date.getDate(), 10)
      assert.strictEqual(list[4].date.getDate(), 13)
    })

    it('date range: start to end (string dates)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-06',
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(list.length, 5)
    })
  })

  // ── Weekly ────────────────────────────────────────────────────────
  describe('weekly rules', () => {
    it('weekly: 3 weeks forward', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [{ unit: 'week', portion: 1 }],
      })
      assert.strictEqual(list.length, 3)
      const d0 = list[0].date.getTime()
      const d2 = list[2].date.getTime()
      assert.strictEqual(Math.round((d2 - d0) / (7 * 24 * 60 * 60 * 1000)), 2)
    })

    it('bi-weekly: every 2 weeks', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 4,
        rules: [{ unit: 'week', portion: 2 }],
      })
      assert.strictEqual(list.length, 4)
      const diff = list[1].date.getTime() - list[0].date.getTime()
      assert.strictEqual(Math.round(diff / (7 * 24 * 60 * 60 * 1000)), 2)
    })

    it('weekly backward', () => {
      const list = genRecurDateBasedList({
        start: '2024-03-01',
        end: 4,
        rules: [{ unit: 'week', portion: 1 }],
        direction: 'backward',
      })
      assert.strictEqual(list.length, 4)
      for (let i = 1; i < list.length; i++) {
        assert.ok(list[i - 1].date > list[i].date)
      }
    })
  })

  // ── Monthly ───────────────────────────────────────────────────────
  describe('monthly rules', () => {
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

    it('every 3 months (quarterly)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 4,
        rules: [{ unit: 'month', portion: 3 }],
      })
      assert.strictEqual(list.length, 4)
      const months = list.map((r) => r.date.getMonth())
      assert.deepStrictEqual(months, [0, 3, 6, 9]) // Jan, Apr, Jul, Oct
    })

    it('monthly backward', () => {
      const list = genRecurDateBasedList({
        start: '2024-12-15',
        end: 6,
        rules: [{ unit: 'month', portion: 1 }],
        direction: 'backward',
      })
      assert.strictEqual(list.length, 6)
      assert.strictEqual(list[0].date.getMonth(), 11) // Dec
      assert.strictEqual(list[5].date.getMonth(), 6) // Jul
    })

    it('monthly across year boundary', () => {
      const list = genRecurDateBasedList({
        start: '2024-11-01',
        end: 4,
        rules: [{ unit: 'month', portion: 1 }],
      })
      assert.strictEqual(list.length, 4)
      assert.strictEqual(list[0].date.getFullYear(), 2024)
      assert.strictEqual(list[2].date.getFullYear(), 2025) // Jan 2025
    })
  })

  // ── Yearly ────────────────────────────────────────────────────────
  describe('yearly rules', () => {
    it('yearly: 3 years forward', () => {
      const list = genRecurDateBasedList({
        start: '2024-06-15',
        end: 3,
        rules: [{ unit: 'year', portion: 1 }],
      })
      assert.strictEqual(list.length, 3)
      assert.strictEqual(list[0].date.getFullYear(), 2024)
      assert.strictEqual(list[1].date.getFullYear(), 2025)
      assert.strictEqual(list[2].date.getFullYear(), 2026)
    })

    it('every 2 years', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [{ unit: 'year', portion: 2 }],
      })
      assert.strictEqual(list.length, 3)
      assert.strictEqual(list[0].date.getFullYear(), 2024)
      assert.strictEqual(list[1].date.getFullYear(), 2026)
      assert.strictEqual(list[2].date.getFullYear(), 2028)
    })

    it('yearly backward', () => {
      const list = genRecurDateBasedList({
        start: '2024-06-15',
        end: 3,
        rules: [{ unit: 'year', portion: 1 }],
        direction: 'backward',
      })
      assert.strictEqual(list.length, 3)
      assert.strictEqual(list[0].date.getFullYear(), 2024)
      assert.strictEqual(list[1].date.getFullYear(), 2023)
      assert.strictEqual(list[2].date.getFullYear(), 2022)
    })
  })

  // ── Hourly ────────────────────────────────────────────────────────
  describe('hourly rules', () => {
    it('hourly: 6 hours', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T00:00:00',
        end: 6,
        rules: [{ unit: 'hour', portion: 1 }],
      })
      assert.strictEqual(list.length, 6)
      assert.strictEqual(list[0].date.getHours(), 0)
      assert.strictEqual(list[5].date.getHours(), 5)
    })

    it('every 4 hours', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T00:00:00',
        end: 6,
        rules: [{ unit: 'hour', portion: 4 }],
      })
      assert.strictEqual(list.length, 6)
      const hours = list.map((r) => r.date.getHours())
      assert.deepStrictEqual(hours, [0, 4, 8, 12, 16, 20])
    })

    it('hourly crosses day boundary', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T22:00:00',
        end: 4,
        rules: [{ unit: 'hour', portion: 1 }],
      })
      assert.strictEqual(list.length, 4)
      assert.strictEqual(list[0].date.getDate(), 1)
      assert.strictEqual(list[2].date.getDate(), 2) // midnight
    })
  })

  // ── Minute ────────────────────────────────────────────────────────
  describe('minute rules', () => {
    it('every minute for 5 iterations', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T12:00:00',
        end: 5,
        rules: [{ unit: 'minute', portion: 1 }],
      })
      assert.strictEqual(list.length, 5)
      assert.strictEqual(list[0].date.getMinutes(), 0)
      assert.strictEqual(list[4].date.getMinutes(), 4)
    })

    it('every 15 minutes', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T12:00:00',
        end: 4,
        rules: [{ unit: 'minute', portion: 15 }],
      })
      assert.strictEqual(list.length, 4)
      const minutes = list.map((r) => r.date.getMinutes())
      assert.deepStrictEqual(minutes, [0, 15, 30, 45])
    })

    it('every 30 minutes crosses hour', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T12:00:00',
        end: 4,
        rules: [{ unit: 'minute', portion: 30 }],
      })
      assert.strictEqual(list.length, 4)
      assert.strictEqual(list[0].date.getHours(), 12)
      assert.strictEqual(list[0].date.getMinutes(), 0)
      assert.strictEqual(list[2].date.getHours(), 13)
      assert.strictEqual(list[2].date.getMinutes(), 0)
    })
  })

  // ── Millisecond ───────────────────────────────────────────────────
  describe('millisecond rules', () => {
    it('every 500ms for 5 iterations', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T12:00:00.000',
        end: 5,
        rules: [{ unit: 'millisecond', portion: 500 }],
      })
      assert.strictEqual(list.length, 5)
      const ms0 = list[0].date.getTime()
      const ms1 = list[1].date.getTime()
      assert.strictEqual(ms1 - ms0, 500)
    })

    it('every 1000ms (1 second)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T12:00:00.000',
        end: 3,
        rules: [{ unit: 'millisecond', portion: 1000 }],
      })
      assert.strictEqual(list.length, 3)
      const diff = list[2].date.getTime() - list[0].date.getTime()
      assert.strictEqual(diff, 2000)
    })
  })

  // ── Multiple rules combined ───────────────────────────────────────
  describe('multiple rules combined', () => {
    it('1 month + 1 day: each step adds both', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [
          { unit: 'month', portion: 1 },
          { unit: 'day', portion: 1 },
        ],
      })
      assert.strictEqual(list.length, 3)
      // Jan 1 → Feb 2 → Mar 3
      assert.strictEqual(list[0].date.getMonth(), 0) // Jan
      assert.strictEqual(list[0].date.getDate(), 1)
      assert.strictEqual(list[1].date.getMonth(), 1) // Feb
      assert.strictEqual(list[1].date.getDate(), 2)
      assert.strictEqual(list[2].date.getMonth(), 2) // Mar
      assert.strictEqual(list[2].date.getDate(), 3)
    })

    it('1 hour + 30 minutes', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T00:00:00',
        end: 3,
        rules: [
          { unit: 'hour', portion: 1 },
          { unit: 'minute', portion: 30 },
        ],
      })
      assert.strictEqual(list.length, 3)
      // 00:00 → 01:30 → 03:00
      assert.strictEqual(list[0].date.getHours(), 0)
      assert.strictEqual(list[0].date.getMinutes(), 0)
      assert.strictEqual(list[1].date.getHours(), 1)
      assert.strictEqual(list[1].date.getMinutes(), 30)
      assert.strictEqual(list[2].date.getHours(), 3)
      assert.strictEqual(list[2].date.getMinutes(), 0)
    })

    it('1 year + 1 month', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [
          { unit: 'year', portion: 1 },
          { unit: 'month', portion: 1 },
        ],
      })
      assert.strictEqual(list.length, 3)
      // Jan 2024 → Feb 2025 → Mar 2026
      assert.strictEqual(list[0].date.getFullYear(), 2024)
      assert.strictEqual(list[0].date.getMonth(), 0)
      assert.strictEqual(list[1].date.getFullYear(), 2025)
      assert.strictEqual(list[1].date.getMonth(), 1)
      assert.strictEqual(list[2].date.getFullYear(), 2026)
      assert.strictEqual(list[2].date.getMonth(), 2)
    })
  })

  // ── End as Date object ────────────────────────────────────────────
  describe('end as Date object', () => {
    it('end as Date works same as string', () => {
      const listStr = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-06',
        rules: [{ unit: 'day', portion: 1 }],
      })
      const listDate = genRecurDateBasedList({
        start: '2024-01-01',
        end: new Date('2024-01-06'),
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(listStr.length, listDate.length)
    })
  })

  // ── Start as Date object ──────────────────────────────────────────
  describe('start as Date object', () => {
    it('start as Date object works correctly', () => {
      const list = genRecurDateBasedList({
        start: new Date(2024, 0, 1, 12, 0, 0),
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(list.length, 3)
      assert.strictEqual(list[0].date.getHours(), 12)
    })
  })

  // ── Output format with step rules ─────────────────────────────────
  describe('with outputFormat', () => {
    it('YYYY-MM-DD', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 2,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
      })
      assert.strictEqual(list[0].dateStr, '2024-01-01')
      assert.strictEqual(list[1].dateStr, '2024-01-02')
    })

    it('MM/DD/YYYY HH:MM A', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T14:00:00',
        end: 2,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'MM/DD/YYYY HH:MM A',
      })
      assert.ok(list[0].dateStr.includes('PM'))
    })
  })

  // ── With localeString ─────────────────────────────────────────────
  describe('with localeString', () => {
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

    it('localeString.lang as array', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'MMMM DD, YYYY',
        localeString: { lang: ['fr-FR'] },
      })
      assert.ok(list[0].dateStr.includes('janvier'), `expected French month in "${list[0].dateStr}"`)
    })

    it('localeString with formatOptions only (no outputFormat)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        localeString: {
          lang: 'en-US',
          formatOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        },
      })
      assert.ok(list[0].dateStr.includes('January'), `dateStr uses formatOptions: "${list[0].dateStr}"`)
      assert.ok(list[0].dateStr.includes('Monday') || list[0].dateStr.includes('2024'))
    })
  })

  // ── Return type structure ─────────────────────────────────────────
  describe('return type structure', () => {
    it('each item has date, utcDate, dateStr', () => {
      const list = genRecurDateBasedList({ start: '2024-01-01', end: 1, rules: [{ unit: 'day', portion: 1 }] })
      const r = list[0]
      assert.ok(r.date instanceof Date)
      assert.ok(r.utcDate instanceof Date)
      assert.strictEqual(typeof r.dateStr, 'string')
    })

    it('date and utcDate are independent clones', () => {
      const list = genRecurDateBasedList({ start: '2024-01-01', end: 2, rules: [{ unit: 'day', portion: 1 }] })
      // Mutating date of item 0 should not affect item 1
      const origDate1 = list[1].date.getTime()
      list[0].date.setFullYear(2000)
      assert.strictEqual(list[1].date.getTime(), origDate1, 'dates are independent clones')
    })
  })

  // ── Default args ──────────────────────────────────────────────────
  describe('default args', () => {
    it('calling with no args at all uses defaults', () => {
      const list = genRecurDateBasedList()
      // Default: end=10, forward, 1 day
      assert.strictEqual(list.length, 10)
    })

    it('calling with empty object uses defaults', () => {
      const list = genRecurDateBasedList({})
      assert.strictEqual(list.length, 10)
    })
  })
})
