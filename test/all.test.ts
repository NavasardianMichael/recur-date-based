/**
 * Single entry point for all tests. Imports are loaded in-process by tsx,
 * avoiding subprocess loader inheritance issues with node --test.
 */
import './formatDate.test.ts'
import './genRecurDateBasedList-cron.test.ts'
import './genRecurDateBasedList-edge.test.ts'
import './genRecurDateBasedList-step.test.ts'
import './genRecurDateBasedList-timezone.test.ts'
import './outputFormats.test.ts'
