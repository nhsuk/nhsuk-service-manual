/* eslint-disable sort-keys */
function getPageName(path) {
  return `nhs:manual${path.replace(/\/$/, '').replace(/\//g, ':')}`;
}

function getCategories(path) {
  return path.split('/').filter(Boolean);
}

function digitalData(req) {
  const { path } = req;
  const categories = getCategories(path);

  return {
    page: {
      pageInfo: {
        pageName: getPageName(path),
      },
      category: {
        primaryCategory: categories[0],
        subCategory1: categories[1],
        subCategory2: categories[2],
        subCategory3: categories[3],
        subCategory4: categories[4],
      },
    },
  };
}

module.exports = digitalData;
