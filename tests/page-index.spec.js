const cheerio = require('cheerio');
const PageIndex = require('../middleware/page-index');

const config = {
  baseURL: 'http://localhost',
  env: 'development',
  port: 3000,
};

test('test parse page description', () => {
  const pageIndex = new PageIndex(config);
  const pageData = '<meta name="description" content="Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.">';
  const $ = cheerio.load(pageData);

  expect(pageIndex.parseDescription($)).toBe('Design and build digital services for the NHS. Things you need to make consistent, usable services that put people first.');
});

test('test get index', () => {
  const pageIndex = new PageIndex(config);
  const pageData = '<div id="maincontent"><h2>test</h2><h3>test2</h3><h2>fever</h2></div><h2>test3</h2>';
  const $ = cheerio.load(pageData);
  const expectedIndex = 'test fever temperature';

  expect(pageIndex.getIndex($, 'h2')).toBe(expectedIndex);
});

test('test get alt list', () => {
  const list = ['fever'];
  const pageIndex = new PageIndex(config);

  expect(pageIndex.getAltList(list)).toEqual(['temperature']);
});

test('test parse page title', () => {
  const pageIndex = new PageIndex(config);
  const pageData = '<h1>title</h1><div id="maincontent"><h1>title2</h1></div>';
  const $ = cheerio.load(pageData);

  expect(pageIndex.parsePageHeadings($, 'h1')).toEqual(['title2']);
});
