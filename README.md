<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The project provides a unique functionality related to JavaScript dates. It allows to generate repeating dates array according to a certain shape of input data. Its name is in harmony with its essence: the exported function gives an opportunity to generate additional properties (except of dates) based on the date of the current iteration.
There are some recurring date utilities, such as <a target="_blank" href="https://www.npmjs.com/package/recurring-date">recurring-date</a> and <a target="_blank" href="https://www.npmjs.com/package/moment-recur">moment-recur</a> available on NPM. But the first is class based and for second the <a target="_blank" href="https://www.npmjs.com/package/moment">moment</a> is a must. So I didn't find any package that really suited my needs, when I ran into the problem of providing such functionality․ Eventually I created this enhanced one, which is function based, suitable for TypeScript, and does not need additional mapping for custom data.


If you have some idea about the next features of the current package, please suggest changes by forking this repo and creating a pull request or opening an issue.


<!-- GETTING STARTED -->
## Getting Started

```sh
npm install recur-date-based
```
 

<!-- USAGE EXAMPLES -->
## Usage

Here are presented all the available parameters the exported function accepts.

| Property                   | Type                 | Description  | Default    |
| -------------------------- | -------------        | ------------ | ----------- |
| start                      | `string` or `Date`       | The start date or its any string representation. | today      |
| end                        | `number` or `string`      | Occurrences count or the end date string in ISO format. The number larger than 99999 is not applicable. | `100` |
| interval                   | `number`      | Repeat by some interval. | `1` |
| intervalType               | `'millisecond' / 'minute' / 'hour' / 'day' / 'week' / 'month' / 'year'` | Interval unit name. | `'day'` |
| numericTimezone            | `number` | A numeric representation of the timezone, according to which dates will be constructed. Take into account that the provided value must in a specifig range -12 to 12.  | user's timezone |
| direction                  | `'forward' / 'backward'` | Whether the dates are repeated to the past or to the future. | `'forward'` |
| localeString.lang          | `string`                 | The first argument that receives the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString">`Date.toLocaleString`</a> function. | `null` |
| localeString.formatOptions          | `Intl.DateTimeFormatOptions` | The second argument that receives the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString">`Date.toLocaleString`</a> function. | `null` |
| exclude                    | `(args: { date: Date, dateStr: string }) => boolean` | Custom filter function.  | `null` |
| extend                   | `{ [key: string]: (args: {date: Date, dateStr: string}) => unknown }` | The object accepts provided functions under string keys. The function receives an object with `date` and `dateStr` properties in the current iteration. This can help to generate extended properties based on current occurrence. | `null` |
| onError                    | `(error) => unknown` | A callback which is called when any error occurs. | `null` |


Check out an example.


```sh
import { genRecurDateBasedList } from 'recur-date-based';

genRecurDateBasedList({
  start: '2022-01-01T00:00:00',
  end: '2022-01-15T00:00:00',
  interval: 3,
  intervalType: 'day',
  localeString: {
    lang: 'en-US',
    formatOptions: {
      hourCycle: 'h24'
    }
  },
  *// Filtering only upcoming dates*
  exclude: ({date, dateStr}) => date < new Date(),
  extend: {
    isMonday: ({date, dateStr}) => date.getDay() === `1`,
  }
})
```

The result is an array consisting of objects. The latters always include 'dateStr' property and extended ones optionally. Check out the result.

```sh
[
  { dateStr: '1/1/2022, 24:00:00', isMonday: false },
  { dateStr: '1/4/2022, 24:00:00', isMonday: false },
  { dateStr: '1/7/2022, 24:00:00', isMonday: false },
  { dateStr: '1/10/2022, 24:00:00', isMonday: true },
  { dateStr: '1/13/2022, 24:00:00', isMonday: false }
]
```

Check out another example with `direction` set to `'backwards'` and with applied custom `numericTimezone`.

`genRecurDateBasedList({
  start: '2023-09-06T16:30:00',
  end: 5,
  interval: 1,
  intervalType: 'day',
  numericTimezone: 4,
  direction: 'backward',
  extend: {
    timeStr: ({ dateStr }) => dateStr.split('T')[1]
  },
  onError: (error) => {
    // do some stuff...
    console.log(error.message);
  }
})`

Check out the result. Take attention to the the `dateStr` format. In case of missing `localeString` property, the date will be formatted to ''

`[
  { dateStr: '2023-09-06T16:30:00', timeStr: '16:30:00' },
  { dateStr: '2023-09-06T15:30:00', timeStr: '15:30:00' },
  { dateStr: '2023-09-06T14:30:00', timeStr: '14:30:00' },
  { dateStr: '2023-09-06T13:30:00', timeStr: '13:30:00' },
  { dateStr: '2023-09-06T12:30:00', timeStr: '12:30:00' }
]`

<!-- ROADMAP -->
## Roadmap

- [x] Finalize the initial version
- [x] Add extended props callbacks
- [x] Add exclude functionality
- [x] Error handling
- [x] Custom error handling
- [x] Custom timezone
- [x] Repeating by backward
- [ ] Support date short formatting (e.g. dd/mm/yyyy)

See the [open issues](https://github.com/NavasardianMichael/recur-date-based/issues) for a full list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the <a target="_blank" href="https://github.com/NavasardianMichael/recur-date-based">Github Repository</a> and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/short-description`)
3. Commit your Changes (`git commit -m 'Provided some Amazing feature'`)
4. Push to the Branch (`git push origin feature/short-description`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Michael Navasardyan - <a target="_blank" href='mailto:navasardianmichael@gmail.com'>navasardianmichael@gmail.com</a>

Project Link: [https://github.com/NavasardianMichael/recur-date-based](https://github.com/NavasardianMichael/recur-date-based)
