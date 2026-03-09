import { describe, it } from 'node:test'
import assert from 'node:assert'
import { OUTPUT_FORMATS } from '../dist/index.mjs'

describe('OUTPUT_FORMATS', () => {
  it('is exported and is array', () => {
    assert.ok(Array.isArray(OUTPUT_FORMATS))
    assert.ok(OUTPUT_FORMATS.length > 0)
  })

  it('includes common formats', () => {
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DD'))
    assert.ok(OUTPUT_FORMATS.includes('YYYY-MM-DD HH:MM'))
    assert.ok(OUTPUT_FORMATS.includes('MM/DD/YYYY'))
  })
})
