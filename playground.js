const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: new Date(),
  rules: [
    {
      unit: 'month',
      portion: 1
    },
    {
      unit: 'day',
      portion: 3
    },
  ],
  direction: 'backward',
  numericTimezone: 7,
  extend: {
    timeStr: ({ dateStr }) => dateStr.split('T')[1]
  },

})
console.log(list);