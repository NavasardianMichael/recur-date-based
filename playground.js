const package = require('./dist')

console.log(package.genRecurDateBasedList({
    // start: '2022-01-01T00:00:00',
    interval: 3,
    intervalType: 'day',
    extended: {
      isMonday: ({date, dateStr}) => date.getDay() === 1,
      a: ({dateStr}) => dateStr
    }
}))