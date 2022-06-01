const package = require('./dist')

console.log(package.genRecurDateList({
    start: '05-08-2022',
    interval: 3,
    intervalType: 'day',
    end: '10-10-2022'
}))