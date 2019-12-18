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
    const startTime = new Date().getTime();
    const baseUrl = `http://localhost:${this.config.port}`;
    const config = this.getConnectionConfig();
    axios.get(`${baseUrl}/sitemap`, config)
      .then((response) => {
        const pages = [];
        const $ = cheerio.load(response.data);
        const links = $('#maincontent').find('a');
        links.each((i, el) => {
          const href = $(el).attr('href');
          if (!indexBlacklist.includes(href)) {
            let url = `${baseUrl}${href}`;
            if (href.toLowerCase().includes('http')) {
              url = href;
            }
            pages.push(axios.get(url, config));
          }
        });

        return axios.all(pages);
      })
      .then((responses) => {
        responses.forEach((response) => {
          const $ = cheerio.load(response.data);
          const url = response.request.path;
          const description = this.parseDescription($);
          if (this.isSpecialIndex($)) {
            this.indexPageSpecial($, url, description);
          } else {
            this.indexPageNormal($, url, description);
          }
        });

        this.index = lunr((builder) => {
          builder.ref('url');
          builder.field('title');
          builder.field('h2');
          builder.field('h3');
          builder.field('extra');

          for (let i = 0; i < this.docs.length; i++) {
            builder.add(this.docs[i]);
          }
        });
        const endTime = new Date().getTime();
        const indexTime = (endTime - startTime) / 1000;
        console.log(`Page index finished in ${indexTime}s`);
      })
      .catch((err) => {
        let reason = '';
        if (err.response) {
          reason = `${err.message} URL: ${err.response.config.url}`;
        } else {
          reason = err.message;
        }
        console.log(`Unable to index pages. Reason: ${reason}`);
      });
  }

  search(query) {
    const results = this.searchIndex(query);
    const output = [];
    for (let i = 0; i < results.length; i++) {
      const data = this.getData(results[i]);
      if (data) {
        output.push(data);
      }
    }
    return output;
  }

  searchIndex(query) {
    let results = [];
    if (query && this.index) {
      results = this.index.query((q) => {
        lunr.tokenizer(query).forEach((token) => {
          q.term(token.toString(), { boost: 100, fields: ['title'] });
          q.term(token.toString(), { boost: 80, fields: ['h2'] });
          q.term(token.toString(), { boost: 60, fields: ['h3'] });
          q.term(token.toString(), { boost: 40, fields: ['extra'] });

          q.term(`${token.toString()}*`, { boost: 90, fields: ['title'] });
          q.term(`${token.toString()}*`, { boost: 70, fields: ['h2'] });
          q.term(`${token.toString()}*`, { boost: 50, fields: ['h3'] });
          q.term(`${token.toString()}*`, { boost: 30, fields: ['extra'] });
        });
      });
    }
    return results;
  }

  getData(result) {
    for (let i = 0; i < this.docs.length; i++) {
      if (result.ref === this.docs[i].url) {
        return this.docs[i];
      }
    }
    return undefined;
  }

  indexPageNormal($, url, description) {
    const title = this.parsePageHeadings($, 'h1').join(' ');
    const h2 = this.getIndex($, 'h2');
    const h3 = this.getIndex($, 'h3');
    const extra = this.getAdditionalIndices(url).join(' ');

    this.docs.push({
      url,
      title,
      h2,
      h3,
      extra,
      description,
    });
  }

  indexPageSpecial($, url, description) {
    const titles = this.parsePageHeadings($, 'h3');
    titles.forEach((rawTitle) => {
      const formattedTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      const extra = this.getAdditionalIndices(url).join(' ');
      const h3 = this.getAltList([rawTitle]);
      const formattedUrl = `${url}#${rawTitle.split(' ').join('-')}`;

      this.docs.push({
        url: formattedUrl,
        title: `${formattedTitle} - A to Z of NHS health writing`,
        h2: '',
        h3,
        extra,
        description,
      });
    });
  }

  getAdditionalIndices(url) {
    if (url in additionalIndices) {
      return additionalIndices[url];
    }
    return [];
  }

  parsePageHeadings($, type) {
    const headings = [];
    $('#maincontent').find(type).each((i, el) => {
      if ($(el).children().length === 0) {
        headings.push($(el).text().trim());
      } else {
        const title = $('title').text();
        headings.push(title.split(' - ')[0]);
      }
    });
    return headings;
  }

  getIndex($, type) {
    const headingsList = this.parsePageHeadings($, type);
    const altList = this.getAltList(headingsList);
    return headingsList.concat(altList).join(' ');
  }

  getAltList(list) {
    const listString = list.join(' ').toLowerCase();
    let altList = [];
    for (const key in alternativeSpelling) {
      if (listString.includes(key.toLowerCase())) {
        altList = altList.concat(alternativeSpelling[key]);
      }
    }
    return altList;
  }

  parseDescription($) {
    return this.parseMeta($, 'description');
  }

  isSpecialIndex($) {
    if (this.parseMeta($, 'page-index') === 'special') {
      return true;
    }
    return false;
  }

  parseMeta($, name) {
    return $(`meta[name='${name}']`).attr('content');
  }

  getConnectionConfig() {
    if (process.env.MANUAL_USERNAME || process.env.MANUAL_PASSWORD) {
      return {
        auth: {
          username: process.env.MANUAL_USERNAME,
          password: process.env.MANUAL_PASSWORD,
        },
      };
    }
    return {};
  }
}

module.exports = PageIndex;
