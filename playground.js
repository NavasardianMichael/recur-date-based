const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: '2023-04-01T16:30:00',
  end: new Date(),
  rules: [

  ],
  filter: ({ date }) => date.getFullYear() === 2023 && date.getDate() === 9
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
console.log(list);