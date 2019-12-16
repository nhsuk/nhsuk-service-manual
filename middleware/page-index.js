/* eslint-disable class-methods-use-this */
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
    axios.get(`${baseUrl}/service-manual/sitemap`, config)
      .then((response) => {
        let pages = [];
        const $ = cheerio.load(response.data);
        const links = $('#maincontent').find('a');
        links.each((i, el) => {
          const href = $(el).attr('href');
          if (!indexBlacklist.includes(href)) {
            let url = `${baseUrl}${href}`;
            if (href.toLowerCase().includes('http')) {
              url = href;
            }
            pages = [...pages, axios.get(url, config)];
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
          builder.field('parent');

          this.docs.forEach(doc => builder.add(doc));
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
    return this.searchIndex(query)
      .map(res => this.getData(res))
      .filter(Boolean);
  }

  searchIndex(query) {
    return this.index.query((q) => {
      lunr.tokenizer(query).forEach((token) => {
        const tokenString = token.toString();
        q.term(tokenString, { boost: 100, fields: ['title'] });
        q.term(tokenString, { boost: 80, fields: ['h2'] });
        q.term(tokenString, { boost: 60, fields: ['h3'] });
        q.term(tokenString, { boost: 40, fields: ['extra'] });

        q.term(`${tokenString}*`, { boost: 90, fields: ['title'] });
        q.term(`${tokenString}*`, { boost: 70, fields: ['h2'] });
        q.term(`${tokenString}*`, { boost: 50, fields: ['h3'] });
        q.term(`${tokenString}*`, { boost: 30, fields: ['extra'] });
      });
    });
  }

  getData({ ref }) {
    return this.docs.find(({ url }) => url === ref);
  }

  indexPageNormal($, url, description) {
    const title = this.parsePageHeadings($, 'h1').join(' ');
    const h2 = this.getIndex($, 'h2');
    const h3 = this.getIndex($, 'h3');
    const extra = this.getAdditionalIndices(url).join(' ');
    const parent = $('.nhsuk-breadcrumb__item').last().text();

    this.docs = [
      ...this.docs,
      {
        description,
        extra,
        h2,
        h3,
        parent,
        title,
        url,
      },
    ];
  }

  indexPageSpecial($, url, description) {
    const titles = this.parsePageHeadings($, 'h3');
    titles.forEach((rawTitle) => {
      const formattedTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      const extra = this.getAdditionalIndices(url).join(' ');
      const h3 = this.getAltList([rawTitle]);
      const formattedUrl = `${url}#${rawTitle.split(' ').join('-')}`;

      this.docs = [
        ...this.docs,
        {
          description,
          extra,
          h2: '',
          h3,
          parent: 'A to Z of NHS health writing',
          title: formattedTitle,
          url: formattedUrl,
        },
      ];
    });
  }

  getAdditionalIndices(url) {
    return additionalIndices[url] || [];
  }

  parsePageHeadings($, type) {
    let headings = [];
    $('#maincontent').find(type).each((_, el) => {
      if ($(el).children().length === 0) {
        headings = [...headings, $(el).text().trim()];
      } else {
        const title = $('title').text();
        headings = [...headings, title.split(' - ')[0]];
      }
    });
    return headings;
  }

  getIndex($, type) {
    const headingsList = this.parsePageHeadings($, type);
    return [
      ...headingsList,
      ...this.getAltList(headingsList),
    ].join(' ');
  }

  getAltList(list) {
    const listString = list.join(' ').toLowerCase();
    return Object.keys(alternativeSpelling).reduce((altList, key) => {
      if (listString.includes(key.toLowerCase())) {
        return [alternativeSpelling[key], ...altList];
      }
      return altList;
    });
  }

  parseDescription($) {
    return this.parseMeta($, 'description');
  }

  isSpecialIndex($) {
    return this.parseMeta($, 'page-index') === 'special';
  }

  parseMeta($, name) {
    return $(`meta[name='${name}']`).attr('content');
  }

  getConnectionConfig() {
    const { MANUAL_USERNAME, MANUAL_PASSWORD } = process.env;
    if (MANUAL_USERNAME || MANUAL_PASSWORD) {
      return {
        auth: {
          password: MANUAL_PASSWORD,
          username: MANUAL_USERNAME,
        },
      };
    }
    return {};
  }
}

module.exports = PageIndex;
