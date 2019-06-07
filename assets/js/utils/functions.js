
import fetch from 'isomorphic-fetch'

/**
 * sort 2-dimensional array by column
 * @param {[]} array array of arrays
 * @param {number} c column to sort
 */
const sortArrayByColumn = ( array, c ) => (
  array.sort((a, b) => (a[c] === b[c] ? 0 : a[c] < b[c] ? -1 : 1))
);

const httpPost = (url, data) => {
  return fetch(url, {
    method: 'post',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  })
  .then(checkStatus)
  .then(parseJSON);
}

const httpDelete = (url) => {
  return fetch(url, {
    method: 'delete',
    headers: buildHeaders(),
  })
  .then(checkStatus)
}

function buildHeaders() {
  return {
    Accept: 'application/json',
    Authorization: localStorage.getItem('user_token'),
    'Content-Type': 'application/json'
  };
}

function checkStatus(response) {
  if (response.status == 200) return response
  else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) { return response.json(); }

export default {
  httpPost,
  httpDelete,
  sortArrayByColumn
}
