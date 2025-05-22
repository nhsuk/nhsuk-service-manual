/**
 * Function to build truncated result with svg for search autocomplete
 * @param {string} result String containing individual result from autocomplete source function
 * @returns {string} String of HTML containing passed result
*/
export const suggestion = ({ title, parent }) => {
  const truncateLength = 36;
  const dots = title.length > truncateLength ? '...' : '';
  const resultTruncated = title.substring(0, truncateLength) + dots;
  return `<span class="autocomplete__option-title">${resultTruncated}</span>
    ${parent ? `<span class="autocomplete__option-category">${parent}</span>` : ''}
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
