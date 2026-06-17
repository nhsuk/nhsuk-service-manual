/**
 * @param {string} path
 */
function getPageName(path) {
  return `nhs:manual${path.replace(/\/$/, '').replace(/\//g, ':')}`
}

/**
 * @param {string} path
 */
function getCategories(path) {
  return path.split('/').filter(Boolean)
}

/**
 * @param {Request} req
 */
function digitalData(req) {
  const { path } = req
  const categories = getCategories(path)

  return {
    page: {
      pageInfo: {
        pageName: getPageName(path)
      },
      category: {
        primaryCategory: categories[0],
        subCategory1: categories[1],
        subCategory2: categories[2],
        subCategory3: categories[3],
        subCategory4: categories[4]
      }
    }
  }
}

module.exports = digitalData

/**
 * @import { Request } from 'express'
 */
