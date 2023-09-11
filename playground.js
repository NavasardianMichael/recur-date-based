const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: new Date('2023-09-06T16:30:00'),
  interval: 3,
  intervalType: 'hour',
  numericTimezone: 0,
  // direction: 'backward',
  end: '2023-09-10T16:30:00',
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