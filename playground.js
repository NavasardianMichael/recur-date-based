const package = require('./dist')

console.log(package.genRecurDateBasedList({
    start: '2022-07-01T19:00:00',
    interval: 3,
    intervalType: 'week',
    end: 99999,
    localeString: {
        lang: 'fr-CH',
        formatOptions: {
            timeZone: 'America/New_York',
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
        isMonday: ({date}) => date.getDay() === 1,
        toDateOnly: ({dateStr}) => dateStr.substring(0, 8),
    }
}))