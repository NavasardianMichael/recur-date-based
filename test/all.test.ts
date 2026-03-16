/**
 * Single entry point for all tests. Imports are loaded in-process by tsx,
 * avoiding subprocess loader inheritance issues with node --test.
 */
import './formatDate.test.js'
import './genRecurDateBasedList-cron.test.js'
import './genRecurDateBasedList-edge.test.js'
import './genRecurDateBasedList-step.test.js'
import './genRecurDateBasedList-timezone.test.js'
import './genRecurDateBasedList-filter-extend.test.js'
import './genRecurDateBasedList-validation.test.js'
import './outputFormats.test.js'
