import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - filter & extend', () => {
  // ── Filter ────────────────────────────────────────────────────────
  describe('filter', () => {
    it('filter skips dates where callback returns false', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 10,
        rules: [{ unit: 'day', portion: 1 }],
        filter: ({ date }) => date.getDate() % 2 === 1, // odd days only
      })
      assert.ok(list.length < 10, 'some dates filtered out')
      list.forEach((r) => assert.strictEqual(r.date.getDate() % 2, 1))
    })

    it('filter returning false for all produces empty array', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        filter: () => false,
      })
      assert.strictEqual(list.length, 0)
    })

    it('filter returning true for all keeps everything', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        filter: () => true,
      })
      assert.strictEqual(list.length, 5)
    })

    it('filter can access dateStr', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
        filter: ({ dateStr }) => dateStr !== '2024-01-03',
      })
      assert.ok(!list.some((r) => r.dateStr === '2024-01-03'), 'Jan 3 excluded')
      assert.strictEqual(list.length, 4)
    })

    it('filter can access utcDate', () => {
      const seenUtcHours: number[] = []
      genRecurDateBasedList({
        start: '2024-01-01T12:00:00',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 5,
        filter: ({ utcDate }) => {
          seenUtcHours.push(utcDate.getUTCHours())
          return true
        },
      })
      // 12:00 in TZ+5 → UTC 07:00
      assert.deepStrictEqual(seenUtcHours, [7, 7, 7])
    })

    it('filter skip weekends (step-based)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01', // Monday
        end: '2024-01-15',
        rules: [{ unit: 'day', portion: 1 }],
        filter: ({ date }) => {
          const dow = date.getDay()
          return dow !== 0 && dow !== 6 // skip Sat/Sun
        },
      })
      list.forEach((r) => {
        const dow = r.date.getDay()
        assert.ok(dow >= 1 && dow <= 5, `day ${dow} should be weekday`)
      })
    })

    it('filter receives cloned date (mutation-safe)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        filter: ({ date }) => {
          date.setFullYear(2000) // try to mutate
          return true
        },
      })
      // List dates should NOT be affected by mutation
      list.forEach((r) => {
        assert.strictEqual(r.date.getFullYear(), 2024, 'date not mutated by filter')
      })
    })

    it('filter with backward direction', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-10',
        end: '2024-01-01',
        rules: [{ unit: 'day', portion: 1 }],
        direction: 'backward',
        filter: ({ date }) => date.getDate() % 2 === 0, // even days only
      })
      list.forEach((r) => assert.strictEqual(r.date.getDate() % 2, 0))
    })
  })

  // ── Extend ────────────────────────────────────────────────────────
  describe('extend', () => {
    it('extend adds custom properties to each item', () => {
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
      assert.strictEqual(typeof list[0].iso, 'string')
    })

    it('extend can return different types per key', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        extend: {
          aString: () => 'hello',
          aNumber: () => 42,
          aBool: () => true,
          anObject: () => ({ nested: true }),
          anArray: () => [1, 2, 3],
        },
      })
      assert.strictEqual(list[0].aString, 'hello')
      assert.strictEqual(list[0].aNumber, 42)
      assert.strictEqual(list[0].aBool, true)
      assert.deepStrictEqual(list[0].anObject, { nested: true })
      assert.deepStrictEqual(list[0].anArray, [1, 2, 3])
    })

    it('extend receives correct date per iteration', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        extend: {
          dayNum: ({ date }) => date.getDate(),
        },
      })
      assert.strictEqual(list[0].dayNum, 1)
      assert.strictEqual(list[1].dayNum, 2)
      assert.strictEqual(list[2].dayNum, 3)
    })

    it('extend receives utcDate', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01T09:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 3,
        extend: {
          utcHour: ({ utcDate }) => utcDate.getUTCHours(),
        },
      })
      // 09:00 TZ+3 → UTC 06:00
      assert.strictEqual(list[0].utcHour, 6)
    })

    it('extend receives dateStr', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
        extend: {
          formatted: ({ dateStr }) => `Date: ${dateStr}`,
        },
      })
      assert.strictEqual(list[0].formatted, 'Date: 2024-01-01')
    })

    it('extend with empty object does not add extra properties', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        extend: {},
      })
      const keys = Object.keys(list[0])
      assert.deepStrictEqual(keys.sort(), ['date', 'dateStr', 'utcDate'].sort())
    })

    it('extend callback receives cloned date (mutation-safe)', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        extend: {
          modified: ({ date }) => {
            date.setFullYear(2000) // mutate
            return date.getFullYear()
          },
        },
      })
      // The extend callback has its own cloned date; result dates should be 2024
      list.forEach((r) => {
        assert.strictEqual(r.date.getFullYear(), 2024)
      })
    })

    it('extend with backward direction', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-05',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        direction: 'backward',
        extend: {
          dayNum: ({ date }) => date.getDate(),
        },
      })
      assert.strictEqual(list[0].dayNum, 5)
      assert.strictEqual(list[1].dayNum, 4)
      assert.strictEqual(list[2].dayNum, 3)
    })
  })

  // ── Filter + Extend combined ──────────────────────────────────────
  describe('filter + extend combined', () => {
    it('extend is only applied to items that pass filter', () => {
      let extendCallCount = 0
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: '2024-01-06',
        rules: [{ unit: 'day', portion: 1 }],
        filter: ({ date }) => date.getDate() % 2 === 1, // odd days: 1, 3, 5
        extend: {
          idx: () => {
            extendCallCount++
            return extendCallCount
          },
        },
      })
      assert.strictEqual(list.length, 3, 'only odd-day items')
      assert.strictEqual(extendCallCount, 3, 'extend called 3 times')
      list.forEach((r) => {
        assert.strictEqual(r.date.getDate() % 2, 1)
        assert.ok('idx' in r)
      })
    })

    it('filter + extend + outputFormat all together', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 7,
        rules: [{ unit: 'day', portion: 1 }],
        outputFormat: 'YYYY-MM-DD',
        filter: ({ date }) => date.getDay() !== 0, // skip Sunday
        extend: {
          dayName: ({ date }) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        },
      })
      list.forEach((r) => {
        assert.notStrictEqual(r.dayName, 'Sun')
        assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(r.dateStr))
      })
    })

    it('filter + extend with cron rules', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 10,
        rules: '0 9 * * *',
        filter: ({ date }) => date.getDay() !== 6, // skip Saturday
        extend: {
          month: ({ date }) => date.getMonth() + 1,
        },
      })
      list.forEach((r) => {
        assert.notStrictEqual(r.date.getDay(), 6)
        assert.ok('month' in r)
      })
    })
  })
})
