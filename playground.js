const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: '2022-11-11T09:00:00',
  interval: 3,
  intervalType: 'hour',
  end: 10,
  localeString: {
    lang: 'en-US',
    formatOptions: {
      // hourCycle: 'h24',
    }
  },
  extend: {
    isMonday: ({date, dateStr}) => {
      return date.getDay() === 1
    },
  }
})
console.log({list});