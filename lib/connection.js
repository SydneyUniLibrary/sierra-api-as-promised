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


const ClientOAuth2 = require('client-oauth2')
const rp = require('request-promise-any')
const { URL } = require('url')


/**
 * DO NOT create a SierraAPIConnection directly. Instead, use the SierraAPIAsPromised function.
 *
 * If you do create a SierraAPIConnection object yourself, the object is not ready until after the Promise returned by
 * _initialize resolves (or await _initialize() returns).
 */
class SierraAPIConnection {

  /**
   * Tests is a given URL is absolute for this configured api host and path.
   *
   * @param {string} urlString - A URL as a string, not as a URL object.
   * @returns {boolean} True if the URL is absolute.
   */
  isAbsolute(urlString) {
    return urlString.startsWith(this.baseUrlString)
  }


  isCompatibleWithVersion(majorVersion, minorVersion) {
    const majorMap = this._compatabilityMap.get(majorVersion)
    return !!(majorMap && majorMap.get(minorVersion))
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
  async get(apiUrl, qs) {
    return await this.request('GET', apiUrl, { qs })
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
  async post(apiUrl, qs, body) {
    return await this.request('POST', apiUrl, { qs, body })
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


  constructor({ apiHost, apiPath, apiKey, apiSecret }) {
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

    this._baseUrl = new URL(this.apiPath, `https://${this.apiHost}/`)
    this._baseUrlString = this._baseUrl.toString()

    // These are set in _initialise
    this.about = null
    this._compatabilityMap = null
    this.oauth2Token = null
    this.sierraAuth = null

    // These are set in _initialiseConnection_vxx functions
    this.patrons = null
    this.urlVersion = null
  }


  async _initialise() {
    try {
      this.about = await rp({ uri: new URL(`https://${this.apiHost}${this.apiPath}about`), json: true })
    } catch (err) {
      throw new Error(`Failed to get the Sierra API about info from ${this.apiHost}: ${err}`)
    }

    this._compatabilityMap = new Map([ [ this.about.majorVersion, new Map([ [ this.about.minorVersion, true] ]) ] ])
    for (const versionString of this.about.compatibleVersions.split(',')) {
      const matches = /^\s*(\d+)\.(\d+)\s*$/.exec(versionString)
      if (!matches) {
        throw new Error(`Failed to parse about's compatibleVersions: ${about.compatibleVersions}: not a valid version: ${versionString}`)
      }
      const majorVersion = Number.parseInt(matches[1])
      let majorMap = this._compatabilityMap.get(majorVersion)
      if (!majorMap) {
        majorMap = new Map()
        this._compatabilityMap.set(majorVersion, majorMap)
      }
      const minorVersion = Number.parseInt(matches[2])
      if (!majorMap.has(minorVersion)) {
        majorMap.set(minorVersion, true)
      }
    }

    if (this.isCompatibleWithVersion(5, 0)) {
      const { initialiseConnection_v50 } = require('./v50')
      await initialiseConnection_v50(this)
    } else if (this.isCompatibleWithVersion(4, 0)) {
      const { initialiseConnection_v40 } = require('./v40')
      await initialiseConnection_v40(this)
    } else {
      throw new Error(`${this.apiHost}, running Sierra ${this.about.sierraVersion}, does not have an API version that sierra-api-as-promised supports`)
    }

    this.sierraAuth = new ClientOAuth2({
      clientId: this.apiKey,
      clientSecret: this.apiSecret,
      accessTokenUri: new URL(`${this.urlVersion}/token`, this._baseUrl).toString(),
    })

    return this
  }


  _resolveRelativeUrl(absoluteOrRelativeUrl) {
    let str = absoluteOrRelativeUrl.toString()
    if (this.isAbsolute(str)) {
      return new URL(str)
    } else {
      while (str.startsWith('/')) {
        str = str.slice(1)
      }
      return new URL(str, this._baseUrl)
    }
  }

}


module.exports = {
  SierraAPIConnection
}
