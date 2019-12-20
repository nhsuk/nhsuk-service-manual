/**
 * Function to build truncated result with svg for search autocomplete
 * @param {string} result String containing individual result from autocomplete source function
 * @returns {string} String of HTML containing passed result
*/
export const suggestion = ({ title }) => {
  const truncateLength = 36;
  const dots = title.length > truncateLength ? '...' : '';
  const resultTruncated = title.substring(0, truncateLength) + dots;
  return ` <svg class="nhsuk-icon nhsuk-icon__search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.71 18.29l-4.11-4.1a7 7 0 1 0-1.41 1.41l4.1 4.11a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 10a5 5 0 1 1 5 5 5 5 0 0 1-5-5z"></path></svg>
    <span class="autocomplete__option-title">${resultTruncated}</span>
  `;
};

export const inputValue = (obj) => {
  if (obj && obj.title) return obj.title.trim();
  return '';
};

/**
 * Function to populate the search autocomplete.
 * @param {string} query Query to pass to search API
 * @param {function} populateResults Callback function passed to source by autocomplete plugin
*/
export const source = (query, populateResults) => {
  // Build URL for search endpoint
  const url = `/suggestions/?search=${query}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const json = JSON.parse(xhr.responseText);
      populateResults(json);
    }
  };
  xhr.send();
};

export const onConfirm = ({ url }) => {
  window.location = url;
};
