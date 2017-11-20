'use strict'

const sierraApi = require('.').v4

async function test() {

let patronLink = await sierraAPI.patrons.createPatron({
  emails: [ 'jsmith@my.edu', 'john.smith@example.com' ],
  names: [ 'John Smith' ],
  addreses: [
    {
      lines: [ '1 Home Ave', 'Plesentville' ],
      type: 'h'
    },
    {
      lines: [ '100 Corporate Lane', 'Econoville' ],
      type: 'a'
    },
  ],
  phones: [
    {
      number: '555-123-4567',
      type: 'p'
    },
  ],
  pin: '1111',
  barcodes: [ '0987654321' ],
  patronType: 34,
  expirationDate: '2018-01-01',
  birthDate: '1969-12-31',
  patronCodes: { pcode1: 'a', pcode2: 'b', pcode3: 3 },
  blockInfo: { code: 'm' }
})

}


findAndExportPatrons().catch(console.error)
