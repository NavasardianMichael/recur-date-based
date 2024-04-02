const package = require('./dist')
const list = package.genRecurDateBasedList({
  start: new Date(),
  rules: [

  ],
  // direction: 'backward',
  numericTimezone: 3,
  extend: {
    timeStr: ({ dateStr, date }) => {
      console.log({date, d: new Date(date)});
      return dateStr.split('T')[1]
    },
    isMonday: ({date, dateStr}) => date.getDay() === 1,
  },

})
console.log(list);