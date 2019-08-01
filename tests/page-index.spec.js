const PageIndex = require('../middleware/page-index.js')
const config = {
  serviceName: 'NHS digital service manual',
  env: 'development',
  baseURL: 'http://localhost',
  port: 3000
}
const cheerio = require('cheerio')

test('test parse page description', () => {
  var pageIndex = new PageIndex(config)
  var pageData = '<meta name="description" content="Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.">'
  const $ = cheerio.load(pageData)

  expect(pageIndex._parseDescription($)).toBe('Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.')
})


test('test get page index', () => {
  var pageIndex = new PageIndex(config)
  var pageData = '<div id="maincontent"><h2>test</h2><h3>test2</h3><h2>fever</h2></div><h2>test3</h2>'
  const url = '/service-manual/accessibility/testing'
  const $ = cheerio.load(pageData)
  const expectedIndex = 'test fever test2 svg temperature'

  expect(pageIndex._getSearchIndex($, url)).toBe(expectedIndex)
})


test('test parse page title', () => {
  var pageIndex = new PageIndex(config)
  var pageData = '<h1>title</h1><div id="maincontent"><h1>title2</h1></div>'
  const $ = cheerio.load(pageData)

  expect(pageIndex._parseTitle($)).toBe('title2')
})


test('test parse A to Z title', () => {
  var pageIndex = new PageIndex(config)
  var pageData = '<h3>title</h3><div id="maincontent"><h3>title2</h3><h3>title3</h3></div>'
  const $ = cheerio.load(pageData)

  expect(pageIndex._parseAToZTitle($)).toEqual(['title2', 'title3'])
})
