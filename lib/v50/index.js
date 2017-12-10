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


const { SierraPatronApi_v50 } = require('./patrons')


async function initialiseConnection_v50(sierraAPIConnection) {
  sierraAPIConnection.apiMajorVersion = 5
  sierraAPIConnection.apiMinorVersion = 0
  sierraAPIConnection.urlVersion = 'v5'
  sierraAPIConnection.patrons = new SierraPatronApi_v50(sierraAPIConnection)
}


module.exports = {
  initialiseConnection_v50
}