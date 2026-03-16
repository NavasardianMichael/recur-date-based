import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

const MACHINE_TZ_OFFSET = -(new Date().getTimezoneOffset() / 60) // e.g. 4 for UTC+4

describe('genRecurDateBasedList - timezone handling', () => {
  describe('string start + numericTimeZone', () => {
    it('dateStr preserves the input wall-clock time', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T09:00:00',
        end: 2,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 1,
      })
      assert.strictEqual(list[0].dateStr, '2025-03-01T09:00:00')
      assert.strictEqual(list[1].dateStr, '2025-03-02T09:00:00')
    })

    it('date.getHours() returns the wall-clock hour from dateStr', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T16:30:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 1,
      })
      assert.strictEqual(list[0].date.getHours(), 16, 'getHours() = 16 (wall-clock)')
      assert.strictEqual(list[0].date.getMinutes(), 30, 'getMinutes() = 30')
    })

    it('utcDate is wall-clock minus numericTimeZone offset', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T09:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 1,
      })
      // 09:00 in TZ+1 → UTC = 08:00
      assert.strictEqual(list[0].utcDate.getUTCHours(), 8)
      assert.strictEqual(list[0].utcDate.getUTCMinutes(), 0)
    })

    it('utcDate with negative timezone', () => {
      const list = genRecurDateBasedList({
        start: '2025-06-15T02:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: -5,
      })
      // 02:00 in TZ-5 → UTC = 07:00
      assert.strictEqual(list[0].utcDate.getUTCHours(), 7)
    })

    it('utcDate with timezone 0 equals wall-clock', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T14:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 0,
      })
      // 14:00 in TZ+0 → UTC = 14:00
      assert.strictEqual(list[0].utcDate.getUTCHours(), 14)
    })

    it('date and dateStr agree on all components', () => {
      const list = genRecurDateBasedList({
        start: '2025-07-20T23:45:30',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 5,
      })
      const r = list[0]
      assert.strictEqual(r.date.getFullYear(), 2025)
      assert.strictEqual(r.date.getMonth(), 6) // July = 6
      assert.strictEqual(r.date.getDate(), 20)
      assert.strictEqual(r.date.getHours(), 23)
      assert.strictEqual(r.date.getMinutes(), 45)
      assert.strictEqual(r.date.getSeconds(), 30)
      assert.strictEqual(r.dateStr, '2025-07-20T23:45:30')
    })
  })

  describe('string start without numericTimeZone', () => {
    it('date is in user local timezone (same as new Date(string))', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T12:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
      })
      const expected = new Date('2025-03-01T12:00:00')
      assert.strictEqual(list[0].date.getHours(), expected.getHours())
      assert.strictEqual(list[0].date.getMinutes(), expected.getMinutes())
      assert.strictEqual(list[0].date.getDate(), expected.getDate())
    })

    it('numericTimeZone defaults to machine timezone', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T12:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
      })
      // utcDate should equal wall-clock minus machine TZ offset
      assert.strictEqual(list[0].utcDate.getUTCHours(), (12 - MACHINE_TZ_OFFSET + 24) % 24)
    })

    it('dateStr matches the input face value', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T09:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(list[0].dateStr, '2025-03-01T09:00:00')
    })
  })

  describe('date object start + numericTimeZone', () => {
    it('transforms Date to target timezone wall-clock', () => {
      // Create a Date at 12:00 local time
      const inputDate = new Date(2025, 2, 1, 12, 0, 0) // Mar 1 2025, 12:00 local
      const list = genRecurDateBasedList({
        start: inputDate,
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 0,
      })
      // Should transform from machine TZ to UTC (TZ+0)
      // 12:00 local in UTC+4 → internal UTC is 08:00 → shift to TZ+0 wall-clock = 08:00
      const expectedHours = (12 - MACHINE_TZ_OFFSET + 24) % 24
      assert.strictEqual(list[0].date.getHours(), expectedHours)
    })
  })

  describe('date object start without numericTimeZone', () => {
    it('keeps date in user local timezone unchanged', () => {
      const inputDate = new Date(2025, 2, 1, 15, 30, 0) // Mar 1 2025, 15:30 local
      const list = genRecurDateBasedList({
        start: inputDate,
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
      })
      assert.strictEqual(list[0].date.getHours(), 15)
      assert.strictEqual(list[0].date.getMinutes(), 30)
    })
  })

  describe('utcDate correctness across timezones', () => {
    it('TZ+0: utcDate equals wall-clock', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T10:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 0,
      })
      assert.strictEqual(list[0].utcDate.getUTCHours(), 10)
    })

    it('TZ+5: utcDate is 5 hours behind wall-clock', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T10:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 5,
      })
      assert.strictEqual(list[0].utcDate.getUTCHours(), 5)
    })

    it('TZ-8: utcDate is 8 hours ahead of wall-clock', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T10:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: -8,
      })
      assert.strictEqual(list[0].utcDate.getUTCHours(), 18)
    })

    it('TZ+12: utcDate crosses to previous day', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T03:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 12,
      })
      // 03:00 in TZ+12 → UTC = 15:00 previous day
      assert.strictEqual(list[0].utcDate.getUTCHours(), 15)
      assert.strictEqual(list[0].utcDate.getUTCDate(), 28) // Feb 28
    })
  })

  describe('filter and extend use correct wall-clock values', () => {
    it('filter receives date with correct getHours()', () => {
      const seenHours: number[] = []
      genRecurDateBasedList({
        start: '2025-03-01T09:00:00',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 1,
        filter: ({ date }) => {
          seenHours.push(date.getHours())
          return true
        },
      })
      assert.deepStrictEqual(seenHours, [9, 9, 9])
    })

    it('extend receives date with correct getDay()', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-03T09:00:00', // Monday
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 2,
        extend: {
          weekday: ({ date }) => date.getDay(),
        },
      })
      // Mon=1, Tue=2, Wed=3, Thu=4, Fri=5
      assert.deepStrictEqual(
        list.map((r) => r.weekday),
        [1, 2, 3, 4, 5]
      )
    })

    it('extend can access utcDate properly', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T09:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 3,
        extend: {
          utcHour: ({ utcDate }) => utcDate.getUTCHours(),
        },
      })
      // 09:00 in TZ+3 → UTC = 06:00
      assert.strictEqual(list[0].utcHour, 6)
    })
  })

  describe('multi-day recurrence preserves timezone consistency', () => {
    it('all items have same wall-clock time across days', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T16:30:00',
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 1,
      })
      assert.strictEqual(list.length, 5)
      list.forEach((r, i) => {
        assert.strictEqual(r.date.getHours(), 16, `item ${i}: getHours() = 16`)
        assert.strictEqual(r.date.getMinutes(), 30, `item ${i}: getMinutes() = 30`)
        assert.strictEqual(r.utcDate.getUTCHours(), 15, `item ${i}: utcDate UTC hour = 15`)
      })
    })

    it('date increments by 1 day correctly', () => {
      const list = genRecurDateBasedList({
        start: '2025-03-01T16:30:00',
        end: 3,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 1,
      })
      assert.strictEqual(list[0].date.getDate(), 1)
      assert.strictEqual(list[1].date.getDate(), 2)
      assert.strictEqual(list[2].date.getDate(), 3)
    })
  })

  describe('Z token in outputFormat uses numericTimeZone', () => {
    it('Z reflects positive numericTimeZone, not machine offset', () => {
      const list = genRecurDateBasedList({
        start: '2025-06-01T09:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 5,
        outputFormat: 'YYYY-MM-DDTHH:MM:SSZ',
      })
      assert.strictEqual(list[0].dateStr, '2025-06-01T09:00:00+05:00')
    })

    it('Z reflects negative numericTimeZone', () => {
      const list = genRecurDateBasedList({
        start: '2025-06-01T14:30:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: -8,
        outputFormat: 'YYYY-MM-DDTHH:MM:SSZ',
      })
      assert.strictEqual(list[0].dateStr, '2025-06-01T14:30:00-08:00')
    })

    it('Z reflects numericTimeZone 0 as +00:00', () => {
      const list = genRecurDateBasedList({
        start: '2025-06-01T12:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 0,
        outputFormat: 'HH:MM:SS Z',
      })
      assert.strictEqual(list[0].dateStr, '12:00:00 +00:00')
    })

    it('format without Z is unaffected by numericTimeZone', () => {
      const list = genRecurDateBasedList({
        start: '2025-06-01T09:00:00',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 5,
        outputFormat: 'YYYY-MM-DDTHH:MM:SS',
      })
      assert.strictEqual(list[0].dateStr, '2025-06-01T09:00:00')
    })
  })
})
