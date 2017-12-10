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


const { AbsoluteV4ApiUrl, RecordId, RecordNumber, RelativeV4ApiUrl } = require('@sydneyunilibrary/sierra-record-id')

const { toDateRange, toDateTimeRange } = require('../dt-utils')
const qsUtils = require('../qs-utils')


class SierraPatronApi_v40 {

  constructor(sierraAPIConnection) {
    this._connection = sierraAPIConnection
  }


  getCheckout(checkoutIdOrUrl, { fields } = {}) {
    const apiUrl = this._resolveCheckoutIdOrUrlToApiUrl(checkoutIdOrUrl)
    fields = qsUtils.joinArray(fields)
    return this._connection.get(apiUrl, { fields })
  }


  getPatrons({ limit, offset, id, fields, createdDate, updatedDate, deletedDate, deleted, suppressed } = {}) {
    createdDate = toDateTimeRange(createdDate)
    updatedDate = toDateTimeRange(updatedDate)
    deletedDate = toDateRange(deletedDate)
    id = qsUtils.joinArray(id)
    fields = qsUtils.joinArray(fields)
    return this._connection.get(
        `/${this._connection.urlVersion}/patrons/`,
        { limit, offset, id, fields, createdDate, updatedDate, deletedDate, deleted, suppressed },
    )
  }


  getPatronByRecordId(idOrUrl, { fields } = {}) {
    fields = qsUtils.joinArray(fields)
    const apiUrl = this._resolveIdOrUrlToApiUrl(idOrUrl)
    return this._connection.get(apiUrl, { fields })
  }


  getPatronCheckouts(idOrUrl, { limit, offset, fields } = {}) {
    fields = qsUtils.joinArray(fields)
    const apiUrl = `${this._resolveIdOrUrlToApiUrl(idOrUrl)}/checkouts`
    return this._connection.get(apiUrl, { limit, offset, fields })
  }


  getPatronFines(idOrUrl, { limit, offset, fields, assessedDate } = {}) {
    assessedDate = toDateTimeRange(assessedDate)
    fields = qsUtils.joinArray(fields)
    const apiUrl = `${this._resolveIdOrUrlToApiUrl(idOrUrl)}/fines`
    return this._connection.get(apiUrl, { limit, offset, fields, assessedDate })
  }


  getPatronHolds(idOrUrl, { limit, offset, fields } = {}) {
    fields = qsUtils.joinArray(fields)
    const apiUrl = `${this._resolveIdOrUrlToApiUrl(idOrUrl)}/holds`
    return this._connection.get(apiUrl, { limit, offset, fields })
  }


  getMetadata({ fields, language } = {}) {
    fields = qsUtils.joinArray(fields)
    return this._connection.get(`/${this._connection.urlVersion}/patrons/metadata`, { fields, language })
  }


  query(offset, limit, queryParameters) {
    return this._connection.post(`/${this._connection.urlVersion}/patrons/query`, { offset, limit }, queryParameters)
  }


  renewCheckout(checkoutIdOrUrl, { acceptLanguage } = {}) {
    // TODO: Set the Accept-Language request header if acceptLanguage is defined
    const apiUrl = `${this._resolveCheckoutIdOrUrlToApiUrl(checkoutIdOrUrl)}/renewal`
    return this._connection.post(apiUrl)
  }


  _resolveIdOrUrlToApiUrl(idOrUrl) {
    let recordId
    if (idOrUrl instanceof RecordId) {
      recordId = idOrUrl
    } else {
      idOrUrl = idOrUrl.toString()
      if (this._connection.isAbsolute(idOrUrl)) {
        recordId = new AbsoluteV4ApiUrl(idOrUrl)
      } else {
        recordId = new RecordNumber(idOrUrl)
      }
    }
    return recordId.convertTo(RelativeV4ApiUrl, { recordTypeCode: 'p'}).toString()
  }


  _resolveCheckoutIdOrUrlToApiUrl(checkoutIdOrUrl) {
    const str = checkoutIdOrUrl.toString()
    if (this._connection.isAbsolute(str)) {
      return checkoutIdOrUrl
    } else {
      return `/${this._connection.urlVersion}/patrons/checkouts/${checkoutIdOrUrl}`
    }
  }

}


module.exports = {
  SierraPatronApi_v40
}
