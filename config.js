'use strict'

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


const { URL } = require('url')


let {
  SIERRA_API_HOST: host,
  SIERRA_API_KEY: key,
  SIERRA_API_SECRET: secret,
  SIERRA_API_PATH: path,
} = process.env

if (typeof host === 'undefined') {
  throw new Error('The SIERRA_API_HOST environment variable is not set')
}
if (typeof key === 'undefined') {
  throw new Error('The SIERRA_API_KEY environment variable is not set')
}
if (typeof secret === 'undefined') {
  throw new Error('The SIERRA_API_SECRET environment variable is not set')
}
if (typeof path === 'undefined') {
  path = '/iii/sierra-api/'
}


let baseURL = new URL(path, `https://${host}/`)


module.exports = Object.freeze({ host, key, secret, baseURL })
