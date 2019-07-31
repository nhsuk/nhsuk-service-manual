const PageIndex = require('../middleware/page-index.js')
const config = {
  serviceName: 'NHS digital service manual',
  env: process.env.NODE_ENV || 'development',
  baseURL: process.env.BASE_URL || 'https://beta.nhs.uk/service-manual',
  port: process.env.PORT || 3000
}
const cheerio = require('cheerio')

test('test parse page description', () => {
  var pageIndex = new PageIndex(config)
  var pageData = '<meta name="description" content="Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.">'
  const $ = cheerio.load(pageData)

  expect(pageIndex._parseDescription($)).toBe('Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.')
})
