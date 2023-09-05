const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: '2023-09-06T16:30:00',
  interval: 1,
  intervalType: 'day',
  numericTimezone: 4,
  direction: 'backward',
  end: 5,
  exclude: ({ date }) => date < new Date(),
  extend: {
    isMonday: ({ date }) => date.getDay() === 1,
    timeStr: ({ dateStr }) => dateStr.split('T')[1]
  },
  onError: (error) => {
    // do some stuff...
    console.log(error.message);
  }
})
console.log(list);