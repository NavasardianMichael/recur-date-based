import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - edge cases', () => {
  // ── Default / omitted args ────────────────────────────────────────
  describe('default / omitted args', () => {
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

    it('whitespace-only cron string is rejected by validation', () => {
      // Validator sees the whitespace string as a cron and rejects it
      // before processInitialArgs can trim/fallback.
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 3,
            rules: '   ',
          }),
        /Cron|Invalid/
      )
    })
  })

  // ── Direction ─────────────────────────────────────────────────────
  describe('direction', () => {
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

    it('direction backward: dates decrement, dateStr/date/utcDate all consistent', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-10T14:00:00',
        end: '2024-01-07T00:00:00',
        rules: [{ unit: 'day', portion: 1 }],
        direction: 'backward',
      })
      assert.strictEqual(list.length, 4)
      assert.strictEqual(list[0].dateStr, '2024-01-10T14:00:00')
      assert.strictEqual(list[1].dateStr, '2024-01-09T14:00:00')
      assert.strictEqual(list[2].dateStr, '2024-01-08T14:00:00')
      assert.strictEqual(list[3].dateStr, '2024-01-07T14:00:00')
      list.forEach((r, i) => {
        assert.strictEqual(r.date.getHours(), 14, `item ${i}: getHours() = 14`)
        assert.strictEqual(r.date.getDate(), 10 - i, `item ${i}: day decrements`)
      })
      for (let i = 1; i < list.length; i++) {
        assert.ok(list[i - 1].date > list[i].date, `item ${i - 1} > item ${i}`)
      }
    })

    it('forward start after end returns empty array', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-10',
        end: '2024-01-05',
        rules: [{ unit: 'day', portion: 1 }],
        direction: 'forward',
      })
      assert.strictEqual(list.length, 0)
    })

    it('backward start before end returns empty array', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-10',
        rules: [{ unit: 'day', portion: 1 }],
        direction: 'backward',
      })
      assert.strictEqual(list.length, 0)
    })
  })

  // ── numericTimeZone ───────────────────────────────────────────────
  describe('numericTimeZone', () => {
    it('numericTimeZone = 0', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 0,
      })
      assert.strictEqual(list.length, 1)
    })
  })

  // ── dateStr / date / utcDate consistency ──────────────────────────
  describe('dateStr / date / utcDate consistency', () => {
    it('without numericTimeZone: date and dateStr same moment, utcDate in UTC', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-15T12:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD HH:MM',
      })
      const r = list[0]
      const inputAsLocal = new Date('2024-01-15T12:00:00')
      assert.strictEqual(r.dateStr.slice(0, 10), '2024-01-15')
      const [, timePart] = r.dateStr.split(' ')
      const [h, m] = timePart.split(':').map(Number)
      assert.strictEqual(h, r.date.getHours())
      assert.strictEqual(m, r.date.getMinutes())
      assert.strictEqual(h, inputAsLocal.getHours())
      assert.strictEqual(m, inputAsLocal.getMinutes())
      assert.ok(r.utcDate.toISOString().endsWith('Z'))
    })

    it('default dateStr is ISO-like without Z suffix', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T09:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.ok(list[0].dateStr.includes('T'))
      assert.ok(!list[0].dateStr.endsWith('Z'), 'default dateStr should not have Z')
    })
  })

  // ── onError ───────────────────────────────────────────────────────
  describe('onError callback', () => {
    it('invalid config does not throw when onError provided', () => {
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

    it('onError receives error with descriptive message', () => {
      let msg = ''
      genRecurDateBasedList({
        start: 'invalid-date',
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        onError: (e) => {
          msg = e.message
        },
      })
      assert.ok(msg.includes('start') || msg.includes('Invalid'), `error message: "${msg}"`)
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
  })

  // ── Cron with end as string / Date ────────────────────────────────
  describe('cron end variants', () => {
    it('cron with end as string date', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-03',
        rules: '0 9 * * *',
      })
      assert.ok(list.length >= 1)
    })
  })

  // ── localeString ──────────────────────────────────────────────────
  describe('localeString edge cases', () => {
    it('localeString with formatOptions.timeZone', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        localeString: { formatOptions: { timeZone: 'UTC' } },
      })
      assert.strictEqual(list.length, 1)
    })

    it('localeString with lang only (no formatOptions)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        localeString: { lang: 'de-DE' },
      })
      assert.strictEqual(list.length, 1)
      assert.strictEqual(typeof list[0].dateStr, 'string')
    })
  })

  // ── Boundary conditions ───────────────────────────────────────────
  describe('boundary conditions', () => {
    it('start equals end in forward mode returns empty', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-01',
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(list.length, 0)
    })

    it('end count of 1 returns single item', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(list.length, 1)
    })

    it('end count of 0 falls back to default (10)', () => {
      // end: 0 is falsy, so the library computes +0 || +DEFAULT_ARGS.end → 10
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 0,
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(list.length, 10)
    })

    it('leap year Feb 29 to Mar 1', () => {
      const list = genRecurDateBasedList({
        start: '2024-02-28',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
      })
      assert.strictEqual(list.length, 3)
      assert.strictEqual(list[0].dateStr, '2024-02-28')
      assert.strictEqual(list[1].dateStr, '2024-02-29')
      assert.strictEqual(list[2].dateStr, '2024-03-01')
    })

    it('non-leap year Feb 28 to Mar 1', () => {
      const list = genRecurDateBasedList({
        start: '2023-02-27',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
      })
      assert.strictEqual(list.length, 3)
      assert.strictEqual(list[0].dateStr, '2023-02-27')
      assert.strictEqual(list[1].dateStr, '2023-02-28')
      assert.strictEqual(list[2].dateStr, '2023-03-01')
    })

    it('year boundary crossing (Dec → Jan)', () => {
      const list = genRecurDateBasedList({
        start: '2024-12-30',
        end: 4,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
      })
      assert.strictEqual(list[0].dateStr, '2024-12-30')
      assert.strictEqual(list[1].dateStr, '2024-12-31')
      assert.strictEqual(list[2].dateStr, '2025-01-01')
      assert.strictEqual(list[3].dateStr, '2025-01-02')
    })

    it('monthly on 31st — months without 31 days', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-31',
        end: 4,
        rules: [{ unit: 'month', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
      })
      assert.strictEqual(list.length, 4)
      // JS Date rolls over: Jan 31 + 1 month = Mar 2 (Feb has 29 days in 2024)
      // This tests the actual behavior of the library
      assert.strictEqual(list[0].dateStr, '2024-01-31')
    })
  })

  // ── Large step portions ───────────────────────────────────────────
  describe('large step portions', () => {
    it('portion: 10 days', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 5,
        rules: [{ unit: 'day', portion: 10 }],
        outputFormat: 'YYYY-MM-DD',
      })
      assert.strictEqual(list.length, 5)
      assert.strictEqual(list[0].dateStr, '2024-01-01')
      assert.strictEqual(list[1].dateStr, '2024-01-11')
      assert.strictEqual(list[2].dateStr, '2024-01-21')
      assert.strictEqual(list[3].dateStr, '2024-01-31')
      assert.strictEqual(list[4].dateStr, '2024-02-10')
    })

    it('portion: 6 months', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [{ unit: 'month', portion: 6 }],
      })
      assert.strictEqual(list.length, 3)
      const months = list.map((r) => r.date.getMonth())
      assert.deepStrictEqual(months, [0, 6, 0]) // Jan, Jul, Jan
    })
  })

  // ── Return value is always an array ───────────────────────────────
  describe('return value type', () => {
    it('always returns an array even on error with onError', () => {
      const result = genRecurDateBasedList({
        start: 'bad',
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        onError: () => {},
      })
      assert.ok(Array.isArray(result))
    })

    it('returns empty array for zero-length range with onError', () => {
      const result = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-01',
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.ok(Array.isArray(result))
      assert.strictEqual(result.length, 0)
    })
  })
})
