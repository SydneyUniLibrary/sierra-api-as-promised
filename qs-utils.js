"use strict"

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


/**
 * Joins all elements of an array into a string.
 * However if arr is not an array, then it just returns that non-array thing.
 *
 * Use this function with API parameters that the require a comma separated list of things.
 * The function will allow the API client to supply a single thing or an array of things.
 *
 * @param {(Array|*)} arr - The array of values, or a non-array thing.
 * @param {string} [separator=,] - The string to separate each element of the array.
 * @returns {string|*}
 */
function joinArray(arr, separator) {
  if (Array.isArray(arr)) {
    return arr.join(separator)
  } else {
    return arr
  }
}


module.exports = { joinArray }
