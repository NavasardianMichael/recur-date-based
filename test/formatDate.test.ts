import { describe, it } from 'node:test'
import assert from 'node:assert'
import { formatDate } from '../dist/index.mjs'

describe('formatDate', () => {
  // ── Date-only formats ──────────────────────────────────────────────
  describe('date-only formats', () => {
    const d = new Date('2024-03-05T14:09:07.123')

    it('YYYY-MM-DD', () => assert.strictEqual(formatDate(d, 'YYYY-MM-DD'), '2024-03-05'))
    it('YYYY-MM-D', () => assert.strictEqual(formatDate(d, 'YYYY-MM-D'), '2024-03-5'))
    it('YYYY-MM', () => assert.strictEqual(formatDate(d, 'YYYY-MM'), '2024-03'))
    it('MM/DD/YYYY', () => assert.strictEqual(formatDate(d, 'MM/DD/YYYY'), '03/05/2024'))
    it('MM/D/YYYY', () => assert.strictEqual(formatDate(d, 'MM/D/YYYY'), '03/5/2024'))
    it('M/DD/YYYY', () => assert.strictEqual(formatDate(d, 'M/DD/YYYY'), '3/05/2024'))
    it('M/D/YYYY', () => assert.strictEqual(formatDate(d, 'M/D/YYYY'), '3/5/2024'))
    it('DD/MM/YYYY', () => assert.strictEqual(formatDate(d, 'DD/MM/YYYY'), '05/03/2024'))
    it('D/MM/YYYY', () => assert.strictEqual(formatDate(d, 'D/MM/YYYY'), '5/03/2024'))
    it('DD/M/YYYY', () => assert.strictEqual(formatDate(d, 'DD/M/YYYY'), '05/3/2024'))
    it('D/M/YYYY', () => assert.strictEqual(formatDate(d, 'D/M/YYYY'), '5/3/2024'))
    it('DD-MM-YYYY', () => assert.strictEqual(formatDate(d, 'DD-MM-YYYY'), '05-03-2024'))
    it('D-MM-YYYY', () => assert.strictEqual(formatDate(d, 'D-MM-YYYY'), '5-03-2024'))
    it('MM-DD-YYYY', () => assert.strictEqual(formatDate(d, 'MM-DD-YYYY'), '03-05-2024'))
    it('M-DD-YYYY', () => assert.strictEqual(formatDate(d, 'M-DD-YYYY'), '3-05-2024'))
    it('MM-D-YYYY', () => assert.strictEqual(formatDate(d, 'MM-D-YYYY'), '03-5-2024'))
    it('M-D-YYYY', () => assert.strictEqual(formatDate(d, 'M-D-YYYY'), '3-5-2024'))
    it('YYYY/MM/DD', () => assert.strictEqual(formatDate(d, 'YYYY/MM/DD'), '2024/03/05'))
    it('YYYY/MM/D', () => assert.strictEqual(formatDate(d, 'YYYY/MM/D'), '2024/03/5'))
    it('DD.MM.YYYY', () => assert.strictEqual(formatDate(d, 'DD.MM.YYYY'), '05.03.2024'))
    it('D.MM.YYYY', () => assert.strictEqual(formatDate(d, 'D.MM.YYYY'), '5.03.2024'))
    it('YYYY.MM.DD', () => assert.strictEqual(formatDate(d, 'YYYY.MM.DD'), '2024.03.05'))
    it('YYYY.MM.D', () => assert.strictEqual(formatDate(d, 'YYYY.MM.D'), '2024.03.5'))
    it('D.M.YYYY', () => assert.strictEqual(formatDate(d, 'D.M.YYYY'), '5.3.2024'))
  })

  // ── 2-digit year formats ──────────────────────────────────────────
  describe('2-digit year formats', () => {
    const d = new Date('2024-03-05T14:09:07')

    it('YY/MM/DD', () => assert.strictEqual(formatDate(d, 'YY/MM/DD'), '24/03/05'))
    it('YY/MM/D', () => assert.strictEqual(formatDate(d, 'YY/MM/D'), '24/03/5'))
    it('YY-MM-DD', () => assert.strictEqual(formatDate(d, 'YY-MM-DD'), '24-03-05'))
    it('YY-MM-D', () => assert.strictEqual(formatDate(d, 'YY-MM-D'), '24-03-5'))
    it('DD.MM.YY', () => assert.strictEqual(formatDate(d, 'DD.MM.YY'), '05.03.24'))
    it('D.MM.YY', () => assert.strictEqual(formatDate(d, 'D.MM.YY'), '5.03.24'))
    it('MM/DD/YY', () => assert.strictEqual(formatDate(d, 'MM/DD/YY'), '03/05/24'))
    it('M/D/YY', () => assert.strictEqual(formatDate(d, 'M/D/YY'), '3/5/24'))
    it('DD/MM/YY', () => assert.strictEqual(formatDate(d, 'DD/MM/YY'), '05/03/24'))
    it('D/M/YY', () => assert.strictEqual(formatDate(d, 'D/M/YY'), '5/3/24'))
  })

  // ── Compact formats ───────────────────────────────────────────────
  describe('compact formats', () => {
    it('YYYYMMDD', () => {
      const d = new Date('2024-03-05T14:09:07')
      assert.strictEqual(formatDate(d, 'YYYYMMDD'), '20240305')
    })

    it('YYYYDDD (day of year)', () => {
      // Jan 5 is day 5; use local constructor to avoid TZ issues
      const d = new Date(2024, 0, 5, 12, 0, 0)
      assert.strictEqual(formatDate(d, 'YYYYDDD'), '2024005')
    })

    it('YYYYDDD for Dec 31 of leap year = 366', () => {
      const d = new Date(2024, 11, 31, 12, 0, 0)
      assert.strictEqual(formatDate(d, 'YYYYDDD'), '2024366')
    })
  })

  // ── Month name formats ────────────────────────────────────────────
  describe('month name formats (en-US)', () => {
    const d = new Date('2024-01-15T12:00:00')

    it('MMM DD, YYYY', () => {
      const out = formatDate(d, 'MMM DD, YYYY', 'en-US')
      assert.ok(out.includes('Jan'), `expected "Jan" in "${out}"`)
      assert.ok(out.includes('15'))
      assert.ok(out.includes('2024'))
    })

    it('MMM D, YYYY', () => {
      const d2 = new Date('2024-01-05T12:00:00')
      const out = formatDate(d2, 'MMM D, YYYY', 'en-US')
      assert.ok(out.includes('Jan'))
      assert.ok(out.includes('5'))
    })

    it('MMMM DD, YYYY', () => {
      const out = formatDate(d, 'MMMM DD, YYYY', 'en-US')
      assert.ok(out.includes('January'))
    })

    it('MMMM D, YYYY', () => {
      const out = formatDate(d, 'MMMM D, YYYY', 'en-US')
      assert.ok(out.includes('January'))
    })

    it('MMMM YYYY', () => {
      const out = formatDate(d, 'MMMM YYYY', 'en-US')
      assert.strictEqual(out, 'January 2024')
    })

    it('MMM YYYY', () => {
      const out = formatDate(d, 'MMM YYYY', 'en-US')
      assert.ok(out.includes('Jan'))
      assert.ok(out.includes('2024'))
    })

    it('DD MMM YYYY', () => {
      const out = formatDate(d, 'DD MMM YYYY', 'en-US')
      assert.ok(out.includes('15'))
      assert.ok(out.includes('Jan'))
    })

    it('D MMM YYYY', () => {
      const d2 = new Date('2024-01-05T12:00:00')
      const out = formatDate(d2, 'D MMM YYYY', 'en-US')
      assert.ok(out.includes('5'))
      assert.ok(out.includes('Jan'))
    })

    it('DD MMMM YYYY', () => {
      const out = formatDate(d, 'DD MMMM YYYY', 'en-US')
      assert.ok(out.includes('January'))
    })

    it('D MMMM YYYY', () => {
      const out = formatDate(d, 'D MMMM YYYY', 'en-US')
      assert.ok(out.includes('January'))
    })

    it('MMMM DD, YYYY HH:MM', () => {
      const out = formatDate(d, 'MMMM DD, YYYY HH:MM', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('12:00'))
    })

    it('MMMM DD, YYYY HH:MM:SS', () => {
      const out = formatDate(d, 'MMMM DD, YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('12:00:00'))
    })

    it('MMMM DD, YYYY HH:MM A', () => {
      const out = formatDate(d, 'MMMM DD, YYYY HH:MM A', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('PM'))
    })

    it('MMMM DD, YYYY HH:MM:SS A', () => {
      const out = formatDate(d, 'MMMM DD, YYYY HH:MM:SS A', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('PM'))
    })

    it('DD MMMM YYYY HH:MM', () => {
      const out = formatDate(d, 'DD MMMM YYYY HH:MM', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('12:00'))
    })

    it('DD MMMM YYYY HH:MM:SS', () => {
      const out = formatDate(d, 'DD MMMM YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('12:00:00'))
    })

    it('DD MMMM YYYY HH:MM A', () => {
      const out = formatDate(d, 'DD MMMM YYYY HH:MM A', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('PM'))
    })

    it('DD MMMM YYYY HH:MM:SS A', () => {
      const out = formatDate(d, 'DD MMMM YYYY HH:MM:SS A', 'en-US')
      assert.ok(out.includes('January'))
      assert.ok(out.includes('PM'))
    })

    it('DD MMM YYYY HH:MM', () => {
      const out = formatDate(d, 'DD MMM YYYY HH:MM', 'en-US')
      assert.ok(out.includes('Jan'))
      assert.ok(out.includes('12:00'))
    })

    it('DD MMM YYYY HH:MM A', () => {
      const out = formatDate(d, 'DD MMM YYYY HH:MM A', 'en-US')
      assert.ok(out.includes('Jan'))
      assert.ok(out.includes('PM'))
    })

    it('DD MMM YYYY HH:MM:SS A', () => {
      const out = formatDate(d, 'DD MMM YYYY HH:MM:SS A', 'en-US')
      assert.ok(out.includes('Jan'))
      assert.ok(out.includes('PM'))
    })
  })

  // ── Weekday formats ───────────────────────────────────────────────
  describe('weekday formats (en-US)', () => {
    // 2024-01-15 is a Monday
    const monday = new Date('2024-01-15T12:00:00')

    it('EEEE, MMMM DD, YYYY', () => {
      const out = formatDate(monday, 'EEEE, MMMM DD, YYYY', 'en-US')
      assert.ok(out.includes('Monday'), `expected "Monday" in "${out}"`)
      assert.ok(out.includes('January'))
    })

    it('EEEE, MMMM D, YYYY', () => {
      const out = formatDate(monday, 'EEEE, MMMM D, YYYY', 'en-US')
      assert.ok(out.includes('Monday'))
    })

    it('EEEE, DD MMM YYYY', () => {
      const out = formatDate(monday, 'EEEE, DD MMM YYYY', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('Jan'))
    })

    it('EEEE, D MMM YYYY', () => {
      const out = formatDate(monday, 'EEEE, D MMM YYYY', 'en-US')
      assert.ok(out.includes('Monday'))
    })

    it('EEEE, MMMM DD, YYYY HH:MM', () => {
      const out = formatDate(monday, 'EEEE, MMMM DD, YYYY HH:MM', 'en-US')
      assert.ok(out.includes('Monday'), `expected "Monday" in "${out}"`)
      assert.ok(out.includes('January'))
      assert.ok(out.includes('12:00'))
    })

    it('EEEE, MMMM DD, YYYY HH:MM:SS', () => {
      const out = formatDate(monday, 'EEEE, MMMM DD, YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('12:00:00'))
    })

    it('EEEE, MMMM DD, YYYY HH:MM A', () => {
      const out = formatDate(monday, 'EEEE, MMMM DD, YYYY HH:MM A', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('PM'))
    })

    it('EEEE, MMMM DD, YYYY HH:MM:SS A', () => {
      const out = formatDate(monday, 'EEEE, MMMM DD, YYYY HH:MM:SS A', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('PM'))
    })

    it('EEEE, DD MMM YYYY HH:MM', () => {
      const out = formatDate(monday, 'EEEE, DD MMM YYYY HH:MM', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('Jan'))
      assert.ok(out.includes('12:00'))
    })

    it('EEEE, DD MMM YYYY HH:MM:SS', () => {
      const out = formatDate(monday, 'EEEE, DD MMM YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('12:00:00'))
    })

    it('EEEE, DD MMM YYYY HH:MM A', () => {
      const out = formatDate(monday, 'EEEE, DD MMM YYYY HH:MM A', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('PM'))
    })

    it('EEEE, DD MMM YYYY HH:MM:SS A', () => {
      const out = formatDate(monday, 'EEEE, DD MMM YYYY HH:MM:SS A', 'en-US')
      assert.ok(out.includes('Monday'))
      assert.ok(out.includes('PM'))
    })

    it('EEEE, D MMM YYYY HH:MM:SS', () => {
      const d5 = new Date('2024-01-05T09:30:45')
      const out = formatDate(d5, 'EEEE, D MMM YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('Friday'))
      assert.ok(out.includes('09:30:45'))
    })

    it('EEE, DD MMM YYYY HH:MM:SS', () => {
      const out = formatDate(monday, 'EEE, DD MMM YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('Mon'), `expected "Mon" in "${out}"`)
    })

    it('EEE, D MMM YYYY HH:MM:SS', () => {
      const out = formatDate(monday, 'EEE, D MMM YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('Mon'))
    })
  })

  // ── Time-only formats ─────────────────────────────────────────────
  describe('time-only formats', () => {
    const d = new Date('2024-01-01T14:05:30.123')

    it('HH:MM', () => assert.strictEqual(formatDate(d, 'HH:MM'), '14:05'))
    it('HH:MM:SS', () => assert.strictEqual(formatDate(d, 'HH:MM:SS'), '14:05:30'))
    it('HH:MM:SS.SSS', () => assert.strictEqual(formatDate(d, 'HH:MM:SS.SSS'), '14:05:30.123'))

    it('HH:MM A (PM)', () => {
      assert.strictEqual(formatDate(d, 'HH:MM A'), '02:05 PM')
    })

    it('HH:MM A (AM)', () => {
      const dAm = new Date('2024-01-01T09:05:30')
      assert.strictEqual(formatDate(dAm, 'HH:MM A'), '09:05 AM')
    })

    it('HH:MM:SS A', () => {
      assert.strictEqual(formatDate(d, 'HH:MM:SS A'), '02:05:30 PM')
    })

    it('HH:MM:SS.SSS A', () => {
      assert.strictEqual(formatDate(d, 'HH:MM:SS.SSS A'), '02:05:30.123 PM')
    })

    it('12:xx shows as 12 not 0 for AM/PM', () => {
      const noon = new Date('2024-01-01T12:30:00')
      assert.strictEqual(formatDate(noon, 'HH:MM A'), '12:30 PM')
    })

    it('00:xx shows as 12 AM', () => {
      const midnight = new Date('2024-01-01T00:30:00')
      assert.strictEqual(formatDate(midnight, 'HH:MM A'), '12:30 AM')
    })
  })

  // ── Date-time combined formats ────────────────────────────────────
  describe('date-time combined formats', () => {
    const d = new Date('2024-03-15T09:30:45.678')

    it('YYYY-MM-DD HH:MM', () => assert.strictEqual(formatDate(d, 'YYYY-MM-DD HH:MM'), '2024-03-15 09:30'))
    it('YYYY-MM-DD HH:MM:SS', () => assert.strictEqual(formatDate(d, 'YYYY-MM-DD HH:MM:SS'), '2024-03-15 09:30:45'))
    it('YYYY-MM-DD HH:MM:SS.SSS', () =>
      assert.strictEqual(formatDate(d, 'YYYY-MM-DD HH:MM:SS.SSS'), '2024-03-15 09:30:45.678'))
    it('YYYY-MM-DDTHH:MM', () => assert.strictEqual(formatDate(d, 'YYYY-MM-DDTHH:MM'), '2024-03-15T09:30'))
    it('YYYY-MM-DDTHH:MM:SS', () => assert.strictEqual(formatDate(d, 'YYYY-MM-DDTHH:MM:SS'), '2024-03-15T09:30:45'))
    it('YYYY-MM-DDTHH:MM:SS.SSS', () =>
      assert.strictEqual(formatDate(d, 'YYYY-MM-DDTHH:MM:SS.SSS'), '2024-03-15T09:30:45.678'))

    it('MM/DD/YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'MM/DD/YYYY HH:MM'), '03/15/2024 09:30'))
    it('MM/D/YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'MM/D/YYYY HH:MM'), '03/15/2024 09:30'))
    it('MM/DD/YYYY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'MM/DD/YYYY HH:MM:SS'), '03/15/2024 09:30:45'))
    it('MM/DD/YYYY HH:MM A', () => assert.strictEqual(formatDate(d, 'MM/DD/YYYY HH:MM A'), '03/15/2024 09:30 AM'))
    it('MM/D/YYYY HH:MM A', () => assert.strictEqual(formatDate(d, 'MM/D/YYYY HH:MM A'), '03/15/2024 09:30 AM'))

    it('DD/MM/YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'DD/MM/YYYY HH:MM'), '15/03/2024 09:30'))
    it('DD/MM/YYYY HH:MM A', () => assert.strictEqual(formatDate(d, 'DD/MM/YYYY HH:MM A'), '15/03/2024 09:30 AM'))
    it('DD/MM/YYYY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'DD/MM/YYYY HH:MM:SS'), '15/03/2024 09:30:45'))
    it('DD/MM/YYYY HH:MM:SS A', () =>
      assert.strictEqual(formatDate(d, 'DD/MM/YYYY HH:MM:SS A'), '15/03/2024 09:30:45 AM'))
    it('DD/MM/YYYY HH:MM:SS.SSS', () =>
      assert.strictEqual(formatDate(d, 'DD/MM/YYYY HH:MM:SS.SSS'), '15/03/2024 09:30:45.678'))
    it('DD/MM/YYYY HH:MM:SS.SSS A', () =>
      assert.strictEqual(formatDate(d, 'DD/MM/YYYY HH:MM:SS.SSS A'), '15/03/2024 09:30:45.678 AM'))

    it('DD-MM-YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'DD-MM-YYYY HH:MM'), '15-03-2024 09:30'))
    it('DD-MM-YYYY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'DD-MM-YYYY HH:MM:SS'), '15-03-2024 09:30:45'))
    it('DD-MM-YYYY HH:MM A', () => assert.strictEqual(formatDate(d, 'DD-MM-YYYY HH:MM A'), '15-03-2024 09:30 AM'))
    it('DD-MM-YYYY HH:MM:SS A', () =>
      assert.strictEqual(formatDate(d, 'DD-MM-YYYY HH:MM:SS A'), '15-03-2024 09:30:45 AM'))

    it('MM-DD-YYYY HH:MM A', () => assert.strictEqual(formatDate(d, 'MM-DD-YYYY HH:MM A'), '03-15-2024 09:30 AM'))
    it('MM-DD-YYYY HH:MM:SS A', () =>
      assert.strictEqual(formatDate(d, 'MM-DD-YYYY HH:MM:SS A'), '03-15-2024 09:30:45 AM'))

    it('MM/DD/YYYY HH:MM:SS A', () =>
      assert.strictEqual(formatDate(d, 'MM/DD/YYYY HH:MM:SS A'), '03/15/2024 09:30:45 AM'))

    it('M/DD/YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'M/DD/YYYY HH:MM'), '3/15/2024 09:30'))
    it('M/DD/YYYY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'M/DD/YYYY HH:MM:SS'), '3/15/2024 09:30:45'))
    it('M/D/YYYY HH:MM', () => {
      const d2 = new Date('2024-03-05T09:30:45')
      assert.strictEqual(formatDate(d2, 'M/D/YYYY HH:MM'), '3/5/2024 09:30')
    })

    it('DD/M/YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'DD/M/YYYY HH:MM'), '15/3/2024 09:30'))
    it('DD/M/YYYY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'DD/M/YYYY HH:MM:SS'), '15/3/2024 09:30:45'))
    it('D/MM/YYYY HH:MM:SS A', () =>
      assert.strictEqual(formatDate(d, 'D/MM/YYYY HH:MM:SS A'), '15/03/2024 09:30:45 AM'))

    it('YYYY/MM/DD HH:MM', () => assert.strictEqual(formatDate(d, 'YYYY/MM/DD HH:MM'), '2024/03/15 09:30'))
    it('YYYY/MM/DD HH:MM:SS', () => assert.strictEqual(formatDate(d, 'YYYY/MM/DD HH:MM:SS'), '2024/03/15 09:30:45'))
    it('YYYY/MM/D HH:MM', () => assert.strictEqual(formatDate(d, 'YYYY/MM/D HH:MM'), '2024/03/15 09:30'))

    it('YYYY-MM-D HH:MM', () => {
      const d2 = new Date('2024-03-05T09:30:45')
      assert.strictEqual(formatDate(d2, 'YYYY-MM-D HH:MM'), '2024-03-5 09:30')
    })
    it('YYYY-MM-D HH:MM:SS', () => {
      const d2 = new Date('2024-03-05T09:30:45')
      assert.strictEqual(formatDate(d2, 'YYYY-MM-D HH:MM:SS'), '2024-03-5 09:30:45')
    })

    it('DD.MM.YY HH:MM', () => assert.strictEqual(formatDate(d, 'DD.MM.YY HH:MM'), '15.03.24 09:30'))
    it('DD.MM.YY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'DD.MM.YY HH:MM:SS'), '15.03.24 09:30:45'))
    it('YYYY.MM.D HH:MM', () => assert.strictEqual(formatDate(d, 'YYYY.MM.D HH:MM'), '2024.03.15 09:30'))
    it('D.M.YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'D.M.YYYY HH:MM'), '15.3.2024 09:30'))
    it('D.M.YYYY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'D.M.YYYY HH:MM:SS'), '15.3.2024 09:30:45'))

    it('YY/MM/DD HH:MM', () => assert.strictEqual(formatDate(d, 'YY/MM/DD HH:MM'), '24/03/15 09:30'))
    it('YY/MM/DD HH:MM:SS', () => assert.strictEqual(formatDate(d, 'YY/MM/DD HH:MM:SS'), '24/03/15 09:30:45'))
    it('YY-MM-DD HH:MM', () => assert.strictEqual(formatDate(d, 'YY-MM-DD HH:MM'), '24-03-15 09:30'))
    it('MM/DD/YY HH:MM', () => assert.strictEqual(formatDate(d, 'MM/DD/YY HH:MM'), '03/15/24 09:30'))
    it('DD/MM/YY HH:MM', () => assert.strictEqual(formatDate(d, 'DD/MM/YY HH:MM'), '15/03/24 09:30'))
    it('DD/MM/YY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'DD/MM/YY HH:MM:SS'), '15/03/24 09:30:45'))

    it('DD.MM.YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'DD.MM.YYYY HH:MM'), '15.03.2024 09:30'))
    it('DD.MM.YYYY HH:MM:SS', () => assert.strictEqual(formatDate(d, 'DD.MM.YYYY HH:MM:SS'), '15.03.2024 09:30:45'))
    it('D.MM.YYYY HH:MM', () => assert.strictEqual(formatDate(d, 'D.MM.YYYY HH:MM'), '15.03.2024 09:30'))

    it('YYYY.MM.DD HH:MM:SS', () => assert.strictEqual(formatDate(d, 'YYYY.MM.DD HH:MM:SS'), '2024.03.15 09:30:45'))
    it('YYYY.MM.DD HH:MM', () => assert.strictEqual(formatDate(d, 'YYYY.MM.DD HH:MM'), '2024.03.15 09:30'))

    it('DD MMM YYYY HH:MM:SS', () => {
      const out = formatDate(d, 'DD MMM YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('09:30:45'))
    })

    it('EEE, DD MMM YYYY HH:MM:SS A', () => {
      const out = formatDate(d, 'EEE, DD MMM YYYY HH:MM:SS A', 'en-US')
      assert.ok(out.includes('Fri'))
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('AM'))
    })

    it('EEE, DD MMM YYYY HH:MM', () => {
      const out = formatDate(d, 'EEE, DD MMM YYYY HH:MM', 'en-US')
      assert.ok(out.includes('Fri'))
      assert.ok(out.includes('09:30'))
    })

    it('EEE, DD MMM YYYY HH:MM:SS.SSS', () => {
      const out = formatDate(d, 'EEE, DD MMM YYYY HH:MM:SS.SSS', 'en-US')
      assert.ok(out.includes('Fri'))
      assert.ok(out.includes('.678'))
    })

    it('EEE, DD MMM YYYY HH:MM:SS.SSS A', () => {
      const out = formatDate(d, 'EEE, DD MMM YYYY HH:MM:SS.SSS A', 'en-US')
      assert.ok(out.includes('Fri'))
      assert.ok(out.includes('.678'))
      assert.ok(out.includes('AM'))
    })

    it('MMM DD, YYYY HH:MM', () => {
      const out = formatDate(d, 'MMM DD, YYYY HH:MM', 'en-US')
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('09:30'))
    })

    it('MMM DD, YYYY HH:MM:SS', () => {
      const out = formatDate(d, 'MMM DD, YYYY HH:MM:SS', 'en-US')
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('09:30:45'))
    })

    it('MMM DD, YYYY HH:MM A', () => {
      const out = formatDate(d, 'MMM DD, YYYY HH:MM A', 'en-US')
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('AM'))
    })

    it('MMM DD, YYYY HH:MM:SS A', () => {
      const out = formatDate(d, 'MMM DD, YYYY HH:MM:SS A', 'en-US')
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('AM'))
    })

    it('MMM DD, YYYY HH:MM:SS.SSS', () => {
      const out = formatDate(d, 'MMM DD, YYYY HH:MM:SS.SSS', 'en-US')
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('.678'))
    })

    it('MMM DD, YYYY HH:MM:SS.SSS A', () => {
      const out = formatDate(d, 'MMM DD, YYYY HH:MM:SS.SSS A', 'en-US')
      assert.ok(out.includes('Mar'))
      assert.ok(out.includes('.678'))
      assert.ok(out.includes('AM'))
    })
  })

  // ── Timezone Z token formats ──────────────────────────────────────
  describe('Z token formats', () => {
    const d = new Date('2024-03-15T09:30:45.678')

    it('YYYY-MM-DDTHH:MMZ with numericTimeZone +5', () => {
      assert.strictEqual(formatDate(d, 'YYYY-MM-DDTHH:MMZ', 'en-US', 5), '2024-03-15T09:30+05:00')
    })

    it('YYYY-MM-DDTHH:MM:SSZ with numericTimeZone -3', () => {
      assert.strictEqual(formatDate(d, 'YYYY-MM-DDTHH:MM:SSZ', 'en-US', -3), '2024-03-15T09:30:45-03:00')
    })

    it('YYYY-MM-DDTHH:MM:SS.SSSZ with numericTimeZone 0', () => {
      assert.strictEqual(formatDate(d, 'YYYY-MM-DDTHH:MM:SS.SSSZ', 'en-US', 0), '2024-03-15T09:30:45.678+00:00')
    })

    it('YYYY-MM-DD HH:MM:SS Z with numericTimeZone 10', () => {
      assert.strictEqual(formatDate(d, 'YYYY-MM-DD HH:MM:SS Z', 'en-US', 10), '2024-03-15 09:30:45 +10:00')
    })

    it('HH:MM Z with numericTimeZone -8', () => {
      assert.strictEqual(formatDate(d, 'HH:MM Z', 'en-US', -8), '09:30 -08:00')
    })

    it('HH:MM:SS Z with numericTimeZone 0', () => {
      assert.strictEqual(formatDate(d, 'HH:MM:SS Z', 'en-US', 0), '09:30:45 +00:00')
    })
  })

  // ── Non-English locales ───────────────────────────────────────────
  describe('non-English locales', () => {
    const d = new Date('2024-03-15T12:00:00')

    it('French month name', () => {
      const out = formatDate(d, 'MMMM DD, YYYY', 'fr-FR')
      assert.ok(out.includes('mars'), `expected French month in "${out}"`)
    })

    it('German month name', () => {
      const out = formatDate(d, 'MMMM YYYY', 'de-DE')
      assert.ok(out.includes('März') || out.includes('Mär'), `expected German month in "${out}"`)
    })

    it('Spanish weekday', () => {
      // 2024-03-15 is Friday
      const out = formatDate(d, 'EEEE, MMMM DD, YYYY', 'es-ES')
      assert.ok(out.includes('viernes'), `expected Spanish weekday in "${out}"`)
    })
  })

  // ── Edge cases for formatDate ─────────────────────────────────────
  describe('edge cases', () => {
    it('single-digit day and month with D and M tokens', () => {
      const d = new Date('2024-01-03T08:05:02')
      assert.strictEqual(formatDate(d, 'M/D/YYYY'), '1/3/2024')
    })

    it('double-digit day and month with DD and MM tokens', () => {
      const d = new Date('2024-12-25T08:05:02')
      assert.strictEqual(formatDate(d, 'DD/MM/YYYY'), '25/12/2024')
    })

    it('midnight hour in 24h format', () => {
      const d = new Date('2024-01-01T00:00:00')
      assert.strictEqual(formatDate(d, 'HH:MM:SS'), '00:00:00')
    })

    it('midnight hour in 12h format', () => {
      const d = new Date('2024-01-01T00:00:00')
      assert.strictEqual(formatDate(d, 'HH:MM A'), '12:00 AM')
    })

    it('23:59:59 in 24h format', () => {
      const d = new Date('2024-01-01T23:59:59')
      assert.strictEqual(formatDate(d, 'HH:MM:SS'), '23:59:59')
    })

    it('23:59:59 in 12h format', () => {
      const d = new Date('2024-01-01T23:59:59')
      assert.strictEqual(formatDate(d, 'HH:MM:SS A'), '11:59:59 PM')
    })

    it('milliseconds 000', () => {
      const d = new Date('2024-01-01T12:00:00.000')
      assert.strictEqual(formatDate(d, 'HH:MM:SS.SSS'), '12:00:00.000')
    })

    it('milliseconds 999', () => {
      const d = new Date('2024-01-01T12:00:00.999')
      assert.strictEqual(formatDate(d, 'HH:MM:SS.SSS'), '12:00:00.999')
    })

    it('leap year Feb 29', () => {
      const d = new Date('2024-02-29T12:00:00')
      assert.strictEqual(formatDate(d, 'YYYY-MM-DD'), '2024-02-29')
    })

    it('year boundaries (Dec 31 → Jan 1)', () => {
      const d1 = new Date('2024-12-31T23:59:59')
      const d2 = new Date('2025-01-01T00:00:00')
      assert.strictEqual(formatDate(d1, 'YYYY-MM-DD'), '2024-12-31')
      assert.strictEqual(formatDate(d2, 'YYYY-MM-DD'), '2025-01-01')
    })
  })
})
