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


const expect = require('chai').expect
const jsv = require('jsverify')
const { Interval } = require('luxon')

const { chaiProperty, arbitrary } = require('../lib/test-support')

const { toDateRange, toDateTimeRange } = require('../lib/dt-utils')



describe('dt-utils', function () {

  describe('toDateTimeRange', function () {

    it('returns undefined if given undefined, null or empty strings', function () {
      expect(toDateTimeRange(undefined)).to.be.undefined
      expect(toDateTimeRange(null)).to.be.undefined
      expect(toDateTimeRange('')).to.be.undefined
      expect(toDateTimeRange([])).to.be.undefined
      expect(toDateTimeRange([undefined, undefined])).to.be.undefined
      expect(toDateTimeRange([null, null])).to.be.undefined
      expect(toDateTimeRange(['', ''])).to.be.undefined
    })

    chaiProperty(
      'passes through arbitrary non-empty strings',
      jsv.nestring,
      ( arg ) => {
        expect(toDateTimeRange(arg)).to.equal(arg)
      }
    )

    chaiProperty(
      'formats a single arbitrary date as an ISO date/time string',
      arbitrary.date,
      ( arg ) => {
        expect(toDateTimeRange(arg)).to.equal(arg.toISOString())
      }
    )

    chaiProperty(
      'formats a single arbitrary Luxon DateTime as an ISO date/time string',
      arbitrary.dateTime,
      ( arg ) => {
        expect(toDateTimeRange(arg)).to.equal(arg.toISO())
      }
    )

    chaiProperty(
      'formats a single arbitrary moment.js moment as an ISO date/time string',
      arbitrary.moment,
      ( arg ) => {
        expect(toDateTimeRange(arg)).to.equal(arg.toISOString())
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary ISO strings',
      arbitrary.isoDateTimeString,
      arbitrary.isoDateTimeString,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from},${to}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary ISO string',
      arbitrary.undefinedOrNull,
      arbitrary.isoDateTimeString,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[,${to}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary ISO string',
      arbitrary.isoDateTimeString,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from},]`)
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary dates',
      arbitrary.date,
      arbitrary.date,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from.toISOString()},${to.toISOString()}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary date',
      arbitrary.undefinedOrNull,
      arbitrary.date,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[,${to.toISOString()}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary date',
      arbitrary.date,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from.toISOString()},]`)
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary Luxon DateTime objects',
      arbitrary.dateTime,
      arbitrary.dateTime,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from.toISO()},${to.toISO()}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary Luxon DateTime',
      arbitrary.undefinedOrNull,
      arbitrary.dateTime,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[,${to.toISO()}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary Luxon DateTime',
      arbitrary.dateTime,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from.toISO()},]`)
      }
    )

    chaiProperty(
      'creates a closed range from an arbitrary Luxon Interval object',
      arbitrary.dateTime,
      arbitrary.period,
      ( from, period ) => {
        const inclusiveTo = from.plus(period)
        const exclusiveTo = inclusiveTo.plus({ second: 1})
        const interval = Interval.fromDateTimes(from, exclusiveTo)
        expect(toDateTimeRange(interval)).to.equal(`[${from.toISO()},${inclusiveTo.toISO()}]`)
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary moment.js moment objects',
      arbitrary.moment,
      arbitrary.moment,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from.toISOString()},${to.toISOString()}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary moment.js moment object',
      arbitrary.undefinedOrNull,
      arbitrary.moment,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[,${to.toISOString()}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary moment.js moment object',
      arbitrary.moment,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateTimeRange([from, to])).to.equal(`[${from.toISOString()},]`)
      }
    )

  })


  describe('toDateRange', function () {

    it('returns undefined if given undefined, null or empty strings', function () {
      expect(toDateRange(undefined)).to.be.undefined
      expect(toDateRange(null)).to.be.undefined
      expect(toDateRange('')).to.be.undefined
      expect(toDateRange([])).to.be.undefined
      expect(toDateRange([undefined, undefined])).to.be.undefined
      expect(toDateRange([null, null])).to.be.undefined
      expect(toDateRange(['', ''])).to.be.undefined
    })

    chaiProperty(
      'passes through arbitrary non-empty strings',
      jsv.nestring,
      ( arg ) => {
        expect(toDateRange(arg)).to.equal(arg)
      }
    )

    chaiProperty(
      'formats a single arbitrary date as an ISO date string',
      arbitrary.date,
      ( arg ) => {
        expect(toDateRange(arg)).to.equal(arg.toISOString().slice(0, 10))
      }
    )

    chaiProperty(
      'formats a single arbitrary Luxon DateTime as an ISO date/time string',
      arbitrary.dateTime,
      ( arg ) => {
        expect(toDateRange(arg)).to.equal(arg.toISO().slice(0, 10))
      }
    )

    chaiProperty(
      'formats a single arbitrary moment.js moment as an ISO date/time string',
      arbitrary.moment,
      ( arg ) => {
        expect(toDateRange(arg)).to.equal(arg.toISOString().slice(0, 10))
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary ISO strings',
      arbitrary.isoDateString,
      arbitrary.isoDateString,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from},${to}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary ISO string',
      arbitrary.undefinedOrNull,
      arbitrary.isoDateString,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[,${to}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary ISO string',
      arbitrary.isoDateString,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from},]`)
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary dates',
      arbitrary.date,
      arbitrary.date,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from.toISOString().slice(0, 10)},${to.toISOString().slice(0, 10)}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary date',
      arbitrary.undefinedOrNull,
      arbitrary.date,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[,${to.toISOString().slice(0, 10)}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary date',
      arbitrary.date,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from.toISOString().slice(0, 10)},]`)
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary Luxon DateTime objects',
      arbitrary.dateTime,
      arbitrary.dateTime,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from.toISO().slice(0, 10)},${to.toISO().slice(0, 10)}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary Luxon DateTime',
      arbitrary.undefinedOrNull,
      arbitrary.dateTime,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[,${to.toISO().slice(0, 10)}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary Luxon DateTime',
      arbitrary.dateTime,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from.toISO().slice(0, 10)},]`)
      }
    )

    chaiProperty(
      'creates a closed range from an arbitrary Luxon Interval object',
      arbitrary.dateTime,
      arbitrary.period,
      ( from, period ) => {
        const inclusiveTo = from.plus(period)
        const exclusiveTo = inclusiveTo.plus({ day: 1})
        const interval = Interval.fromDateTimes(from, exclusiveTo)
        expect(toDateRange(interval)).to.equal(`[${from.toISO().slice(0, 10)},${inclusiveTo.toISO().slice(0, 10)}]`)
      }
    )

    chaiProperty(
      'creates a closed range from two arbitrary moment.js moment objects',
      arbitrary.moment,
      arbitrary.moment,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from.toISOString().slice(0, 10)},${to.toISOString().slice(0, 10)}]`)
      }
    )

    chaiProperty(
      'creates a left-open range from an arbitrary moment.js moment object',
      arbitrary.undefinedOrNull,
      arbitrary.moment,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[,${to.toISOString().slice(0, 10)}]`)
      }
    )

    chaiProperty(
      'creates a right-open range from an arbitrary moment.js moment object',
      arbitrary.moment,
      arbitrary.undefinedOrNull,
      ( from, to ) => {
        expect(toDateRange([from, to])).to.equal(`[${from.toISOString().slice(0, 10)},]`)
      }
    )

  })

}) // describe('dt-utils'
