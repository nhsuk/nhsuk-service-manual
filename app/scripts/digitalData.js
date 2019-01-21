export default () => {
  function getPageName(path) {
    return 'nhs:beta' + path.replace(/\/$/, '').replace(/\//g, ':');
  }

  function getCategories(path) {
    return path.split('/').filter(Boolean);
  }

  function setupDigitalData() {
    var path = document.location.pathname;
    var categories = getCategories(path);

    window.digitalData = {
      page: {
        category: {
          primaryCategory: categories[0],
          subCategory1: categories[1],
          subCategory2: categories[2],
          subCategory3: categories[3],
        },
        pageInfo: {
          pageName: getPageName(path),
        },
      },
    };
  }

  setupDigitalData();
}
