const package = require('./dist')

console.log(package.genRecurDateBasedList({
    start: '2022-07-01T19:00:00',
    interval: 3,
    intervalType: 'week',
    end: '2022-07-30T19:00:00',
    localeString: {
        lang: 'ru-RU',
        formatOptions: {
            timeZone: 'Europe/Moscow',
            hourCycle: 'h24',
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    },
    extended: {
        isValid: (start) => start + '11111111111111111',
        isValid2: (start) => start + '*9999999999999'
    }
}))