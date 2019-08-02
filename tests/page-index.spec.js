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


test('test get index', () => {
  var pageIndex = new PageIndex(config)
  var pageData = '<div id="maincontent"><h2>test</h2><h3>test2</h3><h2>fever</h2></div><h2>test3</h2>'
  const $ = cheerio.load(pageData)
  const expectedIndex = 'test fever temperature'

  expect(pageIndex._getIndex($, 'h2')).toBe(expectedIndex)
})

test('test get alt list', () => {
  var list = [ 'fever' ]
  var pageIndex = new PageIndex(config)

  expect(pageIndex._getAltList(list)).toEqual([ 'temperature' ])
})


test('test parse page title', () => {
  var pageIndex = new PageIndex(config)
  var pageData = '<h1>title</h1><div id="maincontent"><h1>title2</h1></div>'
  const $ = cheerio.load(pageData)

  expect(pageIndex._parsePageHeadings($, 'h1')).toEqual(['title2'])
})
