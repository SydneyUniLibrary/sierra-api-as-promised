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
const config = require('../config')
const rp = require('request-promise-any')
const { URL } = require('url')



class SierraApiConnection_v4 {

  constructor({ host, key, secret, baseURL } = config) {
    this.host = host
    this.key = key
    this.secret = secret
    this.baseURL = new URL('v4/', baseURL)
    this.oauth2Token = null
    this.sierraAuth =
        new ClientOAuth2({
          clientId: this.key,
          clientSecret: this.secret,
          accessTokenUri: new URL('v4/token', baseURL).toString(),
        })
  }


  /**
   * Submits a REST API request to Sierra.
   *
   * Ensures we have a valid oauth2 bearer token beforehand.
   *
   * @param {string} method - The HTTP method (GET, POST, etc.)
   * @param {string} apiURL - The API URL. Absolute, or relative to this.baseURL.
   * @param {object} [qs] - The query string parameters
   * @param {object} [body] - An object that will JSON-serialised and sent as the body of the request.
   * @returns {Promise.<object>} - The parsed body of the API response.
   * @throws If the HTTP response is not have a 2xx status.
   */
  async request(method, apiURL, { qs, body } = {}) {
    await this.authenticate()
    let absoluteURL = apiURL.startsWith(this.baseURL) ? apiURL : new URL(apiURL, this.baseURL)
    return rp({
      method,
      qs,
      body,
      url: absoluteURL,
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
   * @param {string} apiURL - The API URL. Absolute, or relative to this.baseURL.
   * @param {object} [qs] - The query string parameters
   * @returns {Promise.<object>} - The parsed body of the API response.
   * @throws If the HTTP response is not have a 2xx status.
   */
  async get(apiURL, qs) {
    return this.request('GET', apiURL, { qs })
  }


  /**
   * Submits a REST API request to Sierra using the GET HTTP method.
   *
   * Ensures we have a valid oauth2 bearer token beforehand.
   *
   * @param {string} apiURL - The API URL. Absolute, or relative to this.baseURL.
   * @param {object} [qs] - The query string parameters
   * @param {object} [body] - An object that will JSONified and sent as the body of the request.
   * @returns {Promise.<object>} - The parsed body of the API response.
   * @throws If the HTTP response is not have a 2xx status.
   */
  async post(apiURL, qs, body) {
    return this.request('POST', apiURL, { qs, body })
  }


  /**
   * Ensures we have a non-expired bearer token.
   *
   * If this.oauth2Token is null or this.oauth2Token.expires is in the past,
   * then attempts to get a new oauth2 token.
   *
   * This is called by request (and directly by get, post, etc.) for you.
   * So you don't normally have to worry about this.
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
