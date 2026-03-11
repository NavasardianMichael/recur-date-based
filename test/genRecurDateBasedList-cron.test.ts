import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - cron rules', () => {
  it('cron: every day at 9am (0 9 * * *)', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01T00:00:00',
      end: '2024-01-05T23:59:59',
      rules: '0 9 * * *',
    })
    assert.ok(list.length >= 4)
    list.forEach((r) => {
      assert.strictEqual(r.date.getUTCHours(), 9, 'date hour matches cron (date = dateStr moment)')
      assert.strictEqual(r.date.getUTCMinutes(), 0)
    })
  })

  it('cron: weekdays only (0 9 * * 1-5)', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01',
      end: '2024-01-15',
      rules: '0 9 * * 1-5',
    })
    list.forEach((r) => {
      const dow = r.date.getUTCDay()
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

  it('cron: every 15 minutes (*/15 * * * *)', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01T09:00:00',
      end: '2024-01-01T10:00:00',
      rules: '*/15 * * * *',
    })
    assert.ok(list.length >= 4)
    list.forEach((r) => assert.strictEqual(r.date.getUTCMinutes() % 15, 0))
  })

  it('cron: 15th of every month (0 9 15 * *) - day-of-month step, day-by-day iteration', () => {
    const list = genRecurDateBasedList({
      start: '2024-01-01T00:00:00',
      end: '2024-06-01T00:00:00',
      rules: '0 9 15 * *',
    })
    assert.strictEqual(list.length, 5)
    const expected = [
      { month: 0, day: 15 },
      { month: 1, day: 15 },
      { month: 2, day: 15 },
      { month: 3, day: 15 },
      { month: 4, day: 15 },
    ]
    list.forEach((r, i) => {
      assert.strictEqual(r.date.getUTCDate(), expected[i].day, `occurrence ${i} should be on 15th`)
      assert.strictEqual(r.date.getUTCMonth(), expected[i].month, `occurrence ${i} should be correct month`)
      assert.strictEqual(r.date.getUTCHours(), 9, 'date matches dateStr (same moment)')
      assert.strictEqual(r.date.getUTCMinutes(), 0)
    })
  })
})
