const package = require('./dist')

console.log(package.genRecurDateBasedList({
  start: '2022-11-11T00:00:00',
  interval: 1,
  intervalType: 'day',
  end: '2022-12-12T00:00:00',
  localeString: {
    lang: 'en-US',
    formatOptions: {
      hourCycle: 'h24'
    }
  },
  exclude: ({date, dateStr}) => date < new Date(),
  extended: {
    isMonday: ({date, dateStr}) => date.getDay() === 1,
  }
}))