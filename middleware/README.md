
# Documentation for server side code



## Search
### Packages Used
- [lunr](https://lunrjs.com/)
- [axios](https://github.com/axios/axios) (http request library - used to retrieve page content)
- [cheerio](https://github.com/cheeriojs/cheerio) (html parser)

### How it works
When server is started, page-indexer will retrieve the HTML of every page listed in `/sitemap` and index the pages in this form:
```js
{
  title: <all h1 element text>,
  index: <all h2 and h3 element text>,
  url: <page path>
}
```
For example, the Accessibility page would be indexed to:
```js
{
  title: 'Accessibility',
  index: 'What everyone needs to know Guidance for different activities Get in touch',
  url: '/accessibility'
}
```
The page index is then fed in to **lunr** for searching.

### Page Index Configuration
All additional configurations are in `middleware/page-index-additions.js`
There are three lists to add to:
`indexBlacklist` is a list of pages that the indexer should ignore. (please use the exact same url used in the links on sitemap)

`additionalIndices` controls any additional index to add to pages. The key is the url of the page and the value is a list of additional index.
```js
//in this case accessibility testing page will have additional index 'svg' added
const  additionalIndicies  = {
  '/accessibility/testing': [ 'svg' ]
}
```

`alternativeSpelling` allows alternative terms to be added. The key is the word which you want alternative terms and the value is a list of alternative terms.
```js
// in this case any page with the word 'fever' in its index will also include 'temperature' in the index
// similarly any page with the word 'temperature' will include 'fever' in the index
const  alternativeSpelling  = {
  'fever': [ 'temperature' ],
  'temperature': [ 'fever' ]
}
```
