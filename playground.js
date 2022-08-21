const package = require('./dist')

console.log(package.genRecurDateBasedList({
    start: '2022-01-01T00:00:00',
    interval: 3,
    intervalType: 'day',
    end: '2022-01-15T00:00:00',
    localeString: {
      lang: 'en-US',
      formatOptions: {
        hourCycle: 'h24'
      }
    },
    extended: {
      isMonday: ({date, dateStr}) => date.getDay() === 1,
    }
}))