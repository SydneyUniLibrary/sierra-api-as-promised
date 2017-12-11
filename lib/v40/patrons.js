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

  createHold(patronIdOrUrl, recordType, recordNumber, pickupLocation, { neededBy, numberOfCopies, note} = {}) {
    const apiUrl = `${this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)}/holds/requests`
    return this._connection.post(
      apiUrl,
      undefined,
      { recordType, recordNumber, pickupLocation, neededBy, numberOfCopies, note }
    )
  }


  createPatron(patronPatch) {
    return this._connection.post(`/${this._connection.urlVersion}/patrons/`, undefined, patronPatch)
  }


  deleteAllHoldsForPatron(patronIdOrUrl, { acceptLanguage } = {}) {
    // TODO: Set the Accept-Language request header if acceptLanguage is defined
    const apiUrl = `${this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)}/holds`
    return this._connection.delete(apiUrl)
  }


  deleteHold(holdIdOrUrl, { acceptLanguage } = {}) {
    // TODO: Set the Accept-Language request header if acceptLanguage is defined
    const apiUrl = this._resolveHoldIdOrUrlToApiUrl(holdIdOrUrl)
    return this._connection.delete(apiUrl)
  }


  deletePatron(patronIdOrUrl) {
    const apiUrl = this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)
    return this._connection.delete(apiUrl)
  }


  findPatronWithBarcode(barcode, { fields } = {}) {
    fields = qsUtils.joinArray(fields)
    return this._connection.get(`/${this._connection.urlVersion}/patrons/find`, { barcode, fields })
  }


  getCheckout(checkoutIdOrUrl, { fields } = {}) {
    const apiUrl = this._resolveCheckoutIdOrUrlToApiUrl(checkoutIdOrUrl)
    fields = qsUtils.joinArray(fields)
    return this._connection.get(apiUrl, { fields })
  }


  getFine(fineIdOrUrl, { fields } = {}) {
    const apiUrl = this._resolveFineIdOrUrlToApiUrl(fineIdOrUrl)
    fields = qsUtils.joinArray(fields)
    return this._connection.get(apiUrl, { fields })
  }


  getHold(holdIdOrUrl, { fields } = {}) {
    const apiUrl = this._resolveHoldIdOrUrlToApiUrl(holdIdOrUrl)
    fields = qsUtils.joinArray(fields)
    return this._connection.get(apiUrl, { fields })
  }


  getMetadata({ fields, language } = {}) {
    fields = qsUtils.joinArray(fields)
    return this._connection.get(`/${this._connection.urlVersion}/patrons/metadata`, { fields, language })
  }


  getPatron(patronIdOrUrl, { fields } = {}) {
    fields = qsUtils.joinArray(fields)
    const apiUrl = this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)
    return this._connection.get(apiUrl, { fields })
  }


  listCheckoutsForPatron(patronIdOrUrl, { limit, offset, fields } = {}) {
    fields = qsUtils.joinArray(fields)
    const apiUrl = `${this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)}/checkouts`
    return this._connection.get(apiUrl, { limit, offset, fields })
  }


  listCheckoutHistroyForPatron(patronIdOrUrl, { limit, offset, fields, sortField, sortOrder } = {}) {
    fields = qsUtils.joinArray(fields)
    const apiUrl = `${this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)}/checkouts/history`
    return this._connection.get(apiUrl, { limit, offset, fields, sortField, sortOrder })
  }


  listFinesForPatron(patronIdOrUrl, { limit, offset, fields, assessedDate } = {}) {
    assessedDate = toDateTimeRange(assessedDate)
    fields = qsUtils.joinArray(fields)
    const apiUrl = `${this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)}/fines`
    return this._connection.get(apiUrl, { limit, offset, fields, assessedDate })
  }


  listHoldsForPatron(patronIdOrUrl, { limit, offset, fields } = {}) {
    fields = qsUtils.joinArray(fields)
    const apiUrl = `${this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)}/holds`
    return this._connection.get(apiUrl, { limit, offset, fields })
  }


  listPatrons({ limit, offset, id, fields, createdDate, updatedDate, deletedDate, deleted, suppressed } = {}) {
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


  query(offset, limit, queryParameters) {
    return this._connection.post(`/${this._connection.urlVersion}/patrons/query`, { offset, limit }, queryParameters)
  }


  renewCheckout(checkoutIdOrUrl, { acceptLanguage } = {}) {
    // TODO: Set the Accept-Language request header if acceptLanguage is defined
    const apiUrl = `${this._resolveCheckoutIdOrUrlToApiUrl(checkoutIdOrUrl)}/renewal`
    return this._connection.post(apiUrl)
  }


  updateHold(holdIdOrUrl, { pickupLocation, freeze, acceptLanguage } = {}) {
    // TODO: Set the Accept-Language request header if acceptLanguage is defined
    const apiUrl = this._resolveHoldIdOrUrlToApiUrl(holdIdOrUrl)
    return this._connection.put(apiUrl, undefined, { pickupLocation, freeze })
  }


  updatePatron(patronIdOrUrl, patronPatch) {
    const apiUrl = this._resolvePatronIdOrUrlToApiUrl(patronIdOrUrl)
    return this._connection.put(apiUrl, undefined, patronPatch)
  }


  validatePIN(barcode, pin) {
    const apiUrl = `/${this._connection.urlVersion}/patrons/validate`
    return this._connection.post(apiUrl, undefined, { barcode, pin })
  }


  constructor(sierraAPIConnection) {
    this._connection = sierraAPIConnection
  }


  _resolveCheckoutIdOrUrlToApiUrl(checkoutIdOrUrl) {
    const str = checkoutIdOrUrl.toString()
    if (this._connection.isAbsolute(str)) {
      return checkoutIdOrUrl
    } else {
      return `/${this._connection.urlVersion}/patrons/checkouts/${checkoutIdOrUrl}`
    }
  }


  _resolveFineIdOrUrlToApiUrl(fineIdOrUrl) {
    const str = fineIdOrUrl.toString()
    if (this._connection.isAbsolute(str)) {
      return fineIdOrUrl
    } else {
      return `/${this._connection.urlVersion}/patrons/fines/${fineIdOrUrl}`
    }
  }


  _resolveHoldIdOrUrlToApiUrl(holdIdOrUrl) {
    const str = holdIdOrUrl.toString()
    if (this._connection.isAbsolute(str)) {
      return holdIdOrUrl
    } else {
      return `/${this._connection.urlVersion}/patrons/holds/${holdIdOrUrl}`
    }
  }


  _resolvePatronIdOrUrlToApiUrl(patronIdOrUrl) {
    let recordId
    if (patronIdOrUrl instanceof RecordId) {
      recordId = patronIdOrUrl
    } else {
      patronIdOrUrl = patronIdOrUrl.toString()
      if (this._connection.isAbsolute(patronIdOrUrl)) {
        recordId = new AbsoluteV4ApiUrl(patronIdOrUrl)
      } else {
        recordId = new RecordNumber(patronIdOrUrl)
      }
    }
    return recordId.convertTo(RelativeV4ApiUrl, { recordTypeCode: 'p'}).toString()
  }

}


module.exports = {
  SierraPatronApi_v40
}
