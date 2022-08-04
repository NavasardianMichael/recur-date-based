const package = require('./dist')

console.log(package.genRecurDateBasedList({
    start: '05-07-2022',
    interval: 3,
    intervalType: 'day',
    end: '06-07-2022',
    localeString: {
        lang: 'ko-KR',
        formatOptions: { weekday: 'long'}
    },
    extended: {
        isValid: (start) => start + '11111111111111111',
        isValid2: (start) => start + '*9999999999999'
    }
}))