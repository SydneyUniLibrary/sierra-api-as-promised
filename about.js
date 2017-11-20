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


const config = require('./config')
const rp = require('request-promise-any')
const { URL } = require('url')


function about({ host, baseURL } = config) {
  const aboutURL = new URL('about', baseURL)
  return (
      rp({ uri: aboutURL, json: true })
      .catch(err => {
        throw new Error(`Failed to get the Sierra API about page from ${host}: ${err}`)
      })
  )
}


module.exports = about
