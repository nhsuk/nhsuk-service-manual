/**
 * Populate search autocomplete suggestion text from indexed page
 *
 * @param {PageDoc} obj - Indexed page
 * @returns {string} Suggestion text
 */
export const suggestion = ({ title, parent }) => {
  const truncateLength = 36
  const dots = title.length > truncateLength ? '...' : ''
  const resultTruncated = title.substring(0, truncateLength) + dots
  return `<span class="autocomplete__option-title">${resultTruncated}</span>
    ${parent ? `<span class="autocomplete__option-category">${parent}</span>` : ''}
  `
}

/**
 * Populate search autocomplete input value from indexed page
 *
 * @param {PageDoc} [obj] - Indexed page
 * @returns {string} Input value
 */
export const inputValue = (obj) => {
  if (obj && obj.title) return obj.title.trim()
  return ''
}

/**
 * Function to populate the search autocomplete
 *
 * @type {OnSourceCallback<PageDoc>}
 */
export const source = (query, populateResults) => {
  // Build URL for search endpoint
  const url = `/suggestions/?search=${query}`
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.onload = () => {
    if (xhr.status === 200) {
      const json = JSON.parse(xhr.responseText)
      populateResults(json)
    }
  }
  xhr.send()
}

/**
 * @type {OnConfirmCallback<PageDoc>}
 */
export const onConfirm = ({ url }) => {
  window.location = url
}

/**
 * @import { OnConfirmCallback, OnSourceCallback } from './accessible-autocomplete.mjs'
 * @import { PageDoc } from '../../lib/page-index.js'
 */
