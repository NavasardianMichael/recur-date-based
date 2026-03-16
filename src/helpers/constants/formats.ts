/**
 * Readonly list of supported date/time format strings. Use with `outputFormat` in {@link genRecurDateBasedList} or as the second argument to {@link formatDate}; compatible with `localeString.lang`, not with `localeString.formatOptions`.
 *
 * Includes: ISO (e.g. YYYY-MM-DD, YYYY-MM, YYYY-MM-DD HH:MM); US slash and dash (MM/DD/YYYY, MM-DD-YYYY, with time); European dot and dash (DD.MM.YYYY, DD-MM-YYYY, with time); month-year only (MMMM YYYY, MMM YYYY); RFC-style (DD MMM YYYY HH:MM:SS); weekday + date/time (EEE, DD MMM YYYY HH:MM:SS); time-only (HH:MM, HH:MM:SS, with A or Z); and compact (YYYYMMDD).
 *
 * Token meanings (all uppercase): YYYY = 4-digit year, YY = 2-digit year; MM = month 2-digit, M = month no zero; DD = day 2-digit, D = day no zero; HH = hour (12h if format contains ` A`, else 24h); MM after colon = minutes; SS = seconds, SSS = milliseconds; A = AM/PM; EEE = weekday short (locale), EEEE = weekday long; MMM = month short (locale), MMMM = month long; DDD = day of year (3-digit); Z = timezone offset (+HH:mm).
 *
 * @constant
 */
export const OUTPUT_FORMATS = [
  // ── 1. Date-only: US slash (MM/DD) ──────────────────────────────────
  'MM/DD/YYYY',
  'MM/D/YYYY',
  'M/DD/YYYY',
  'M/D/YYYY',

  // ── 2. Date-only: EU slash (DD/MM) ─────────────────────────────────
  'DD/MM/YYYY',
  'D/MM/YYYY',
  'DD/M/YYYY',
  'D/M/YYYY',

  // ── 3. Date-only: ISO dash (YYYY-MM-DD) ────────────────────────────
  'YYYY-MM-DD',
  'YYYY-MM-D',
  'YYYY-MM',

  // ── 4. Date-only: EU/US dash ───────────────────────────────────────
  'DD-MM-YYYY',
  'D-MM-YYYY',
  'MM-DD-YYYY',
  'M-DD-YYYY',
  'MM-D-YYYY',
  'M-D-YYYY',

  // ── 5. Date-only: YYYY slash ───────────────────────────────────────
  'YYYY/MM/DD',
  'YYYY/MM/D',

  // ── 6. Date-only: text month (MMM / MMMM) ─────────────────────────
  'MMM DD, YYYY',
  'MMM D, YYYY',
  'MMMM DD, YYYY',
  'MMMM D, YYYY',
  'MMMM YYYY',
  'MMM YYYY',

  // ── 7. Date-only: weekday + date ───────────────────────────────────
  'EEEE, MMMM DD, YYYY',
  'EEEE, MMMM D, YYYY',
  'EEEE, DD MMM YYYY',
  'EEEE, D MMM YYYY',

  // ── 8. Date-only: day-month-year text ──────────────────────────────
  'DD MMM YYYY',
  'D MMM YYYY',
  'DD MMMM YYYY',
  'D MMMM YYYY',

  // ── 9. Date+time: DD/D MMM YYYY ───────────────────────────────────
  'DD MMM YYYY HH:MM',
  'D MMM YYYY HH:MM',
  'DD MMM YYYY HH:MM:SS',
  'D MMM YYYY HH:MM:SS',
  'DD MMM YYYY HH:MM A',
  'D MMM YYYY HH:MM A',
  'DD MMM YYYY HH:MM:SS A',
  'D MMM YYYY HH:MM:SS A',

  // ── 10. Date+time: DD/D MMMM YYYY ─────────────────────────────────
  'DD MMMM YYYY HH:MM',
  'D MMMM YYYY HH:MM',
  'DD MMMM YYYY HH:MM:SS',
  'D MMMM YYYY HH:MM:SS',
  'DD MMMM YYYY HH:MM A',
  'D MMMM YYYY HH:MM A',
  'DD MMMM YYYY HH:MM:SS A',
  'D MMMM YYYY HH:MM:SS A',

  // ── 11. Date+time: MMMM DD/D, YYYY ────────────────────────────────
  'MMMM DD, YYYY HH:MM',
  'MMMM D, YYYY HH:MM',
  'MMMM DD, YYYY HH:MM:SS',
  'MMMM D, YYYY HH:MM:SS',
  'MMMM DD, YYYY HH:MM A',
  'MMMM D, YYYY HH:MM A',
  'MMMM DD, YYYY HH:MM:SS A',
  'MMMM D, YYYY HH:MM:SS A',

  // ── 12. Date+time: EEEE long weekday ──────────────────────────────
  'EEEE, MMMM DD, YYYY HH:MM',
  'EEEE, MMMM DD, YYYY HH:MM:SS',
  'EEEE, MMMM DD, YYYY HH:MM A',
  'EEEE, MMMM DD, YYYY HH:MM:SS A',
  'EEEE, MMMM D, YYYY HH:MM',
  'EEEE, MMMM D, YYYY HH:MM:SS',
  'EEEE, MMMM D, YYYY HH:MM A',
  'EEEE, MMMM D, YYYY HH:MM:SS A',
  'EEEE, DD MMM YYYY HH:MM',
  'EEEE, DD MMM YYYY HH:MM:SS',
  'EEEE, DD MMM YYYY HH:MM A',
  'EEEE, DD MMM YYYY HH:MM:SS A',
  'EEEE, D MMM YYYY HH:MM',
  'EEEE, D MMM YYYY HH:MM:SS',
  'EEEE, D MMM YYYY HH:MM A',
  'EEEE, D MMM YYYY HH:MM:SS A',

  // ── 13. Date+time: EEE short weekday ──────────────────────────────
  'EEE, DD MMM YYYY HH:MM',
  'EEE, D MMM YYYY HH:MM',
  'EEE, DD MMM YYYY HH:MM:SS',
  'EEE, D MMM YYYY HH:MM:SS',
  'EEE, DD MMM YYYY HH:MM:SS A',
  'EEE, D MMM YYYY HH:MM:SS A',
  'EEE, DD MMM YYYY HH:MM:SS.SSS',
  'EEE, D MMM YYYY HH:MM:SS.SSS',
  'EEE, DD MMM YYYY HH:MM:SS.SSS A',
  'EEE, D MMM YYYY HH:MM:SS.SSS A',

  // ── 14. Date-only: 2-digit year ───────────────────────────────────
  'YY/MM/DD',
  'YY/MM/D',
  'YY-MM-DD',
  'YY-MM-D',
  'MM/DD/YY',
  'M/D/YY',
  'DD/MM/YY',
  'D/M/YY',

  // ── 15. Date-only: compact ────────────────────────────────────────
  'YYYYMMDD',
  'YYYYDDD',

  // ── 16. Date-only: dot ────────────────────────────────────────────
  'DD.MM.YYYY',
  'D.MM.YYYY',
  'DD.MM.YY',
  'D.MM.YY',
  'YYYY.MM.DD',
  'YYYY.MM.D',
  'D.M.YYYY',

  // ── 17. Date+time: dot ────────────────────────────────────────────
  'DD.MM.YYYY HH:MM',
  'D.MM.YYYY HH:MM',
  'DD.MM.YYYY HH:MM:SS',
  'D.MM.YYYY HH:MM:SS',
  'DD.MM.YY HH:MM',
  'D.MM.YY HH:MM',
  'DD.MM.YY HH:MM:SS',
  'D.MM.YY HH:MM:SS',
  'YYYY.MM.DD HH:MM',
  'YYYY.MM.DD HH:MM:SS',
  'YYYY.MM.D HH:MM',
  'YYYY.MM.D HH:MM:SS',
  'D.M.YYYY HH:MM',
  'D.M.YYYY HH:MM:SS',

  // ── 18. Time only ────────────────────────────────────────────────
  'HH:MM',
  'HH:MM A',
  'HH:MM:SS A',
  'HH:MM:SS.SSS A',
  'HH:MM Z',
  'HH:MM:SS Z',
  'HH:MM:SS',
  'HH:MM:SS.SSS',

  // ── 19. Date+time: ISO (YYYY-MM-DD) ──────────────────────────────
  'YYYY-MM-DDTHH:MM',
  'YYYY-MM-DDTHH:MMZ',
  'YYYY-MM-DDTHH:MM:SS',
  'YYYY-MM-DDTHH:MM:SS.SSS',
  'YYYY-MM-DDTHH:MM:SSZ',
  'YYYY-MM-DDTHH:MM:SS.SSSZ',
  'YYYY-MM-DD HH:MM',
  'YYYY-MM-DD HH:MM:SS',
  'YYYY-MM-DD HH:MM:SS.SSS',
  'YYYY-MM-DD HH:MM:SS Z',
  'YYYY-MM-D HH:MM',
  'YYYY-MM-D HH:MM:SS',

  // ── 20. Date+time: US slash (MM/DD) ──────────────────────────────
  'MM/DD/YYYY HH:MM',
  'MM/D/YYYY HH:MM',
  'MM/DD/YYYY HH:MM A',
  'MM/D/YYYY HH:MM A',
  'MM/DD/YYYY HH:MM:SS',
  'MM/D/YYYY HH:MM:SS',
  'MM/DD/YYYY HH:MM:SS A',
  'MM/D/YYYY HH:MM:SS A',
  'M/DD/YYYY HH:MM',
  'M/DD/YYYY HH:MM:SS',
  'M/DD/YYYY HH:MM A',
  'M/DD/YYYY HH:MM:SS A',
  'M/D/YYYY HH:MM',
  'M/D/YYYY HH:MM:SS',
  'M/D/YYYY HH:MM A',
  'M/D/YYYY HH:MM:SS A',

  // ── 21. Date+time: EU slash (DD/MM) ──────────────────────────────
  'DD/MM/YYYY HH:MM',
  'D/MM/YYYY HH:MM',
  'DD/MM/YYYY HH:MM A',
  'D/MM/YYYY HH:MM A',
  'DD/MM/YYYY HH:MM:SS',
  'D/MM/YYYY HH:MM:SS',
  'DD/MM/YYYY HH:MM:SS A',
  'D/MM/YYYY HH:MM:SS A',
  'DD/MM/YYYY HH:MM:SS.SSS',
  'DD/MM/YYYY HH:MM:SS.SSS A',
  'DD/M/YYYY HH:MM',
  'DD/M/YYYY HH:MM:SS',
  'DD/M/YYYY HH:MM A',
  'DD/M/YYYY HH:MM:SS A',
  'D/M/YYYY HH:MM',
  'D/M/YYYY HH:MM:SS',
  'D/M/YYYY HH:MM A',
  'D/M/YYYY HH:MM:SS A',

  // ── 22. Date+time: EU/US dash ────────────────────────────────────
  'DD-MM-YYYY HH:MM',
  'D-MM-YYYY HH:MM',
  'DD-MM-YYYY HH:MM:SS',
  'D-MM-YYYY HH:MM:SS',
  'DD-MM-YYYY HH:MM A',
  'D-MM-YYYY HH:MM A',
  'DD-MM-YYYY HH:MM:SS A',
  'D-MM-YYYY HH:MM:SS A',
  'MM-DD-YYYY HH:MM',
  'M-DD-YYYY HH:MM',
  'MM-D-YYYY HH:MM',
  'M-D-YYYY HH:MM',
  'MM-DD-YYYY HH:MM:SS',
  'M-DD-YYYY HH:MM:SS',
  'MM-D-YYYY HH:MM:SS',
  'M-D-YYYY HH:MM:SS',
  'MM-DD-YYYY HH:MM A',
  'M-DD-YYYY HH:MM A',
  'MM-D-YYYY HH:MM A',
  'M-D-YYYY HH:MM A',
  'MM-DD-YYYY HH:MM:SS A',
  'M-DD-YYYY HH:MM:SS A',
  'MM-D-YYYY HH:MM:SS A',
  'M-D-YYYY HH:MM:SS A',

  // ── 23. Date+time: YYYY slash ────────────────────────────────────
  'YYYY/MM/DD HH:MM',
  'YYYY/MM/DD HH:MM:SS',
  'YYYY/MM/D HH:MM',
  'YYYY/MM/D HH:MM:SS',

  // ── 24. Date+time: MMM DD, YYYY ──────────────────────────────────
  'MMM DD, YYYY HH:MM',
  'MMM D, YYYY HH:MM',
  'MMM DD, YYYY HH:MM:SS',
  'MMM D, YYYY HH:MM:SS',
  'MMM DD, YYYY HH:MM A',
  'MMM D, YYYY HH:MM A',
  'MMM DD, YYYY HH:MM:SS A',
  'MMM D, YYYY HH:MM:SS A',
  'MMM DD, YYYY HH:MM:SS.SSS',
  'MMM D, YYYY HH:MM:SS.SSS',
  'MMM DD, YYYY HH:MM:SS.SSS A',
  'MMM D, YYYY HH:MM:SS.SSS A',

  // ── 25. Date+time: 2-digit year ──────────────────────────────────
  'YY/MM/DD HH:MM',
  'YY/MM/DD HH:MM:SS',
  'YY/MM/D HH:MM',
  'YY/MM/D HH:MM:SS',
  'YY-MM-DD HH:MM',
  'YY-MM-DD HH:MM:SS',
  'YY-MM-D HH:MM',
  'YY-MM-D HH:MM:SS',
  'MM/DD/YY HH:MM',
  'MM/DD/YY HH:MM:SS',
  'M/D/YY HH:MM',
  'M/D/YY HH:MM:SS',
  'DD/MM/YY HH:MM',
  'DD/MM/YY HH:MM:SS',
  'D/M/YY HH:MM',
  'D/M/YY HH:MM:SS',
] as const
