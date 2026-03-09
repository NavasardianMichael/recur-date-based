import { describe, it } from 'node:test'
import assert from 'node:assert'
import { formatDate } from '../dist/index.mjs'

describe('formatDate', () => {
  it('YYYY-MM-DD', () => {
    const d = new Date('2024-03-15T12:00:00')
    assert.strictEqual(formatDate(d, 'YYYY-MM-DD'), '2024-03-15')
  })

  it('YYYY-MM-DD HH:MM', () => {
    const d = new Date('2024-03-15T09:30:00')
    assert.strictEqual(formatDate(d, 'YYYY-MM-DD HH:MM'), '2024-03-15 09:30')
  })

  it('with locale', () => {
    const d = new Date('2024-01-15')
    const out = formatDate(d, 'MMMM DD, YYYY', 'en-US')
    assert.ok(out.includes('January'))
  })

  it('HH:MM:SS', () => {
    const d = new Date('2024-01-01T14:05:30')
    assert.strictEqual(formatDate(d, 'HH:MM:SS'), '14:05:30')
  })
})
