const axios = require('axios');
const cheerio = require('cheerio');
const lunr = require('lunr');
const { additionalIndicies, alternativeSpelling, indexBlacklist } = require('./page-index-additions.js');

class PageIndex {
  constructor(config) {
    this.docs = [];
    this.index = null;
    this.config = config;
  }

  init() {
    var startTime = new Date().getTime();
    const baseUrl = this._getBaseUrl();
    axios.get(`${baseUrl}/service-manual/sitemap`)
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
          pages.push(axios.get(url));
        }
      })

      return axios.all(pages);
    })
    .then((responses) => {
      for (var response of responses) {
        const $ = cheerio.load(response.data);
        const url = response.request.path;
        var description = this._parseDescription($);
        if (url === '/service-manual/content/a-to-z-of-nhs-health-writing') {
          var titles = this._parseAToZTitle($);
          for (var title of titles) {
            var index = [ title ];
            var altSpelling = this._getAltSpellings(index.join(' '));
            index = index.concat(altSpelling);
            this.docs.push({
              url: url,
              title: `${title} - A to Z of NHS health writing`,
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
      console.log(err);
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
    return this.index.query(function(q) {
      q.term(query.toLowerCase(), { usePipeline: true, boost: 100 });
      // look for terms that match the beginning of this query and apply a medium boost
      q.term(query.toLowerCase() + "*", { usePipeline: false, boost: 10 });
    })
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
    var extraIndicies = this._getAdditionalIndicies(url);
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
        altSpelling.push(alternativeSpelling[word]);
      }
    }
    return altSpelling;
  }

  _getAdditionalIndicies(url) {
    if (url in additionalIndicies) {
      return additionalIndicies[url];
    }
    return [];
  }

  _parsePageContent($) {
    var content = [];
    const elements = ['h2', 'h3'];
    for (var element of elements) {
      $('#maincontent').find(element).each((i, el) => {
        content.push($(el).text().toLowerCase());
      })
    }
    return content;
  }

  _parseDescription($) {
    return $("meta[name='description']").attr('content');
  }

  _parseAToZTitle($) {
    var titles = [];
    var element = 'h3';
    $('#maincontent').find(element).each((i, el) => {
      titles.push($(el).text().toLowerCase());
    })
    return titles;
  }

  _getBaseUrl() {
    return 'https://beta.nhs.uk';
  }
}

module.exports = PageIndex;
