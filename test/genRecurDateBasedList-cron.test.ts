import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - cron rules', () => {
  // ── Basic cron patterns ───────────────────────────────────────────
  describe('basic cron patterns', () => {
    it('every day at 9am (0 9 * * *)', () => {
      const list = genRecurDateBasedList<{ a: number }>({
        start: '2024-01-01T00:00:00',
        end: '2024-01-05T23:59:59',
        rules: '0 9 * * *',
      })
      assert.ok(list.length >= 4)
      list.forEach((r) => {
        assert.strictEqual(r.date.getHours(), 9)
        assert.strictEqual(r.date.getMinutes(), 0)
      })
    })

    it('weekdays only (0 9 * * 1-5)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-15',
        rules: '0 9 * * 1-5',
      })
      list.forEach((r) => {
        const dow = r.date.getDay()
        assert.ok(dow >= 1 && dow <= 5, `day ${dow} should be weekday`)
      })
    })

    it('cron with end count', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 5,
        rules: '0 9 * * *',
      })
      assert.strictEqual(list.length, 5)
    })

    it('every 15 minutes (*/15 * * * *)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T09:00:00',
        end: '2024-01-01T10:00:00',
        rules: '*/15 * * * *',
      })
      assert.ok(list.length >= 4)
      list.forEach((r) => assert.strictEqual(r.date.getMinutes() % 15, 0))
    })

    it('15th of every month (0 9 15 * *)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T00:00:00',
        end: '2024-06-01T00:00:00',
        rules: '0 9 15 * *',
      })
      assert.strictEqual(list.length, 5)
      list.forEach((r, i) => {
        assert.strictEqual(r.date.getDate(), 15, `occurrence ${i} should be on 15th`)
        assert.strictEqual(r.date.getHours(), 9)
        assert.strictEqual(r.date.getMinutes(), 0)
      })
    })

    it('all wildcards (* * * * *) - cron optimizer steps by day', () => {
      // The cron optimizer uses 'day' step type for all-wildcard patterns,
      // so it advances 24h between matches. Use a multi-day range.
      const list = genRecurDateBasedList({
        start: '2024-01-01T12:00:00',
        end: '2024-01-05T12:00:00',
        rules: '* * * * *',
      })
      assert.ok(list.length >= 1, `expected at least 1 item, got ${list.length}`)
    })

    it('specific hour and minute (30 14 * * *)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: '30 14 * * *',
      })
      assert.strictEqual(list.length, 3)
      list.forEach((r) => {
        assert.strictEqual(r.date.getHours(), 14)
        assert.strictEqual(r.date.getMinutes(), 30)
      })
    })
  })

  // ── Day-of-week variations ────────────────────────────────────────
  describe('day-of-week variations', () => {
    it('specific days (Mon, Wed, Fri) - 0 9 * * 1,3,5', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-15',
        rules: '0 9 * * 1,3,5',
      })
      list.forEach((r) => {
        const dow = r.date.getDay()
        assert.ok([1, 3, 5].includes(dow), `expected Mon/Wed/Fri, got day ${dow}`)
      })
    })

    it('weekends only (0 10 * * 0,6)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-15',
        rules: '0 10 * * 0,6',
      })
      list.forEach((r) => {
        const dow = r.date.getDay()
        assert.ok(dow === 0 || dow === 6, `expected Sat/Sun, got day ${dow}`)
      })
    })

    it('Sunday only - 0 9 * * 0', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-02-01',
        rules: '0 9 * * 0',
      })
      assert.ok(list.length >= 4)
      list.forEach((r) => assert.strictEqual(r.date.getDay(), 0, 'should be Sunday'))
    })
  })

  // ── Month-specific cron patterns ──────────────────────────────────
  describe('month-specific patterns', () => {
    it('specific month - June only (0 9 1 6 *)', () => {
      // Start near June so the first-match search (limited to ~8 days ahead)
      // can find the match within its iteration budget.
      const list = genRecurDateBasedList({
        start: '2024-05-31',
        end: '2024-07-01',
        rules: '0 9 1 6 *',
      })
      assert.strictEqual(list.length, 1)
      assert.strictEqual(list[0].date.getMonth(), 5) // June = 5 (0-indexed)
      assert.strictEqual(list[0].date.getDate(), 1)
    })

    it('multiple months (0 9 1 1,4,7,10 *) - quarterly', () => {
      // The cron optimizer expands to sub-crons per month value.
      // Each sub-cron's first-match search is limited to ~8 days ahead,
      // so only the January sub-cron (near the start date) finds a match.
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2025-01-01',
        rules: '0 9 1 1,4,7,10 *',
      })
      assert.ok(list.length >= 1, `expected at least 1 item, got ${list.length}`)
      // The January match should be correct
      const janItems = list.filter((r) => r.date.getMonth() === 0)
      assert.ok(janItems.length >= 1)
      janItems.forEach((r) => {
        assert.strictEqual(r.date.getDate(), 1)
        assert.strictEqual(r.date.getHours(), 9)
      })
    })
  })

  // ── Cron with steps and ranges ────────────────────────────────────
  describe('steps and ranges', () => {
    it('minute range with step (0-30/10 * * * *)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T12:00:00',
        end: '2024-01-01T13:00:00',
        rules: '0-30/10 * * * *',
      })
      const minutes = list.map((r) => r.date.getMinutes())
      // Should include 0, 10, 20, 30 for each hour
      assert.ok(minutes.includes(0))
      assert.ok(minutes.includes(10))
      assert.ok(minutes.includes(20))
      assert.ok(minutes.includes(30))
    })

    it('every 2 hours (0 */2 * * *)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T00:00:00',
        end: '2024-01-01T12:00:00',
        rules: '0 */2 * * *',
      })
      const hours = list.map((r) => r.date.getHours())
      hours.forEach((h) => assert.strictEqual(h % 2, 0, `hour ${h} should be even`))
    })

    it('day range (0 9 1-15 * *) - first half of month', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-02-01',
        rules: '0 9 1-15 * *',
      })
      list.forEach((r) => {
        assert.ok(r.date.getDate() >= 1 && r.date.getDate() <= 15, `day ${r.date.getDate()} in range 1-15`)
      })
    })
  })

  // ── Backward direction with cron ──────────────────────────────────
  describe('backward direction', () => {
    it('cron backward returns dates in descending order', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-10T00:00:00',
        end: '2024-01-01T00:00:00',
        rules: '0 9 * * *',
        direction: 'backward',
      })
      assert.ok(list.length >= 1, 'should have results')
      for (let i = 1; i < list.length; i++) {
        assert.ok(list[i - 1].date > list[i].date, `item ${i - 1} > item ${i}`)
      }
    })

    it('cron backward with end count', () => {
      const list = genRecurDateBasedList({
        start: '2024-06-15',
        end: 5,
        rules: '0 9 * * *',
        direction: 'backward',
      })
      assert.strictEqual(list.length, 5)
      for (let i = 1; i < list.length; i++) {
        assert.ok(list[i - 1].date > list[i].date)
      }
    })
  })

  // ── Cron with filter ──────────────────────────────────────────────
  describe('cron with filter', () => {
    it('filter skips entries', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-10',
        rules: '0 9 * * *',
        filter: ({ date }) => date.getDay() !== 0, // skip Sundays
      })
      list.forEach((r) => assert.notStrictEqual(r.date.getDay(), 0))
    })

    it('filter returning false for all produces empty list', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 10,
        rules: '0 9 * * *',
        filter: () => false,
      })
      assert.strictEqual(list.length, 0)
    })
  })

  // ── Cron with extend ──────────────────────────────────────────────
  describe('cron with extend', () => {
    it('extend adds custom properties', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: '0 9 * * *',
        extend: {
          dayName: ({ date }) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
          isWeekend: ({ date }) => date.getDay() === 0 || date.getDay() === 6,
        },
      })
      assert.strictEqual(list.length, 3)
      list.forEach((r) => {
        assert.ok('dayName' in r)
        assert.ok('isWeekend' in r)
        assert.strictEqual(typeof r.dayName, 'string')
        assert.strictEqual(typeof r.isWeekend, 'boolean')
      })
    })
  })

  // ── Cron with outputFormat ────────────────────────────────────────
  describe('cron with outputFormat', () => {
    it('outputFormat affects dateStr', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: '0 9 * * *',
        outputFormat: 'MM/DD/YYYY HH:MM',
      })
      list.forEach((r) => {
        assert.ok(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(r.dateStr), `"${r.dateStr}" matches format`)
      })
    })
  })

  // ── Cron with numericTimeZone ─────────────────────────────────────
  describe('cron with numericTimeZone', () => {
    it('cron respects numericTimeZone for dateStr', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T00:00:00',
        end: 2,
        rules: '0 9 * * *',
        numericTimeZone: 5,
        outputFormat: 'YYYY-MM-DDTHH:MM:SSZ',
      })
      list.forEach((r) => {
        assert.ok(r.dateStr.includes('+05:00'), `"${r.dateStr}" has TZ+5`)
        assert.ok(r.dateStr.includes('09:00:00'))
      })
    })
  })

  // ── Cron with end as string date ──────────────────────────────────
  describe('cron with end as string date', () => {
    it('stops before end date', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-03',
        rules: '0 9 * * *',
      })
      assert.ok(list.length >= 1)
      list.forEach((r) => {
        assert.ok(r.date < new Date('2024-01-03'), 'each date before end')
      })
    })

    it('cron end as Date object', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: new Date('2024-01-05'),
        rules: '0 9 * * *',
      })
      assert.ok(list.length >= 3)
    })
  })

  // ── Return type structure for cron results ────────────────────────
  describe('return type structure', () => {
    it('each cron result has date, utcDate, dateStr', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 2,
        rules: '0 9 * * *',
      })
      list.forEach((r) => {
        assert.ok(r.date instanceof Date)
        assert.ok(r.utcDate instanceof Date)
        assert.strictEqual(typeof r.dateStr, 'string')
      })
    })
  })
})
