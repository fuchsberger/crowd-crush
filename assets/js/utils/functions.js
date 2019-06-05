
import React from 'react'
import fetch from 'isomorphic-fetch'
import { renderToStaticMarkup } from 'react-dom/server';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

function buildHeaders() {
  return {
    Accept: 'application/json',
    Authorization: localStorage.getItem('phoenixAuthToken'),
    'Content-Type': 'application/json'
  };
}

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

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
  .then(parseJSON);
}

const parseJSON = (response) => response.json();

const renderErrorsFor = (errors, ref) => {
  if (!errors) return false;
  if (typeof errors == "string") {
    return (
      <div className="error">
        {errors}
      </div>
    );
  } else {
    return errors.map((error, i) => {
      if (error[ref]) {
        return (
          <div key={i} className="error">
            {error[ref]}
          </div>
        );
      }
    });
  }
}

const setDocumentTitle = (title) => {
  document.title = `${title} | Phoenix Pair`;
}

/**
 * sort 2-dimensional array by column
 * @param {[]} array array of arrays
 * @param {number} c column to sort
 */
const sortArrayByColumn = ( array, c ) => (
  array.sort((a, b) => (a[c] === b[c] ? 0 : a[c] < b[c] ? -1 : 1))
);

const styleInputIcon = (icon) => {
  return {
    backgroundImage: svgUri(
      <FontAwesomeIcon style={{ color: '#707070' }} icon={icon} />
    ),
    backgroundPosition: '9px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 16px',
    paddingLeft: 32
  };
}

const svgUri = (component) => {
  const svgString = encodeURIComponent(renderToStaticMarkup(component));
  return `url("data:image/svg+xml,${svgString}")`;
}

export default {
  checkStatus,
  httpPost,
  httpDelete,
  parseJSON,
  renderErrorsFor,
  setDocumentTitle,
  sortArrayByColumn,
  styleInputIcon,
  svgUri
}
