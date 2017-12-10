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


const { SierraAPIConnection } = require('./lib/connection')


/**
 * Creates a connection to the Sierra API using the latest API version supported by other the Sierra host and this library.
 *
 * This is an expensive function. Call it once and store the returned connection.
 *
 * @param {Object} [configuration] - An object with configuration that overrides any process environment variables.
 * @param {String} [configuration.apiHost] - The hostname of the Sierra application server. Defaults to SIERRA_API_HOST env var.
 * @param {String} [configuration.apiPath] - The URL path for the Sierra API. Defaults to SIERRA_API_PATH env var,
 *                                           or '/iii/sierra-api/' if SIERRA_API_PATH env var is not set.
 * @param {String} [configuration.apiKey] - A Sierra API key. Defaults to SIERRA_API_KEY env var.
 * @param {String} [configuration.apiSecret] - The secret (password) matching the API key. Defaults to SIERRA_API_SECRET env var.
 * @returns {Promise.<SierraAPIConnection>}
 */
async function SierraAPIAsPromised(configuration = {}) {
  const connection = new SierraAPIConnection(configuration)
  return await connection._initialise()
}


module.exports = {
  SierraAPIAsPromised
}
