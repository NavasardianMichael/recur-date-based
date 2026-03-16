import { describe, it } from 'node:test'
import assert from 'node:assert'
import { genRecurDateBasedList } from '../dist/index.mjs'

describe('genRecurDateBasedList - validation', () => {
  // ── Invalid start ─────────────────────────────────────────────────
  describe('invalid start', () => {
    it('throws on non-date string', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: 'not-a-date', end: 5, rules: [{ unit: 'day', portion: 1 }] }),
        /start|Invalid/i
      )
    })

    it('throws on random garbage string', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: 'abc123', end: 5, rules: [{ unit: 'day', portion: 1 }] }),
        /start|Invalid/i
      )
    })

    it('onError captures start error', () => {
      let msg = ''
      genRecurDateBasedList({
        start: 'bad-date',
        end: 5,
        rules: [{ unit: 'day', portion: 1 }],
        onError: (e) => {
          msg = e.message
        },
      })
      assert.ok(msg.includes('start') || msg.includes('Invalid'), `got: "${msg}"`)
    })
  })

  // ── Invalid end ───────────────────────────────────────────────────
  describe('invalid end', () => {
    it('throws on non-date string', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 'not-a-date', rules: [{ unit: 'day', portion: 1 }] }),
        /end|Invalid/i
      )
    })

    it('throws on NaN', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: NaN, rules: [{ unit: 'day', portion: 1 }] }),
        /end|Invalid/i
      )
    })

    it('throws on number > 100_000', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 100_001, rules: [{ unit: 'day', portion: 1 }] }),
        /end|Invalid/i
      )
    })

    it('cron rules require end to be provided', () => {
      assert.throws(() => genRecurDateBasedList({ start: '2024-01-01', rules: '0 9 * * *' }), /end|required/i)
    })
  })

  // ── Invalid rules ─────────────────────────────────────────────────
  describe('invalid rules', () => {
    it('invalid cron string throws', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: 'invalid cron' }),
        /cron|Invalid/i
      )
    })

    it('cron with wrong number of fields throws', () => {
      assert.throws(() => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: '0 9 *' }), /cron|Invalid/i)
    })

    it('cron with out-of-range values throws', () => {
      assert.throws(() => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: '60 9 * * *' }), /cron|Invalid/i)
    })

    it('rules with invalid unit throws', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: [{ unit: 'invalid' as any, portion: 1 }] }),
        /unit|rules|Invalid/i
      )
    })

    it('rules with non-integer portion throws', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: [{ unit: 'day', portion: 1.5 }] }),
        /portion|rules|Invalid/i
      )
    })

    it('rules with portion = 0 throws', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: [{ unit: 'day', portion: 0 }] }),
        /portion|rules|Invalid/i
      )
    })

    it('rules with negative portion throws', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: [{ unit: 'day', portion: -1 }] }),
        /portion|rules|backward|Invalid/i
      )
    })

    it('rules with NaN portion throws', () => {
      assert.throws(
        () => genRecurDateBasedList({ start: '2024-01-01', end: 5, rules: [{ unit: 'day', portion: NaN }] }),
        /portion|rules|Invalid/i
      )
    })
  })

  // ── Invalid direction ─────────────────────────────────────────────
  describe('invalid direction', () => {
    it('throws on invalid direction string', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            direction: 'sideways' as any,
          }),
        /direction|Invalid/i
      )
    })
  })

  // ── Invalid numericTimeZone ───────────────────────────────────────
  describe('invalid numericTimeZone', () => {
    it('throws on non-integer', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            numericTimeZone: 1.5,
          }),
        /numericTimeZone|timezone|Invalid/i
      )
    })

    it('throws on value < -12', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            numericTimeZone: -13,
          }),
        /numericTimeZone|timezone|Invalid/i
      )
    })

    it('throws on value > 12', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            numericTimeZone: 13,
          }),
        /numericTimeZone|timezone|Invalid/i
      )
    })

    it('throws on NaN', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            numericTimeZone: NaN,
          }),
        /numericTimeZone|timezone|Invalid/i
      )
    })

    it('accepts boundary value -12', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: -12,
      })
      assert.strictEqual(list.length, 1)
    })

    it('accepts boundary value 12', () => {
      const list = genRecurDateBasedList({
        start: '2024-01-01',
        end: 1,
        rules: [{ unit: 'day', portion: 1 }],
        numericTimeZone: 12,
      })
      assert.strictEqual(list.length, 1)
    })
  })

  // ── Invalid filter ────────────────────────────────────────────────
  describe('invalid filter', () => {
    it('throws when filter is not a function', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            filter: 'not-a-function' as any,
          }),
        /filter|function/i
      )
    })
  })

  // ── Invalid extend ────────────────────────────────────────────────
  describe('invalid extend', () => {
    it('throws when extend is not an object', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            extend: 'not-an-object' as any,
          }),
        /extend|object/i
      )
    })
  })

  // ── Invalid onError ───────────────────────────────────────────────
  describe('invalid onError', () => {
    it('throws when onError is not a function', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            onError: 'not-a-function' as any,
          }),
        /onError|function/i
      )
    })
  })

  // ── Invalid outputFormat ──────────────────────────────────────────
  describe('invalid outputFormat', () => {
    it('throws on unsupported format string', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            outputFormat: 'NOT-A-FORMAT' as any,
          }),
        /outputFormat|format|Invalid/i
      )
    })

    it('throws on non-string outputFormat', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            outputFormat: 123 as any,
          }),
        /outputFormat|Invalid/i
      )
    })
  })

  // ── Invalid localeString ──────────────────────────────────────────
  describe('invalid localeString', () => {
    it('throws when localeString is not an object', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            localeString: 'bad' as any,
          }),
        /localeString|object/i
      )
    })
  })

  // ── Conflicting options ───────────────────────────────────────────
  describe('conflicting options', () => {
    it('numericTimeZone + localeString.formatOptions.timeZone conflict', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            numericTimeZone: 5,
            localeString: { formatOptions: { timeZone: 'UTC' } },
          }),
        /conflict|timeZone|numericTimeZone/i
      )
    })

    it('outputFormat + localeString.formatOptions conflict', () => {
      assert.throws(
        () =>
          genRecurDateBasedList({
            start: '2024-01-01',
            end: 5,
            rules: [{ unit: 'day', portion: 1 }],
            outputFormat: 'YYYY-MM-DD',
            localeString: { formatOptions: { year: 'numeric', month: 'long' } },
          }),
        /conflict|outputFormat|formatOptions/i
      )
    })
  })

  // ── Multiple validation errors ────────────────────────────────────
  describe('multiple validation errors', () => {
    it('first invalid field is reported', () => {
      let msg = ''
      genRecurDateBasedList({
        start: 'bad',
        end: 'also-bad',
        rules: [{ unit: 'day', portion: 1 }],
        onError: (e) => {
          msg = e.message
        },
      })
      // At least one error should be caught
      assert.ok(msg.length > 0, 'error message is present')
    })
  })
})
