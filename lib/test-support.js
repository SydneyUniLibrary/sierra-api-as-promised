/*
 * Copyright (C) 2017  The University of Sydney Library
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


'use strict'


const jsv = require('jsverify')
const { DateTime } = require('luxon')
const moment = require('moment')


const _DEFAULT_JSV_ASSERT_OPTIONS = Object.freeze({ tests: process.env['JSV_TESTS'] || 100 })

function chaiProperty(...jsverifyPropertyArgs) {
  const [ name, ...arbs ] = jsverifyPropertyArgs
  const propCheckFn = arbs.pop()
  const jsvAssertOptions = (
    typeof arbs[arbs.length - 1] === 'object'
    && typeof(arbs[arbs.length - 1].generator) !== 'function'
      ? Object.assign({}, _DEFAULT_JSV_ASSERT_OPTIONS, arbs.pop())
      : Object.assign({}, _DEFAULT_JSV_ASSERT_OPTIONS)  // Grr. jsv.assert mutates jsvAssertOptions
  )
  it(name, function () {
    jsv.assert(
      jsv.forall(...arbs, (...values) => {
        propCheckFn(...values)
        return true
      }),
      jsvAssertOptions
    )
  })
}



const MINIMUM_TEST_TIME = 631152000000 // '1990-01-01T00:00:00.000Z'
const MAXIMUM_TEST_TIME = 2524607999999 // '2049-12-31T23:59:59.999Z'

const ARBITRARY_TIME = jsv.integer(MINIMUM_TEST_TIME, MAXIMUM_TEST_TIME)
const ARBITRARY_PERIOD = jsv.integer(1, Math.floor((MAXIMUM_TEST_TIME - MINIMUM_TEST_TIME) / 2))

const ARBITRARY_DATE = (
  ARBITRARY_TIME.smap(
    time => new Date(time),
    date => date.getTime()
  )
)

const ARBITRARY_DATETIME = (
  ARBITRARY_TIME.smap(
    time => DateTime.fromMillis(time),
    datetime => datetime.valueOf()
  )
)

const ARBITRARY_MOMENT = (
  ARBITRARY_TIME.smap(
    time => moment(time),
    moment => moment.valueOf()
  )
)

const ARBITRARY_ISO_DATE_TIME_STRING = (
  ARBITRARY_TIME.smap(
    time => new Date(time).toISOString(),
    date => new Date(date).getTime()
  )
)

const ARBITRARY_ISO_DATE_STRING = (
  ARBITRARY_TIME.smap(
    time => new Date(time).toISOString().slice(0, 10),
  )
)


const ARBITRARY_UNDEFINED_OR_NULL = jsv.oneof([ jsv.constant(undefined), jsv.constant(null) ])


module.exports = {

  chaiProperty,

  arbitrary: {

    date: ARBITRARY_DATE,
    dateTime: ARBITRARY_DATETIME,
    moment: ARBITRARY_MOMENT,
    period: ARBITRARY_PERIOD,
    isoDateString: ARBITRARY_ISO_DATE_STRING,
    isoDateTimeString: ARBITRARY_ISO_DATE_TIME_STRING,
    time: ARBITRARY_TIME,

    undefinedOrNull: ARBITRARY_UNDEFINED_OR_NULL,

  }

}
