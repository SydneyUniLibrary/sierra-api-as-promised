# sierra-api-as-promised
Simplifies access to the Sierra REST APIs from Node.js.




----

## How to use

```
npm install 'SydneyUniLibrary/sierra-api-as-promised#v0.1'
```

Create a .env file in the root directory of your project, like the following.

```
SIERRA_API_HOST=sierra.library.edu
SIERRA_API_KEY="my-api-key"
SIERRA_API_SECRET="my-api-secret"
```

> **Never** commit this .env file into a source control repository.

In your code, require the library.

```javascript
const sierraAPI = require('@sydneyunilibrary/sierra-api-as-promised').v4
```

> Note the `.v4` after `require(…)`. These is necessary.




----

## Calling the API

### Authentication and bearer tokens

sierra-api-as-promised will take care of authenicating using `SIERRA_API_KEY` and `SIERRA_API_SECRET`
and obtaining a bearer token on your behalf. It will do this when you make the first API call.
It will reuse the bearer token until it expires, typically after 1 hour.
After the bearer token expires, the next API call will reauthenticate and obtain a new bearer token.
 
 


----

## Configuration

Configurate sierra-api-as-promised by setting environment variables.

### Envrionment variables

Variable          | Description                                   | Default
------------------|-----------------------------------------------|------------------
SIERRA_API_HOST   | The hostname of the Sirrea application server | 
SIERRA_API_KEY    | A Sierra API key                              |
SIERRA_API_SECRET | The secret (password) matching the API key    |
SIERRA_API_PATH   | The URL path for the Sierra API (\*1)         | /iii/sierra-api/

(\*1) `SIERRA_API_PATH` must not include the API version in the path. `/iii/sierra-api/` is correct. `/iii/sierra-api/v4/` is not.

### .env file

A .env file in your project's base directory, where `package.json` is, will be loaded by [dotenv](https://github.com/motdotla/dotenv)
as part of requiring sierra-api-as-promised. Anything in here, including other variables than those used by this library, will be added
to your envrionment and will be accessible via `process.env`.

When dotenv loads the .env file, it will not change any environment variables that are already defined. You can't use
to it redefine something like `PATH`. This also means that if you set `SIERRA_API_HOST`, for example, in your environment
before running your code, the value you set will take precedence over the value in the .env file.




----

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
