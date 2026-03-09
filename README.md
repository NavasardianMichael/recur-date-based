# recur-date-based

Generate recurring dates and extra props based on them. Function-based, fully-typed, lightweight—no moment or heavy dependencies.

[![bundle size](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/NavasardianMichael/recur-date-based/main/badge.json)](https://github.com/NavasardianMichael/recur-date-based)
[![npm unpacked size](https://img.shields.io/npm/unpacked-size/recur-date-based)](https://www.npmjs.com/package/recur-date-based)

## Documentation

> 📚 **Extended docs:** [recur-date-based-docs.mnavasardian.com](https://recur-date-based-docs.mnavasardian.com)

---

## Install

```bash
npm install recur-date-based
```

---

## API Reference

### Exports

| Export                  | Type                                                              | Description                                   |
| ----------------------- | ----------------------------------------------------------------- | --------------------------------------------- |
| `genRecurDateBasedList` | `(args?) => T_CoreReturnType[]`                                   | Main function to generate recurring dates     |
| `formatDate`            | `(date: Date, format: T_OutputFormat, locale?: string) => string` | Format a date using a supported output format |
| `OUTPUT_FORMATS`        | `readonly string[]`                                               | List of supported format strings              |
| `T_OutputFormat`        | type                                                              | Union of all supported format strings         |
| `T_Rules`               | type                                                              | Step-based rules or cron string               |

---

### `genRecurDateBasedList(args?)`

Generates an array of recurring date objects from `start` to `end`, stepping by `rules` in `direction`. Each item has `date`, `utcDate`, `dateStr`, plus any properties from `extend`. Use `filter` to skip iterations.

#### Parameters

| Property          | Type                                                                          | Default                         | Description                                                          |
| ----------------- | ----------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| `start`           | `string \| Date`                                                              | today                           | Start date. Can be omitted for "now".                                |
| `end`             | `number \| string \| Date`                                                    | `10`                            | End: number of occurrences, or date/string. Max 99_999 when numeric. |
| `rules`           | `T_Rule[] \| string`                                                          | `[{ unit: 'day', portion: 1 }]` | Step-based rules or cron string (5 fields).                          |
| `direction`       | `'forward' \| 'backward'`                                                     | `'forward'`                     | Whether dates repeat forward or backward.                            |
| `outputFormat`    | `T_OutputFormat`                                                              | —                               | Format string for `dateStr`. Use one of `OUTPUT_FORMATS`.            |
| `localeString`    | `{ lang?: Intl.LocalesArgument; formatOptions?: Intl.DateTimeFormatOptions }` | `{}`                            | Locale and format options for `toLocaleString`.                      |
| `numericTimeZone` | `number`                                                                      | user's timezone                 | Timezone offset (-12 to 12). Use `0` for UTC.                        |
| `filter`          | `(args: { date, utcDate, dateStr }) => boolean`                               | —                               | Exclude if callback returns `false`.                                 |
| `extend`          | `Record<string, (args) => unknown>`                                           | `{}`                            | Add custom properties per occurrence.                                |
| `onError`         | `(error: Error) => unknown`                                                   | —                               | Handle errors without throwing.                                      |

#### Step-based rules

```ts
rules: [{ unit: 'millisecond' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year', portion: number }]
```

#### Cron rules

When `rules` is a string, use a 5-field cron expression:

```
minute hour dayOfMonth month dayOfWeek
```

- **minute:** 0–59
- **hour:** 0–23
- **dayOfMonth:** 1–31
- **month:** 1–12
- **dayOfWeek:** 0–6 (0 = Sunday) or 1–7 (7 = Sunday)

Examples: `0 9 * * *` (9am daily), `0 9 * * 1-5` (weekdays 9am), `*/15 * * * *` (every 15 min).

When `rules` is cron, `end` can be a date string (range) or a number (max occurrences).

#### `outputFormat`

Use one of `OUTPUT_FORMATS` to control the output format of `dateStr`:

```ts
import { genRecurDateBasedList, OUTPUT_FORMATS } from 'recur-date-based'

genRecurDateBasedList({
  start: '2024-01-01',
  end: 5,
  rules: [{ unit: 'day', portion: 1 }],
  outputFormat: 'YYYY-MM-DD',
})
// dateStr: ["2024-01-01", "2024-01-02", ...]
```

#### Result shape

Each item has:

| Property  | Type     | Description                                      |
| --------- | -------- | ------------------------------------------------ |
| `date`    | `Date`   | Same moment as `dateStr` (local timezone).       |
| `dateStr` | `string` | Stringified `date` per `outputFormat` or locale. |
| `utcDate` | `Date`   | Same moment in UTC (use `getUTC*` methods).      |

Plus any keys from `extend`.

---

### `formatDate(date, format, locale?)`

Formats a `Date` using a supported format string.

```ts
import { formatDate } from 'recur-date-based'

formatDate(new Date('2024-03-15'), 'YYYY-MM-DD') // "2024-03-15"
formatDate(new Date('2024-03-15T09:30:00'), 'YYYY-MM-DD HH:MM') // "2024-03-15 09:30"
formatDate(new Date('2024-01-15'), 'MMMM DD, YYYY', 'en-US') // "January 15, 2024"
```

---

### `OUTPUT_FORMATS`

Readonly array of supported format strings. Use with `outputFormat` or as the second argument to `formatDate`.

**Format tokens:**

| Token  | Meaning                                    |
| ------ | ------------------------------------------ |
| `YYYY` | 4-digit year                               |
| `YY`   | 2-digit year                               |
| `MM`   | 2-digit month                              |
| `M`    | Month (no leading zero)                    |
| `DD`   | 2-digit day                                |
| `D`    | Day (no leading zero)                      |
| `HH`   | Hour (24h, or 12h if format contains ` A`) |
| `SS`   | Seconds                                    |
| `SSS`  | Milliseconds                               |
| `A`    | AM/PM                                      |
| `EEE`  | Weekday short (locale)                     |
| `EEEE` | Weekday long (locale)                      |
| `MMM`  | Month short (locale)                       |
| `MMMM` | Month long (locale)                        |
| `DDD`  | Day of year (3-digit)                      |
| `Z`    | Timezone offset (+HH:mm)                   |

**Examples:** `YYYY-MM-DD`, `YYYY-MM-DD HH:MM`, `MM/DD/YYYY`, `DD MMM YYYY HH:MM:SS`, `HH:MM:SS`, `HH:MM A`, etc.

---

## Examples

### Step-based, daily

```ts
import { genRecurDateBasedList } from 'recur-date-based'

genRecurDateBasedList({
  start: '2024-01-01',
  end: 5,
  rules: [{ unit: 'day', portion: 1 }],
  outputFormat: 'YYYY-MM-DD',
})
// [{ dateStr: "2024-01-01", date, utcDate }, ...]
```

### Cron: weekdays at 9am

```ts
genRecurDateBasedList({
  start: '2024-01-01',
  end: '2024-01-31',
  rules: '0 9 * * 1-5',
})
```

### With filter and extend

```ts
genRecurDateBasedList({
  start: '2024-01-01',
  end: 10,
  rules: [{ unit: 'day', portion: 1 }],
  filter: ({ date }) => date.getDay() !== 0,
  extend: {
    dayOfWeek: ({ date }) => date.getDay(),
    iso: ({ dateStr }) => dateStr,
  },
})
```

### Backward with custom timezone

```ts
genRecurDateBasedList({
  start: new Date(),
  end: 3,
  rules: [{ unit: 'day', portion: 2 }],
  direction: 'backward',
  numericTimeZone: 3,
  onError: (e) => console.log(e.message),
})
```

---

## Test Coverage

All tests are in `test/` and run with `npm test`. Coverage below.

### `genRecurDateBasedList` – step-based rules

| Test                                    | Description                    |
| --------------------------------------- | ------------------------------ |
| daily forward: 5 days from fixed start  | Daily recurrence, 5 steps      |
| daily backward: 5 days                  | Backward direction             |
| weekly: 3 weeks forward                 | Week unit                      |
| monthly: 4 months forward               | Month unit                     |
| hourly: 6 hours                         | Hour unit                      |
| date range: start to end (string dates) | String start/end               |
| with outputFormat                       | Custom format for `dateStr`    |
| with localeString.lang                  | Locale for month/weekday names |
| filter: skip some dates                 | Filter by odd days             |
| extend: add custom properties           | `dayOfWeek`, `iso`             |
| each item has date, utcDate, dateStr    | Result shape                   |

### `genRecurDateBasedList` – cron rules

| Test                                     | Description       |
| ---------------------------------------- | ----------------- |
| cron: every day at 9am (0 9 \* \* \*)    | Daily at 9am      |
| cron: weekdays only (0 9 \* \* 1-5)      | Mon–Fri           |
| cron with end count                      | `end` as number   |
| cron: every 15 minutes (_/15 _ \* \* \*) | Every 15 min      |
| cron: 15th of every month (0 9 15 \* \*) | Day-of-month step |

### `genRecurDateBasedList` – edge cases

| Test                                                  | Description               |
| ----------------------------------------------------- | ------------------------- |
| start omitted: uses "now" (default)                   | Default start             |
| empty rules falls back to default (1 day)             | Empty rules               |
| direction backward with positive portions             | Backward + positive       |
| numericTimeZone                                       | `numericTimeZone: 0`      |
| without numericTimeZone: date and dateStr same moment | `date` = `dateStr` moment |
| onError: invalid config does not throw                | `onError` handler         |
| invalid end throws when no onError                    | Validation error          |
| invalid cron throws when no onError                   | Cron validation           |
| cron with end as string date                          | Cron + date range         |
| localeString with formatOptions.timeZone              | `formatOptions.timeZone`  |
| multiple units in rules (e.g. 2 days)                 | `portion: 2`              |
| filter returns false skips iteration                  | All filtered out          |

### `formatDate`

| Test             | Description            |
| ---------------- | ---------------------- |
| YYYY-MM-DD       | Basic format           |
| YYYY-MM-DD HH:MM | With time              |
| with locale      | Locale for month names |
| HH:MM:SS         | Time only              |

### `OUTPUT_FORMATS`

| Test                     | Description                      |
| ------------------------ | -------------------------------- |
| is exported and is array | Export shape                     |
| includes common formats  | `YYYY-MM-DD`, `MM/DD/YYYY`, etc. |

---

## Scripts

| Command          | Description          |
| ---------------- | -------------------- |
| `npm run build`  | Build (tsup)         |
| `npm test`       | Run tests            |
| `npm run size`   | Check bundle size    |
| `npm run format` | Format with Prettier |

---

## License

MIT

---

## Contact

- **Email:** [navasardianmichael@gmail.com](mailto:navasardianmichael@gmail.com)
- **LinkedIn:** [Michael Navasardyan](https://www.linkedin.com/in/michael-navasardyan)
- **Project:** [https://github.com/NavasardianMichael/recur-date-based](https://github.com/NavasardianMichael/recur-date-based)
- **Docs:** [https://navasardianmichael.github.io/recur-date-based-docs/](https://navasardianmichael.github.io/recur-date-based-docs/)
