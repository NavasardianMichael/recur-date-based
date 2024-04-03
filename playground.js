const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: new Date(),
  end: 2,
  rules: [

  ],
  // direction: 'backward',
  // localeString: {
  //   lang: 'en-US',
  //   formatOptions: { timeZone: "UTC" }
  // },
  numericTimeZone: 3,
  extend: {
    timeStr: ({ dateStr, date, utcDate }) => {
      return dateStr.split('T')[1]
    },
    isMonday: ({date, dateStr}) => date.getDay() === 1,
  },
})
console.log(list);