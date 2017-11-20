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


const ClientOAuth2 = require('client-oauth2')
const rp = require('request-promise-any')
const { URL } = require('url')



class SierraApiConnection_v4 {

  constructor({ apiHost, apiPath, apiKey, apiSecret } = {}) {
    this.apiHost = apiHost || process.env['SIERRA_API_HOST']
    if (!this.apiHost) {
      throw new Error('The SIERRA_API_HOST environment variable is not set')
    }
    this.apiPath = apiPath || process.env['SIERRA_API_PATH'] || '/iii/sierra-api/'
    this.apiKey = apiKey || process.env['SIERRA_API_KEY']
    if (!this.apiKey) {
      throw new Error('The SIERRA_API_KEY environment variable is not set')
    }
    this.apiSecret = apiSecret || process.env['SIERRA_API_SECRET']
    if (!this.apiSecret) {
      throw new Error('The SIERRA_API_SECRET environment variable is not set')
    }
    this.baseUrl = new URL(this.apiPath, `https://${this.apiHost}/`)
    this.baseUrlString = this.baseUrl.toString()
    this.oauth2Token = null
    this.sierraAuth =
        new ClientOAuth2({
          clientId: this.apiKey,
          clientSecret: this.apiSecret,
          accessTokenUri: new URL('v4/token', this.baseUrl).toString(),
        })
  }


  _resolveRelativeUrl(absoluteOrRelativeUrl) {
    let str = absoluteOrRelativeUrl.toString()
    if (this.isAbsolute(str)) {
      return new URL(str)
    } else {
      while (str.startsWith('/')) {
        str = str.slice(1)
      }
      return new URL(str, this.baseUrl)
    }
  }


  /**
   * Tests is a given URL is absolute for this configured api host and path.
   *
   * @param {string} urlString - A URL as a string, not as a URL object.
   * @returns {boolean} True if the URL is absolute.
   */
  isAbsolute(urlString) {
    return urlString.startsWith(this.baseUrlString)
  }


  /**
   * Submits a REST API request to Sierra.
   *
   * Ensures we have a valid oauth2 bearer token beforehand.
   *
   * @param {string} method - The HTTP method (GET, POST, etc.)
   * @param {string} apiUrl - The API URL. Absolute or relative.
   * @param {object} [qs] - The query string parameters
   * @param {object} [body] - An object that will JSON-serialised and sent as the body of the request.
   * @returns {Promise.<object>} - The parsed body of the API response.
   * @throws If the HTTP response is not have a 2xx status.
   */
  async request(method, apiUrl, { qs, body } = {}) {
    await this.authenticate()
    let absoluteUrl = this._resolveRelativeUrl(apiUrl)
    console.log(method, absoluteUrl.toString())
    return await rp({
      method,
      qs,
      body,
      url: absoluteUrl,
      json: true,
      followRedirect: false,
      gzip: true,
      auth: { bearer: this.oauth2Token.accessToken },
    })
  }


  /**
   * Submits a REST API request to Sierra using the GET HTTP method.
   *
   * Ensures we have a valid oauth2 bearer token beforehand.
   *
   * @async
   * @param {string} apiUrl - The API URL. Absolute or relative.
   * @param {object} [qs] - The query string parameters
   * @returns {Promise.<object>} - The parsed body of the API response.
   * @throws If the HTTP response is not have a 2xx status.
   */
  get(apiUrl, qs) {
    return this.request('GET', apiUrl, { qs })
  }


  /**
   * Submits a REST API request to Sierra using the GET HTTP method.
   *
   * Ensures we have a valid oauth2 bearer token beforehand.
   *
   * @async
   * @param {string} apiUrl - The API URL. Absolute or relative.
   * @param {object} [qs] - The query string parameters
   * @param {object} [body] - An object that will JSONified and sent as the body of the request.
   * @returns {Promise.<object>} - The parsed body of the API response.
   * @throws If the HTTP response is not have a 2xx status.
   */
  post(apiUrl, qs, body) {
    return this.request('POST', apiUrl, { qs, body })
  }


  /**
   * Ensures we have a non-expired bearer token.
   *
   * If this.oauth2Token is null or this.oauth2Token.expires is in the past,
   * then attempts to get a new oauth2 token.
   *
   * This is called by request (and directly by get, post, etc.) for you.
   * So you don't normally have to worry about this.
   *
   * @async
   */
  async authenticate() {
    if (this.oauth2Token !== null && this.oauth2Token.expires < new Date()) {
      this.oauth2Token = null
    }
    if (this.oauth2Token === null) {
      this.oauth2Token = await this.sierraAuth.credentials.getToken()
    }
  }

}


module.exports = new SierraApiConnection_v4()
