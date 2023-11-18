const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: new Date(),
  rules: [
    {
      type: 'month',
      portion: 1
    },
    {
      type: 'day',
      portion: 3
    },
    {
      type: 'hour',
      portion: 5
    },
  ],
  numericTimezone: 0,
  // direction: 'backward',
  end: '2024-11-24T16:30:00',
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