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
          this._indexPageSpecial($, url, description)
        }
        else {
          this._indexPageNormal($, url, description);
        }
      }

      this.index = lunr((builder) => {
        builder.ref('title');
        builder.field('title');
        builder.field('h2');
        builder.field('h3');
        builder.field('extra');

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

  _searchIndex(query) {
    var results = []
    if (query && this.index) {
      results = this.index.query(function(q) {
        const exactMatch = query.toLowerCase()
        const partialMatch = query.toLowerCase() + "*"

        q.term(exactMatch, { fields: [ 'title' ], boost: 100 })
        q.term(exactMatch, { fields: [ 'h2' ], boost: 80 })
        q.term(exactMatch, { fields: [ 'h3' ], boost: 60 })
        q.term(exactMatch, { fields: [ 'extra' ], boost: 40 })

        q.term(partialMatch, { fields: [ 'title' ], boost: 90 })
        q.term(partialMatch, { fields: [ 'h2' ], boost: 70 })
        q.term(partialMatch, { fields: [ 'h3' ], boost: 50 })
        q.term(partialMatch, { fields: [ 'extra' ], boost: 30 })
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

  _indexPageNormal($, url, description) {
    var title = this._parsePageHeadings($, 'h1').join(' ');
    var h2 = this._getIndex($, 'h2');
    var h3 = this._getIndex($, 'h3');
    var extra = this._getAdditionalIndices(url).join(' ');

    this.docs.push({
      url: url,
      title: title,
      h2: h2,
      h3: h3,
      extra: extra,
      description: description
    });
  }

  _indexPageSpecial($, url, description) {
    var titles = this._parsePageHeadings($, 'h3');
    for (var rawTitle of titles) {
      var formattedTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      var extra = this._getAdditionalIndices(url).join(' ');
      var h3 = this._getAltList([ rawTitle ]);

      this.docs.push({
        url: url,
        title: `${formattedTitle} - A to Z of NHS health writing`,
        h2: '',
        h3: h3,
        extra: extra,
        description: description
      });
    }
  }

  _getAdditionalIndices(url) {
    if (url in additionalIndices) {
      return additionalIndices[url];
    }
    return [];
  }

  _parsePageHeadings($, type) {
    var headings = [];
    $('#maincontent').find(type).each((i, el) => {
      if($(el).children().length === 0) {
        headings.push($(el).text());
      }
    })
    return headings;
  }

  _getIndex($, type) {
    var headingsList = this._parsePageHeadings($, type);
    var altList = this._getAltList(headingsList);
    return headingsList.concat(altList).join(' ');
  }

  _getAltList(list) {
    var listString = list.join(' ').toLowerCase();
    var altList = [];
    for (var key in alternativeSpelling) {
      if (listString.includes(key.toLowerCase())) {
        altList = altList.concat(alternativeSpelling[key]);
      }
    }
    return altList;
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
