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


const qsUtils = require('../qs-utils')


class SierraPatronApi_v4 {

  constructor(connection) {
    this.connection = connection
  }


  getCheckout(checkoutIdOrURL, { fields } = {}) {
    checkoutIdOrURL = checkoutIdOrURL.toString()
    let url = checkoutIdOrURL.indexOf('://') === -1 ? `patrons/checkouts/${checkoutIdOrURL}` : checkoutIdOrURL
    fields = qsUtils.joinArray(fields)
    return this.connection.get(url, { fields })
  }


  getPatrons({ limit, offset, id, fields, createdDate, updatedDate, deletedDate, deleted, suppressed } = {}) {
    id = qsUtils.joinArray(id)
    fields = qsUtils.joinArray(fields)
    return this.connection.get(
        'patrons/',
        { limit, offset, id, fields, createdDate, updatedDate, deletedDate, deleted, suppressed },
    )
  }


  getPatronByRecordId(idOrURL, { fields } = {}) {
    idOrURL = idOrURL.toString()
    let url = idOrURL.indexOf('://') === -1 ? `patrons/${idOrURL}` : idOrURL
    fields = qsUtils.joinArray(fields)
    return this.connection.get(url, { fields })
  }


  getPatronCheckouts(idOrURL, { limit, offset, fields } = {}) {
    idOrURL = idOrURL.toString()
    let url = idOrURL.indexOf('://') === -1 ? `patrons/${idOrURL}/checkouts` : `${idOrURL}/checkouts`
    fields = qsUtils.joinArray(fields)
    return this.connection.get(url, { limit, offset, fields })
  }


  getMetadata({ fields, language } = {}) {
    fields = qsUtils.joinArray(fields)
    return this.connection.get('patrons/metadata', { fields, language })
  }


  query(offset, limit, queryParameters) {
    return this.connection.post('patrons/query', { offset, limit }, queryParameters)
  }


  renewCheckout(checkoutIdOrURL, { acceptLanguage } = {}) {
    // TODO: Set the Accept-Language request header if acceptLanguage is defined
    checkoutIdOrURL = checkoutIdOrURL.toString()
    let url = checkoutIdOrURL.indexOf('://') === -1
        ? `patrons/checkouts/${checkoutIdOrURL}/renewal`
        : `${checkoutIdOrURL}/renewal`
    return this.connection.post(url)
  }

}


module.exports = SierraPatronApi_v4
