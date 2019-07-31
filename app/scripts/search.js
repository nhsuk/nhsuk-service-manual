import nhsukHeader from '../../node_modules/nhsuk-frontend/packages/components/header/header';
import autocomplete from '../../node_modules/nhsuk-frontend/packages/components/header/autocomplete';

function suggestionTemplate(data) {
  const result = data.title;
  const truncateLength = 36;
  const dots = result.length > truncateLength ? '...' : '';
  const resultTruncated = result.substring(0, truncateLength) + dots;
  const svgIcon = '<svg class="nhsuk-icon nhsuk-icon__search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.71 18.29l-4.11-4.1a7 7 0 1 0-1.41 1.41l4.1 4.11a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 10a5 5 0 1 1 5 5 5 5 0 0 1-5-5z"></path></svg>';
  const resultsHref = `<a href="${data.url}">${resultTruncated}</a>`;

  return svgIcon + resultsHref;
}

function searchSource(query, callback) {
  const url = `/service-manual/suggestions/?search=${encodeURIComponent(query)}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      callback(data);
    }
  };
  xhr.send();
}

const searchConfig = {
  onConfirm: (selected) => {
    window.location.href = selected.url;
  },
  required: true,
  showNoOptionsFound: false,
  source: searchSource,
  templates: {
    suggestion: suggestionTemplate,
  },
};

nhsukHeader();
autocomplete(searchConfig);
