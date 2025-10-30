const axios = require('axios')
const cheerio = require('cheerio')
const lunr = require('lunr')

const {
  additionalIndices,
  alternativeSpelling,
  indexBlacklist
} = require('./page-index-additions')

class PageIndex {
  /**
   * Lunr search index
   *
   * @type {Index | null}
   */
  index = null

  /**
   * Indexed pages
   *
   * @type {PageDoc[]}
   */
  docs = []

  /**
   * @param {Partial<typeof Config>} config
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Initialise the page index by fetching all pages from the sitemap,
   * extracting content from each page, then building an index
   */
  async init() {
    const startTime = new Date().getTime()
    const baseUrl = `http://localhost:${this.config.port}`
    const config = this.getConnectionConfig()

    // Set Lunr to only split searches on spaces rather than spaces and hyphens
    lunr.tokenizer.separator = /\s+/

    try {
      // Make request to get sitemap
      const { data } = await axios.get(`${baseUrl}/site-map`, config)
      // Assign jQuery style DOM of page to $
      let $ = cheerio.load(data)
      // jQuery array of jQuery link objects
      const links = $('#maincontent').find('a')

      // Build an array of axios requests
      let urls = []
      links.each((_, el) => {
        const href = $(el).attr('href')
        // Exclude blacklisted links
        if (!indexBlacklist.includes(href)) {
          // Handle absolute vs relative links
          const url = href.toLowerCase().includes('http')
            ? href
            : `${baseUrl}${href}`
          // Add axios request to array
          urls = [...urls, axios.get(url, config)]
        }
      })

      // Make all axios requests for pages in urls array
      const allPages = await axios.all(urls)

      // Index each page from allPages
      allPages.forEach((response) => {
        // Assign jQuery style DOM of page to $
        $ = cheerio.load(response.data)
        const url = response.request.path
        const description = this.parseDescription($)
        // Index pages
        if (this.isSpecialIndex($)) {
          this.indexPageSpecial($, url, description)
        } else {
          this.indexPageNormal($, url, description)
        }
      })

      // Setup for lunr indexing
      this.index = lunr((builder) => {
        builder.ref('url')
        builder.field('title')
        builder.field('h2')
        builder.field('h3')
        builder.field('extra')
        builder.field('parent')
        // Add each indexed page from above to lunr
        this.docs.forEach((doc) => builder.add(doc))
      })

      // Time to index logging
      const endTime = new Date().getTime()
      const indexTime = (endTime - startTime) / 1000
      // eslint-disable-next-line no-console
      console.log(`Page index finished in ${indexTime}s`)
    } catch (err) {
      const reason = err.response
        ? `${err.message} URL: ${err.response.config.url}`
        : err.message
      // eslint-disable-next-line no-console
      console.log(`Unable to index pages. Reason: ${reason}`)
    }
  }

  /**
   * Return indexed data from indexed pages for passed query
   *
   * @param {string} query - Query from 'searchField' param
   * @returns {PageDoc[]} Indexed pages matching the query
   */
  search(query) {
    // Skip running a search if there is no query
    if (!query) return []
    return (
      this.searchIndex(query)
        // Map page to its indexed data
        .map((res) => this.getData(res))
        // Filter pages which may be missing indexed data
        .filter(Boolean)
    )
  }

  /**
   * Get indexed data for passed search result lunr result
   *
   * @param {Index.Result} result - Search result
   * @returns Indexed page for result
   */
  getData({ ref }) {
    return this.docs.find(({ url }) => url === ref)
  }

  /**
   * Return indexed pages for passed query
   *
   * @param {string} query
   * @returns Array of search results from Lunr index
   */
  searchIndex(query) {
    if (!this.index) {
      return []
    }

    return this.index.query((q) => {
      lunr.tokenizer(query).forEach((token) => {
        const tokenString = token.toString()
        q.term(tokenString, { boost: 100, fields: ['title'] })
        q.term(tokenString, { boost: 80, fields: ['h2'] })
        q.term(tokenString, { boost: 60, fields: ['h3'] })
        q.term(tokenString, { boost: 40, fields: ['extra'] })

        q.term(`${tokenString}*`, { boost: 90, fields: ['title'] })
        q.term(`${tokenString}*`, { boost: 70, fields: ['h2'] })
        q.term(`${tokenString}*`, { boost: 50, fields: ['h3'] })
        q.term(`${tokenString}*`, { boost: 30, fields: ['extra'] })
      })
    })
  }

  /**
   * Index page
   *
   * @param {CheerioAPI} $ - Cheerio site map
   * @param {string} url - Page URL
   * @param {string} [description] - Page description
   */
  indexPageNormal($, url, description) {
    // Use passed jQuery DOM to grab content for indexing
    const title = this.parsePageHeadings($, 'h1').join(' ')
    const h2 = this.getIndex($, 'h2')
    const h3 = this.getIndex($, 'h3')
    const extra = this.getAdditionalIndices(url).join(' ')
    const parent = $('.nhsuk-breadcrumb__item').last().text()

    // Add page data to docs array
    this.docs = [
      ...this.docs,
      {
        description,
        extra,
        h2,
        h3,
        parent,
        title,
        url
      }
    ]
  }

  /**
   * Index A to Z pages this page has multiple sections we want
   * to index separately for improved usability
   *
   * @param {CheerioAPI} $ - Cheerio site map
   * @param {string} url - Page URL
   * @param {string} [description] - Page description
   */
  indexPageSpecial($, url, description) {
    // Get array of H3 titles from list
    const titles = this.parsePageHeadings($, 'h3')

    // Add each list to docs index
    titles.forEach((rawTitle) => {
      // Use title of section to create content for indexing
      const formattedTitle =
        rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1)
      const extra = this.getAdditionalIndices(url).join(' ')
      const h3 = this.getAltList([rawTitle])
      const formattedUrl = `${url}#${rawTitle.split(' ').join('-')}`

      // Add section data to docs array
      this.docs = [
        ...this.docs,
        {
          description,
          extra,
          h2: '',
          h3,
          parent: 'A to Z of NHS health writing',
          title: formattedTitle,
          url: formattedUrl
        }
      ]
    })
  }

  /**
   * Get alternative page names
   *
   * @param {string} url - Page URL
   * @returns Alternative page names
   */
  getAdditionalIndices(url) {
    return additionalIndices[url] || []
  }

  /**
   * Return array of headings of type
   *
   * @param {CheerioAPI} $ - Cheerio site map
   * @param {string} type - Query selector
   * @returns Array of heading text content
   */
  parsePageHeadings($, type) {
    let headings = /** @type {string[]} */ ([])
    $('#maincontent')
      .find(type)
      .each((_, el) => {
        // Check heading doesn't contains additional HTML elements
        // This fixes issues with pages with a caption in the H1
        if ($(el).children().length === 0) {
          headings = [...headings, ...[$(el).text().trim()]]
        } else {
          // If heading contains childen get the title from the title
          const title = $('title').text()
          headings = [...headings, ...[title.split(' – ')[0]]]
        }
      })
    return headings
  }

  /**
   * Build string of headings and synonyms
   *
   * @param {CheerioAPI} $ - Cheerio site map
   * @param {string} type - Query selector
   * @returns Combined string of headings and synonyms
   */
  getIndex($, type) {
    const headingsList = this.parsePageHeadings($, type)
    return [...headingsList, ...this.getAltList(headingsList)].join(' ')
  }

  /**
   * Get list of synonyms
   *
   * @param {string[]} list - Array of strings to find synonyms for
   * @returns List of synonyms
   */
  getAltList(list) {
    const listString = list.map((str) => str.toLowerCase())
    return Object.keys(alternativeSpelling).reduce((altList, key) => {
      if (listString.includes(key.toLowerCase())) {
        return [...altList, ...alternativeSpelling[key]]
      }
      return altList
    }, [])
  }

  /**
   * Return page meta description
   *
   * @param {CheerioAPI} $ - Cheerio site map
   * @returns Page meta description content
   */
  parseDescription($) {
    return this.parseMeta($, 'description')
  }

  /**
   * Returns true if meta page-index is special
   *
   * @param {CheerioAPI} $ - Cheerio site map
   * @returns True if the page should use special indexing
   */
  isSpecialIndex($) {
    return this.parseMeta($, 'page-index') === 'special'
  }

  /**
   * Util to return value of page meta
   *
   * @param {CheerioAPI} $ - Cheerio site map
   * @param {string} name - Meta tag name
   * @returns Meta tag content attribute
   */
  parseMeta($, name) {
    return $(`meta[name='${name}']`).attr('content')
  }

  /**
   * Connection config with (optional) basic auth credentials
   *
   * @returns {AxiosRequestConfig} Axios request config
   */
  getConnectionConfig() {
    const { MANUAL_USERNAME, MANUAL_PASSWORD } = process.env
    if (MANUAL_USERNAME || MANUAL_PASSWORD) {
      return {
        auth: {
          password: MANUAL_PASSWORD,
          username: MANUAL_USERNAME
        }
      }
    }
    return {}
  }
}

module.exports = PageIndex

/**
 * Indexed page
 *
 * @typedef {object} PageDoc
 * @property {string} title - Page title
 * @property {string} [description] - Page description
 * @property {string} extra - Alternative page names
 * @property {string} h2 - Page heading 2
 * @property {string} h3 - Page heading 3
 * @property {string} parent - Page parent
 * @property {string} url - Page URL
 */

/**
 * @import { AxiosRequestConfig } from 'axios'
 * @import { CheerioAPI } from 'cheerio'
 * @import { Index } from 'lunr'
 * @import { default as Config } from '../app/config.js'
 */
