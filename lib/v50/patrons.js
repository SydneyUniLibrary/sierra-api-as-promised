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


const { AbsoluteV5ApiUrl, RecordId, RecordNumber, RelativeV5ApiUrl } = require('@sydneyunilibrary/sierra-record-id')

const { SierraPatronApi_v40 } = require('../v40/patrons')


class SierraPatronApi_v50 extends SierraPatronApi_v40 {

  _resolveIdOrUrlToApiUrl(idOrUrl) {
    let recordId
    if (idOrUrl instanceof RecordId) {
      recordId = idOrUrl
    } else {
      idOrUrl = idOrUrl.toString()
      if (this._connection.isAbsolute(idOrUrl)) {
        recordId = new AbsoluteV5ApiUrl(idOrUrl)
      } else {
        recordId = new RecordNumber(idOrUrl)
      }
    }
    return recordId.convertTo(RelativeV5ApiUrl, { recordTypeCode: 'p'}).toString()
  }

}


module.exports = {
  SierraPatronApi_v50
}