const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: '2023-09-06T16:30:00',
  interval: 1,
  intervalType: 'hour',
  numericTimezone: 6,
  direction: 'backward',
  end: 5,
  // exclude: ({ date }) => date > new Date(),
  extend: {
    timeStr: ({ dateStr }) => dateStr.split('T')[1]
  },
  onError: (error) => {
    // do some stuff...
    console.log(error.message);
  }
})
console.log(list);