# sierra-api-as-promised
Simplifies access to the Sierra REST APIs from Node.js.




## How to use

```
npm install 'SydneyUniLibrary/sierra-api-as-promised#v0.4.2'
```

Set up the following variables in process's environment.

```
SIERRA_API_HOST=sierra.library.edu
SIERRA_API_KEY="my-api-key"
SIERRA_API_SECRET="my-api-secret"
```

In your code, require the library.

```javascript
const { SierraAPIAsPromised } = require('@sydneyunilibrary/sierra-api-as-promised')

const sierraApi = await SierraAPIAsPromised()
```

Alternatively, you can pass the API host, key and secret directly.

```javascript
const { SierraAPIAsPromised } = require('@sydneyunilibrary/sierra-api-as-promised')

const sierraApi = await SierraAPIAsPromised({
  apiHost: 'sierra.library.edu',
  apiKey: 'my-api-key',
  apiSecret: 'my-api-secret'
})
```




## Calling the API

See [the Wiki](https://github.com/SydneyUniLibrary/sierra-api-as-promised/wiki). 

### Example 1

The following Node.js v8 script prints the entries in the Patron Type table. 

```javascript
'use strict'

const { SierraAPIAsPromised } = require('@sydneyunilibrary/sierra-api-as-promised')

async function printPatronTypes() {
  const sierraAPI = await SierraAPIAsPromised()
  let metadataArray = await sierraAPI.patrons.getMetadata({ fields: 'patronType' })
  for (let metadata of metadataArray) {
    console.log('\nTable: %s\n', metadata.field)
    console.log('Code\tDesc')
    for (let metadataValue of metadata.values) {
      console.log('%s\t%s', metadataValue.code, metadataValue.desc)
    }
  }
}

printPatronTypes().catch(console.error)
```


### Example 2

The following Node.js v8 script submits a query equivalent to the following classic Boolean Search
and then exports some of the patron record fields as a tab-delimited file.

Term | Operator | _ | Type   | Field      | Condition                | Value A | Value B | _
-----|----------|---|--------|------------|--------------------------|---------|---------|---
1    |          |   | PATRON | TOT CHKOUT | greater than             | 100     |         | 
2    | AND      | ( | PATRON | MONEY OWED | greater than or equal to | 20      |         |
3    | OR       |   | PATRON | OD PENALTY | greater than or equal to | 5       |         | )

So that this example is not too long and complicated, it only exports the first 10 patrons.

```javascript
'use strict'

const { SierraAPIAsPromised } = require('@sydneyunilibrary/sierra-api-as-promised')

async function findAndExportPatrons() {

  const sierraAPI = await SierraAPIAsPromised()

  const booleanSearch = [
    {
      'target': { 'record': { 'type': 'patron' }, 'id': 48 /* TOT CHKOUT */ },
      'expr': { 'op': 'greater_than', 'operands': [ '100' ] },
    },
    'and',
    [
      {
        'target': { 'record': { 'type': 'patron' }, 'id': 96 /* MONEY OWED */ },
        'expr': { 'op': 'greater_than_or_equal', 'operands': [ '20' ] },
      },
      'or',
      {
        'target': { 'record': { 'type': 'patron' }, 'id': 105 /* OD PENALTY */ },
        'expr': { 'op': 'greater_than_or_equal', 'operands': [ '5' ] },
      },
    ],
  ]

  const exportFields = [
      'id',
      'barcodes',
      'patronType',
      'homeLibraryCode',
      'moneyOwed',
  ]

  /* Submit the query, getting back a list of links (full URLs to the patron) */
  let patronLinks = await sierraAPI.patrons.query(0, 10, booleanSearch)

  /* Transform the list of links to a list of IDs */
  let patronIDs = patronLinks.entries.map(({ link }) => link.substr(link.lastIndexOf('/') + 1))

  /* The patron records with those IDs */
  let patronResultSet = await sierraAPI.patrons.getPatrons({ id: patronIDs, fields: exportFields })

  /* Export the patrons as a tab-delimited file */
  console.log(exportFields.join('\t'))
  for (let patron of patronResultSet.entries) {

    let values = exportFields.map(fieldName => {
      let v = patron[ fieldName ] || ''

      /* Flatten an Array with a single value into just its value. */
      if (Array.isArray(v) && v.length === 1) {
        v = v[0]
      }
      /* Export non-simple values as JSON. */
      if (typeof v !== 'string') {
        v = JSON.stringify(v)
      }

      return v
    })

    console.log(values.join('\t'))
  }

}

findAndExportPatrons().catch(console.error)
```




## Configuration

Configure sierra-api-as-promised by setting the environment variables in your process.

### Envrionment variables

Variable          | Description                                   | Default
------------------|-----------------------------------------------|------------------
SIERRA_API_HOST   | The hostname of the Sierra application server | 
SIERRA_API_KEY    | A Sierra API key                              |
SIERRA_API_SECRET | The secret (password) matching the API key    |
SIERRA_API_PATH   | The URL path for the Sierra API (\*1)         | /iii/sierra-api/

(\*1) `SIERRA_API_PATH` must not include the API version in the path. `/iii/sierra-api/` is correct. `/iii/sierra-api/v4/` is not.




## License

Copyright (c) 2017  The University of Sydney Library

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
