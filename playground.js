const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: '2023-04-02T16:30:00',
  end: '2023-04-04T00:00:00',
  // outputFormat: 'EEE, DD MMM YYYY HH:MM:SS',
  // localeString: {
  //   lang: 'hy-AM',
  // },
  numericTimeZone: 1,
  // rules: '0 9 * * *',
  rules: [{ unit: 'day', portion: 1 }],
  // filter: ({ date }) => date.getFullYear() === 2023 && date.getDate() === 9
  // direction: 'backward',
  // localeString: {
  //   lang: 'en-US',
  //   formatOptions: { timeZone: "UTC" }
  // },
  // numericTimeZone: 3,
  // extend: {
  //   timeStr: ({ dateStr, date, utcDate }) => {
  //     return dateStr.split('T')[1]
  //   },
  //   isMonday: ({date, dateStr}) => date.getDay() === 1,
  // },
})
console.log(
  list.map((x) => ({
    dateStr: x.dateStr,
    date: x.date.toISOString(),
    utcDate: x.utcDate.toISOString(),
  }))
)

// Cron: end = date (range) or number (max occurrences)
// const cronByDate = package.genRecurDateBasedList({ start: '2025-03-01', end: '2025-03-10', rules: '0 9 * * *' })
// const cronByCount = package.genRecurDateBasedList({ start: '2025-03-01', end: 5, rules: '0 9 * * *' })
