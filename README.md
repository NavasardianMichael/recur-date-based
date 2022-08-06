<details>
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

The project provides a unique functionality related to JavaScript dates. It allows to generate repeating dates array according to a certain shape of input data. 
There are some recurring date utilities, such as <a target="_blank" href="https://www.npmjs.com/package/recurring-date">recurring-date</a> and <a target="_blank" href="https://www.npmjs.com/package/moment-recur">moment-recur</a> available on NPM. But the first is class based and for second <a target="_blank" href="https://www.npmjs.com/package/moment">moment</a> is a must. So I didn't find one that really suited my needs when I ran into the problem of providing such functionality․ Eventually I created this enhanced one, which is function based, suitable for TypeScript, and does not need additional mapping for custom data.


Of course, it is new and there can be some missing cases of logic. So I'll be adding more in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue.


<!-- GETTING STARTED -->
## Getting Started

```sh
npm install recur-date-based
```
 

<!-- USAGE EXAMPLES -->
## Usage

Here are presented all the available props the exported function accepts.

| Ppropery                   | Type                 | Description  | Default    |
| -------------------------- | -------------        | ------------ | ----------- |
| start                      | string               | the start date string in ISO format | today        |
| end                        | number or string      | occurences count or the end date string in ISO format. The number larger than 9999 is not applicable. | 100 |
| interval                   | number      | repeat by some interval | 10 |
| intervalType               | day / week / month / year | interval measue unit | day |
| localeString.lang          | string | the first argument that recieves the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString">Date.toLocaleString</a> function | null |
| localeString.formatOptions          | Intl.DateTimeFormatOptions | the second argument that recieves the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString">Date.toLocaleString</a> function | null |
| extended                   | { [key: string]: (args: {date: Date, dateStr: Date}) => any } | The object accepts provided functions under any string key. The function receives an object with date and dateStr options in the current iteration. This can help to generate extended properties based on current occurence | null |

Check out an example.

```sh
import { genRecurDateBasedList } from 'recur-date-based';

genRecurDateBasedList({
    start: '2022-07-01T19:00:00',
    interval: 3,
    intervalType: 'week',
    end: '2022-07-30T19:00:00',
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
        getDateOnly: ({dateStr}) => dateStr.substring(0, 8),
    }
}
```

<!-- ROADMAP -->
## Roadmap

- [x] Finalize the initial version
- [x] Add extended props callbacks
- [ ] Add exclude functionality
- [ ] Support other intervalTypes
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

Michael Navasardyan - <a target="_blank" href='mailto:navasardianmichael@gmail.com'>navasardianmichael@gmail.com</a> | <a target="_blank" href='https://www.linkedin.com/in/michael-navasardyan'>linkedin</a>

Project Link: [https://github.com/NavasardianMichael/recur-date-based](https://github.com/NavasardianMichael/recur-date-based)
