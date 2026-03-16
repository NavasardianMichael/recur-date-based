const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: '2025-03-01: 09:00:00',
  end: 2,
  // outputFormat: 'EEE, DD MMM YYYY HH:MM:SS',
  // localeString: {
  //   lang: 'hy-AM',
  // },
  // numericTimeZone: 1,
  // rules: '0 9 * * *',
  rules: [{ unit: 'day', portion: 1 }],
  // filter: ({ date }) => date.getFullYear() === 2023 && date.getDate() === 9
  // direction: 'backward',
  // localeString: {
  //   lang: 'en-US',
  //   formatOptions: { timeZone: "UTC" }
  // },
  // numericTimeZone: 3,
  extend: {
    a: ({ dateStr, date, utcDate }) => {
      return date.getHours()
    },
    // timeStr: ({ dateStr, date, utcDate }) => {
    //   return dateStr.split('T')[1]
    // },
    // isMonday: ({date, dateStr}) => date.getDay() === 1,
  },
})
console.log(list)

// Cron: end = date (range) or number (max occurrences)
// const cronByDate = package.genRecurDateBasedList({ start: '2025-03-01', end: '2025-03-10', rules: '0 9 * * *' })
// const cronByCount = package.genRecurDateBasedList({ start: '2025-03-01', end: 5, rules: '0 9 * * *' })
