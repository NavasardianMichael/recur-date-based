const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: new Date(),
  rules: [

  ],
  direction: 'backward',
  localeString: {
    // lang: 'ko-KR',
    formatOptions: { timeZone: "America/New_York" }
  },
  // numericTimezone: 1,
  extend: {
    timeStr: ({ dateStr, date, utcDate }) => {
      return dateStr.split('T')[1]
    },
    isMonday: ({date, dateStr}) => date.getDay() === 1,
  },

})
console.log(list);