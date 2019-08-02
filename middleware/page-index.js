const axios = require('axios');
const cheerio = require('cheerio');
const lunr = require('lunr');
const { additionalIndices, alternativeSpelling, indexBlacklist } = require('./page-index-additions.js');

class PageIndex {
  constructor(config) {
    this.docs = [];
    this.index = null;
    this.config = config;
  }

  init() {
    var startTime = new Date().getTime();
    const baseUrl = `http://localhost:${this.config.port}`
    const config = this._getConnectionConfig()
    axios.get(`${baseUrl}/service-manual/sitemap`, config)
    .then((response) => {
      var pages = [];
      const $ = cheerio.load(response.data);
      var links = $('#maincontent').find('a');
      links.each((i, el) => {
        var href = $(el).attr('href');
        if (!indexBlacklist.includes(href)) {
          var url = `${baseUrl}${href}`;
          if (href.toLowerCase().includes('http')) {
            url = href;
          }
          pages.push(axios.get(url, config));
        }
      })

      return axios.all(pages);
    })
    .then((responses) => {
      for (var response of responses) {
        const $ = cheerio.load(response.data);
        const url = response.request.path;
        var description = this._parseDescription($);
        if (this._isSpecialIndex($)) {
          var titles = this._parseAToZTitle($);
          for (var title of titles) {
            var index = [ title.toLowerCase() ];
            var altSpelling = this._getAltSpellings(index.join(' '));
            index = index.concat(altSpelling);
            var pageTitle = title.charAt(0).toUpperCase() + title.slice(1);
            this.docs.push({
              url: url,
              title: `${pageTitle} - A to Z of NHS health writing`,
              index: index.join(' '),
              description: description
            });
          }
        }
        else {
          var title = this._parseTitle($);
          var index = this._getSearchIndex($, url);
          this.docs.push({
            url: url,
            title: title,
            index: index,
            description: description
          });
        }

      }

      this.index = lunr((builder) => {
        builder.ref('title');
        builder.field('title');
        builder.field('index');

        for (var i = 0; i < this.docs.length; i++) {
          builder.add(this.docs[i]);
        }
      })
      var endTime = new Date().getTime();
      var indexTime = (endTime - startTime) / 1000;
      console.log(`Page index finished in ${indexTime}s`);
    })
    .catch((err) => {
      var reason = ''
      if (err.response) {
        reason = `${err.message} URL: ${err.response.config.url}`
      }
      else {
        reason = err.message
      }
      console.log(`Unable to index pages. Reason: ${reason}`);
    })
  }

  search(query) {
    var results = this._searchIndex(query);
    var output = [];
    for (var i = 0; i < results.length; i++) {
      var data = this._getData(results[i]);
      if (data) {
        output.push(data);
      }
    }
    return output;
  }

  suggestion(query) {
    var results = this._searchIndex(query);
    var suggestions = [];
    for (var i = 0; i < results.length; i++) {
      var data = this._getData(results[i]);
      if (data) {
        suggestions.push(data);
      }
    }
    return suggestions;
  }

  _searchIndex(query) {
    var results = []
    if (query && this.index) {
      results = this.index.query(function(q) {
        // look for terms that has exact match and apply a big boost
        q.term(query.toLowerCase(), { usePipeline: true, boost: 100 });
        // look for terms that match the beginning of this query and apply a medium boost
        q.term(query.toLowerCase() + "*", { usePipeline: false, boost: 10 });
      })
    }
    return results
  }

  _getData(result) {
    for (var i = 0; i < this.docs.length; i++) {
      if (result.ref === this.docs[i].title) {
        return this.docs[i];
      }
    }
    return undefined;
  }

  _parseTitle($) {
    var titles = [];
    $('#maincontent').find('h1').each((i, el) => {
      titles.push($(el).text());
    })
    return titles.join(' ');
  }

  _getSearchIndex($, url) {
    var pageContent = this._parsePageContent($);
    var extraIndicies = this._getAdditionalIndices(url);
    var index = [];
    for (var item of pageContent.concat(extraIndicies)) {
      if (!index.includes(item)) {
        index.push(item);
      }
    }
    var altSpelling = this._getAltSpellings(index.join(' '));
    index = index.concat(altSpelling);
    return index.join(' ');
  }

  _getAltSpellings(index) {
    var altSpelling = [];
    for (var word in alternativeSpelling) {
      if (index.includes(word.toLowerCase())) {
        altSpelling.push(alternativeSpelling[word].join(' '));
      }
    }
    return altSpelling;
  }

  _getAdditionalIndices(url) {
    if (url in additionalIndices) {
      return additionalIndices[url];
    }
    return [];
  }

  _parsePageContent($) {
    var content = [];
    const elements = ['h2', 'h3'];
    for (var element of elements) {
      $('#maincontent').find(element).each((i, el) => {
        if($(el).children().length === 0) {
          content.push($(el).text().toLowerCase());
        }
      })
    }
    return content;
  }

  _parseDescription($) {
    return this._parseMeta($, 'description');
  }

  _isSpecialIndex($) {
    if (this._parseMeta($, 'page-index') === 'special' ) {
      return true;
    }
    return false;
  }

  _parseMeta($, name) {
    return $(`meta[name='${name}']`).attr('content');
  }

  _parseAToZTitle($) {
    var titles = [];
    var element = 'h3';
    $('#maincontent').find(element).each((i, el) => {
      titles.push($(el).text());
    })
    return titles;
  }

  _getConnectionConfig() {
    if (process.env.MANUAL_USERNAME || process.env.MANUAL_PASSWORD) {
      return {
        auth: {
          username: process.env.MANUAL_USERNAME,
          password: process.env.MANUAL_PASSWORD
        }
      }
    }
    return {}
  }
}

module.exports = PageIndex;
