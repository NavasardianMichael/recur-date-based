const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: '2024-01-01',
  end: 2,
  rules: [{ unit: 'day', portion: 1 }],
  outputFormat: 'YYYY-MM-DD',
  numericTimeZone: 4,
})
console.log(list)

// Cron: end = date (range) or number (max occurrences)
// const cronByDate = package.genRecurDateBasedList({ start: '2025-03-01', end: '2025-03-10', rules: '0 9 * * *' })
// const cronByCount = package.genRecurDateBasedList({ start: '2025-03-01', end: 5, rules: '0 9 * * *' })
