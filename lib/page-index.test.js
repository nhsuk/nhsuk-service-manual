const axios = require('axios')
const cheerio = require('cheerio')
const lunr = require('lunr')

const PageIndex = require('./page-index')

jest.mock('axios')

const config = {
  baseURL: 'http://localhost',
  env: 'development',
  port: 3000
}

/** @type {InstanceType<typeof PageIndex>} */
let pageIndex

const pageDataTemplate = `<meta name="page-index" content="{contentValue}">
  <div id="maincontent">
  <h1>heading1</h1>
  <h2>heading2</h2>
  <h3>heading3</h3>
  <ol class="nhsuk-breadcrumb__list">
    <li class="nhsuk-breadcrumb__item">
      <a href="/" class="nhsuk-breadcrumb__link">Home</a>
    </li>
    <li class="nhsuk-breadcrumb__item">
      <a href="/live-well/" class="nhsuk-breadcrumb__link">Live Well</a>
    </li>
  </ol>
  </div>`

const expectedData = {
  description: 'This is an example',
  extra: 'helper text',
  h2: 'heading2',
  h3: 'heading3',
  parent: `
      Live Well
    `,
  title: 'heading1',
  url: '/design-system/components/hint-text'
}

beforeEach(() => {
  pageIndex = new PageIndex(config)
})

test('parse page description', () => {
  const pageData =
    '<meta name="description" content="Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.">'
  const $ = cheerio.load(pageData)

  expect(pageIndex.parseDescription($)).toBe(
    'Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.'
  )
})

test('get index', () => {
  const pageData =
    '<div id="maincontent"><h2>test</h2><h3>test2</h3><h2>fever</h2></div><h2>test3</h2>'
  const $ = cheerio.load(pageData)
  const expectedIndex = 'test fever temperature'

  expect(pageIndex.getIndex($, 'h2')).toBe(expectedIndex)
})

test('get alt list', () => {
  const list = ['fever']

  expect(pageIndex.getAltList(list)).toEqual(['temperature'])
})

test('parse page title', () => {
  const pageData = '<h1>title</h1><div id="maincontent"><h1>title2</h1></div>'
  const $ = cheerio.load(pageData)

  expect(pageIndex.parsePageHeadings($, 'h1')).toEqual(['title2'])
})

test('parse page title with children', () => {
  const pageData =
    '<h1>title</h1><div id="maincontent"><h1>title2</h1><div><h2>stuff</h2></div></div>'
  const $ = cheerio.load(pageData)

  expect(pageIndex.parsePageHeadings($, 'div')).toEqual([''])
})

test('parse meta', () => {
  const pageData =
    '<meta name="test-meta" content="content result"><h1>title</h1><div id="maincontent"><h1>title2</h1></div>'
  const expectedMeta = 'content result'
  const $ = cheerio.load(pageData)

  expect(pageIndex.parseMeta($, 'test-meta')).toBe(expectedMeta)
})

test('index page normal', () => {
  const pageData = pageDataTemplate.replace('{contentValue}', 'not-special')
  const $ = cheerio.load(pageData)
  const url = '/design-system/components/hint-text'
  const description = 'This is an example'
  const param = {
    ref: url
  }

  pageIndex.indexPageNormal($, url, description)

  expect(pageIndex.getData(param)).toStrictEqual(expectedData)
  expect(pageIndex.isSpecialIndex($)).toBe(false)
})

test('index page special', () => {
  const pageData = pageDataTemplate.replace('{contentValue}', 'special')
  const $ = cheerio.load(pageData)
  const url = '/design-system/components/hint-text'
  const description = 'This is an example'
  expectedData.h2 = ''
  expectedData.h3 = []
  expectedData.parent = 'A to Z of NHS health writing'
  expectedData.title = 'Heading3'
  expectedData.url = `${url}#heading3`
  const param = {
    ref: `${url}#heading3`
  }

  pageIndex.indexPageSpecial($, url, description)

  expect(pageIndex.getData(param)).toStrictEqual(expectedData)
  expect(pageIndex.isSpecialIndex($)).toBe(true)
})

test('get connection configuration', () => {
  process.env.MANUAL_USERNAME = 'nameofuser'
  process.env.MANUAL_PASSWORD = 'abcdefgh1234'

  expect(pageIndex.getConnectionConfig()).toStrictEqual({
    auth: { password: 'abcdefgh1234', username: 'nameofuser' }
  })
})

test('search', () => {
  const pageData = pageDataTemplate.replace('{contentValue}', 'not-special')
  const $ = cheerio.load(pageData)
  const url = '/design-system/components/hint-text'
  const description = 'This is an example'
  // create and mock the lunr stuff
  const documents = [
    {
      title: 'Lunr',
      h2: 'Like Solr, but much smaller',
      h3: 'and not as bright.',
      extra: 'Some new extra text'
    },
    {
      title: 'React',
      h2: 'A JavaScript library',
      h3: 'for building user interfaces',
      extra: 'Some new extra text'
    },
    {
      title: 'Lodash',
      h2: 'A modern JavaScript utility library',
      h3: 'delivering modularity, performance & extras',
      extra: 'Some new extra text'
    }
  ]

  const idx = lunr(function index() {
    this.ref('name')
    this.field('text')

    documents.forEach(function addDoc(doc) {
      this.add(doc)
    }, this)
  })

  pageIndex.indexPageNormal($, url, description)

  pageIndex.index = idx
  expect(pageIndex.search('kitten')).toStrictEqual([])
})

test('init', async () => {
  const returnData = {
    data: ` <main class="nhsuk-main-wrapper app-main-wrapper" id="maincontent">
    <div class="nhsuk-grid-row">
      <div class="nhsuk-grid-column-two-thirds app-component-reading-width">
        <h1 class="app-page-heading">Site map</h1>
      </div>
      <div class="nhsuk-grid-column-two-thirds app-component-reading-width">
      <ul>
        <li><a href="/">Home</a></li>
        <li>
          <a href="/accessibility">Accessibility</a>
          <ul class="nhsuk-u-nested-list">
            <li><a href="/accessibility/what-all-nhs-services-need-to-do">What all NHS services need to do about accessibility</a></li>
            <li><a href="/accessibility/how-to-make-digital-services-accessible">How to make digital services accessible</a></li>
            <li><a href="/accessibility/getting-started">Getting started with accessibility</a></li>
            <li><a href="/accessibility/download-accessibility-posters">Download accessibility posters</a></li>
            <li><a href="/accessibility/product-and-delivery">Product and delivery</a></li>
            <li><a href="/accessibility/user-research">User research</a></li>
            <li><a href="/accessibility/content">Content</a></li>
            <li><a href="/accessibility/design">Design</a></li>
            <li><a href="/accessibility/development">Development</a></li>
            <li><a href="/accessibility/testing">Testing</a></li>
          </ul>
        </li>
        <li>
          <a href="/standards-and-technology">Standards and technology</a>
          <ul class="nhsuk-u-nested-list">
            <li><a href="/standards-and-technology/service-standard">NHS service standard</a></li>
              <ul class="nhsuk-u-nested-list">
                <li><a href="/standards-and-technology/about-the-service-standard">About the NHS service standard</a></li>
                <li><a href="/standards-and-technology/service-standard-points/1-understand-users-and-their-needs-context-health-and-care">1. Understand users and their needs in the context of health and care</a></li>
                <li><a href="/standards-and-technology/service-standard-points/2-and-3-work-towards-solving-a-whole-problem-and-provide-a-joined-up-experience">2. and 3. Work towards solving a whole problem and provide a joined up experience</a></li>
                <li><a href="/standards-and-technology/service-standard-points/4-make-the-service-simple-to-use">4. Make the service simple to use</a></li>
                <li><a href="/standards-and-technology/service-standard-points/5-make-sure-everyone-can-use-the-service">5. Make sure everyone can use the service</a></li>
                <li><a href="/standards-and-technology/service-standard-points/6-create-a-team-that-includes-multidisciplinary-skills-and-perspectives">6. Create a team that includes multidisciplinary skills and perspectives</a></li>
                <li><a href="/standards-and-technology/service-standard-points/7-use-agile-ways-of-working">7. Use agile ways of working</a></li>
                <li><a href="/standards-and-technology/service-standard-points/8-iterate-and-improve-frequently">8. Iterate and improve frequently</a></li>
                <li><a href="/standards-and-technology/service-standard-points/9-create-a-secure-service-which-protects-peoples-privacy">9. Create a secure servicer which protects people's privacy</a></li>
                <li><a href="/standards-and-technology/service-standard-points/10-define-what-success-looks-like-and-be-open-about-how-your-service-is-performing">10. Define what success looks like and be open about how your service is performing</a></li>
                <li><a href="/standards-and-technology/service-standard-points/11-choose-the-right-tools-and-technology">11. Choose the right tools and technology</a></li>
                <li><a href="/standards-and-technology/service-standard-points/12-make-new-source-code-open">12. Make new source code open</a></li>
                <li><a href="/standards-and-technology/service-standard-points/13-use-and-contribute-to-open-standards-common-components-and-patterns">13. Use and contribute to open standards, common components and patterns</a></li>
                <li><a href="/standards-and-technology/service-standard-points/14-operate-a-reliable-service">14. Operate a reliable service</a></li>
                <li><a href="/standards-and-technology/service-standard-points/15-support-a-culture-of-care">15. Support a culture of care</a></li>
                <li><a href="/standards-and-technology/service-standard-points/16-make-your-service-clinically-safe">16. Make your service clinically safe</a></li>
                <li><a href="/standards-and-technology/service-standard-points/17-make-your-service-interoperable">17. Make your service interoperable</a></li>
              </ul>
            <li>Technology</li>
              <ul class="nhsuk-u-nested-list">
                <li><a href="/standards-and-technology/technology/about-technology">About technology</a></li>
                <li><a href="/standards-and-technology/technology/NHS-login">NHS login</a></li>
                <li><a href="/standards-and-technology/technology/personal-demographics-service-PDS">Personal Demographics Service (PDS)</a></li>
              </ul>
          </ul>
        </li>
      </div>
    </div>
  </main>`
  }

  const allUrls = [
    { data: '<div>some response</div>', request: { path: 'some path' } }
  ]

  axios.get.mockResolvedValue(returnData)

  axios.all.mockResolvedValue(allUrls)

  await pageIndex.init()

  expect(pageIndex.docs).toHaveLength(1)
})
