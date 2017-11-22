/*
 Copyright (C) 2017  The University of Sydney Library

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict'


/**
 * A moment object from the moment.js library.
 * @typedef {object} Moment
 * @see {@link https://momentjs.com/docs/}
 */


/**
 * A DateTime object from the Luxon library.
 * @typedef {object} DateTime
 * @see {@link http://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html}
 */

/**
 * An Interval object from the Luxon library.
 * @typedef {object} Interval
 * @see {@link http://moment.github.io/luxon/docs/class/src/interval.js~Interval.html}
 */


/**
 * @typedef {(String|Date|Moment|DateTime|undefined|null)} DateLike
 */


/**
 * Makes a Sierra API date range from strings, dates, moments.js moments, Luxon DateTimes, or a Luxon Intervals.
 *
 * Does not validate the first date/time is earlier in time than the second date/time.
 *
 * If you give a string, it is assumed you've given an already a properly formed date range, and the arg is simply
 * returned.
 *
 * If the arg is undefined or null, undefined is returned.
 *
 * If you give a Luxon Interval, then the two DateTimes inside the Interval are used as to from the date range. HOWEVER,
 * Luxon Intervals do NOT include there endpoint, whereas Sierra API date ranges do. So 1 day will be subtracted from
 * the Luxon Interval's exclusive end to make the Sierra API date/time range's inclusive end.
 *
 * If you give a native Date, a moment.js moments or a Luxon DateTime (not in array), it is converted into a
 * ISO 8601 date string in UTC by truncating any time part. It is not put inside Sierra's range syntax; thus specifying
 * just the date and not a range of dates.
 *
 * If you give an array, then the first element of the array is taken to be the start of the range and the second
 * argument is taken to be the end of the range.
 *
 * Strings must be simplified extended ISO format date strings. Native Dates, moment.js moments and Luxon DateTimes are
 * converted to ISO 8601 date string in UTC by truncating any time part.
 *
 * If the first element of the array is undefined or null, then the range will be left-open.
 * If the second element of the array is undefined or null, then the range will be right-open.
 * If the both elements of the array are undefined or null, then undefined is returned.
 *
 * @param {(DateLike|Interval|Array.<DateLike>)} range - The date/time range
 *
 * @see {@link https://techdocs.iii.com/sierraapi/Content/zReference/queryParameters.htm#range_syntax}.
 */
function toDateRange(range) {
  if (!range) {
    return
  }

  if (typeof range === 'string') {
    return range
  }

  if (typeof range !== 'object') {
    throw new Error(`Invalid date/time range: ${range}`)
  }

  let from
  let to

  if (Array.isArray(range)) {
    from = range[0]
    to = range[1]
  } else if (typeof range.start === 'object' && typeof range.end === 'object') {
    from = range.start
    to = range.end.minus({ day: 1 }) // Luxon Intervals are end-exclusive, but date/time ranges are end-inclusive.
  } else if (typeof range.toISO === 'function') {
    return range.toISO().slice(0, 10)
  } else {
    return range.toISOString().slice(0, 10)
  }

  if (!from && !to) {
    return
  }

  const fromIsoString = _toIsoString(from) || ''
  const toIsoString = _toIsoString(to) || ''
  return `[${fromIsoString.slice(0, 10)},${toIsoString.slice(0, 10)}]`
}


/**
 * Makes a Sierra API date/time range from strings, dates, moments.js moments, Luxon DateTimes, or a Luxon Intervals.
 *
 * Does not validate the first date/time is earlier in time than the second date/time.
 *
 * If you give a string, it is assumed you've given an already a properly formed date/time range, and the arg is simply
 * returned.
 *
 * If the arg is undefined or null, undefined is returned.
 *
 * If you give a Luxon Interval, then the two DateTimes inside the Interval are used as to from the date/time range.
 * HOWEVER, Luxon Intervals do NOT include there endpoint, whereas Sierra API date/time ranges do. The Sierra API only
 * express date/time down to seconds, and not milliseconds. So 1 second will be subtracted from the Luxon Interval's
 * exclusive end to make the Sierra API date/time range's inclusive end.
 *
 * If you give a native Date, a moment.js moments or a Luxon DateTime (not in array), it is converted into a
 * ISO 8601 date/time strings in UTC. It is not put inside Sierra's range syntax; thus specifying just the date/time and
 * not a range of date/times.
 *
 * If you give an array, then the first element of the array is taken to be the start of the range and the second
 * argument is taken to be the end of the range.
 *
 * Strings must be simplified extended ISO format date/time strings. They must be in UTC and have a Z zone designator.
 * Native Dates, moment.js moments and Luxon DateTimes are converted to ISO 8601 date/time strings in UTC for you.
 *
 * If the first element of the array is undefined or null, then the range will be left-open.
 * If the second element of the array is undefined or null, then the range will be right-open.
 * If the both elements of the array are undefined or null, then undefined is returned.
 *
 * @param {(DateLike|Interval|Array.<DateLike>)} range - The date/time range
 *
 * @see {@link https://techdocs.iii.com/sierraapi/Content/zReference/queryParameters.htm#range_syntax}.
 */

function toDateTimeRange(range) {
  if (!range) {
    return
  }

  if (typeof range === 'string') {
    return range
  }

  if (typeof range !== 'object') {
    throw new Error(`Invalid date/time range: ${range}`)
  }

  let from
  let to

  if (Array.isArray(range)) {
    from = range[0]
    to = range[1]
  } else if (typeof range.start === 'object' && typeof range.end === 'object') {
    from = range.start
    to = range.end.minus({ second: 1 }) // Luxon Intervals are end-exclusive, but date/time ranges are end-inclusive.
  } else if (typeof range.toISO === 'function') {
    return range.toISO()
  } else {
    return range.toISOString()
  }

  if (!from && !to) {
    return
  }

  const fromIsoString = _toIsoString(from) || ''
  const toIsoString = _toIsoString(to) || ''
  return `[${fromIsoString},${toIsoString}]`
}


function _toIsoString(thing) {
  if (thing === undefined || thing === null) {
    return thing
  }
  if (typeof thing === 'object') {
    if (typeof thing.toISO === 'function') {
      return thing.toISO()
    }
    if (typeof thing.toISOString === 'function') {
      return thing.toISOString()
    }
    throw new Error(`Don't know how to convert to an ISO date/time string: ${thing}`)
  }
  return String(thing)
}


module.exports = {
  toDateRange,
  toDateTimeRange
}
