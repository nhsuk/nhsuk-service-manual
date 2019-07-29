const axios = require('axios')
const cheerio = require('cheerio')
const lunr = require('lunr')

const blacklist = [
  '/service-manual/privacy-policy',
  '/service-manual/',
  'https://nhsdigital.eu.qualtrics.com/jfe/form/SV_4SKczWOHvnneiWh'
]

class PageIndex {
  constructor() {
    this.docs = []
    this.index = null
  }

  init() {
    axios.get('http://localhost:3000/service-manual/sitemap')
    .then((response) => {
      var pages = []
      const $ = cheerio.load(response.data)
      var links = $('#maincontent').find('a')
      links.each((i, el) => {
        var href = $(el).attr('href')
        if (!blacklist.includes(href)) {
          var url = `http://localhost:3000${href}`
          if (href.toLowerCase().includes('http')) {
            url = href
          }
          pages.push(axios.get(url))
        }
      })

      return axios.all(pages)
    })
    .then((responses) => {
      for (var response of responses) {
        const $ = cheerio.load(response.data)
        const url = response.request.path
        var description = this._parseDescription($)
        if (url === '/service-manual/content/a-to-z-of-nhs-health-writing') {
          var titles = this._parseAToZTitle($)
          for (var title of titles) {
            this.docs.push({
              url: url,
              title: `A to Z of NHS health writing ${title}`,
              subtitle: title,
              description: description
            })
          }
        }
        else {
          var titles = this._parseTitles($)
          var subtitles = this._parseSubtitles($, url)
          var description = this._parseDescription($)
          this.docs.push({
            url: url,
            title: titles,
            subtitle: subtitles,
            description: description
          })
        }

      }

      this.index = lunr((builder) => {
        builder.ref('title')
        builder.field('title')
        builder.field('subtitle')

        for (var i = 0; i < this.docs.length; i++) {
          builder.add(this.docs[i])
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  search(query) {
    var results = this._searchIndex(query)
    var output = []
    for (var i = 0; i < results.length; i++) {
      var data = this._getData(results[i])
      if (data) {
        output.push(data)
      }
    }
    return output
  }

  suggestion(query) {
    var results = this._searchIndex(query)
    var suggestions = []
    for (var i = 0; i < results.length; i++) {
      var data = this._getData(results[i])
      if (data) {
        suggestions.push(data)
      }
    }
    return suggestions
  }

  _searchIndex(query) {
    return this.index.query(function(q) {
      q.term(query.toLowerCase(), { usePipeline: true, boost: 100 })
      // look for terms that match the beginning of this query and apply a medium boost
      q.term(query.toLowerCase() + "*", { usePipeline: false, boost: 10 })
    })
  }

  _getData(result) {
    for (var i = 0; i < this.docs.length; i++) {
      if (result.ref === this.docs[i].title) {
        return this.docs[i]
      }
    }
    return undefined
  }

  _parseTitles($) {
    var titles = []
    $('#maincontent').find('h1').each((i, el) => {
      titles.push($(el).text())
    })
    return titles.join(' ')
  }

  _parseSubtitles($, url) {
    var subtitles = []
    var element = 'h2'
    if (url === '/service-manual/content/a-to-z-of-nhs-health-writing') {
      element = 'h3'
    }
    $(element).each((i, el) => {
      subtitles.push($(el).text())
    })
    return subtitles.join(' ')
  }

  _parseDescription($) {
    return $("meta[name='description']").attr('content')
  }

  _parseAToZTitle($) {
    var titles = []
    var element = 'h3'
    $(element).each((i, el) => {
      titles.push($(el).text())
    })
    return titles
  }
}

module.exports = new PageIndex()
