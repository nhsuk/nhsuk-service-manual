import { initialize } from '@open-iframe-resizer/core'
import { ConfigurableComponent } from 'nhsuk-frontend'

/**
 * Design example component
 *
 * @augments ConfigurableComponent<DesignExampleConfig>
 */
export class DesignExample extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for component
   * @param {Partial<DesignExampleConfig>} [config] - Design example config
   */
  constructor($root, config) {
    super($root, config)

    this.tabs = this.$root.querySelectorAll(`.${this.config.tabClass} a`)
    this.jsToggle = this.$root.querySelector(`.${this.config.toggleGroupClass}`)
    this.examples = /** @type {NodeListOf<HTMLElement>} */ (
      this.$root.querySelectorAll(`.${this.config.codeSnippetClass}`)
    )

    this.closeButtons = this.$root.querySelectorAll('.app-button--close')
    this.jsToggleButtons = this.$root.querySelectorAll('.app-button--js-toggle')
    this.jsToggleOnButton = this.jsToggleButtons[0]
    this.jsToggleOffButton = this.jsToggleButtons[1]

    this.iframe = this.$root.querySelector('iframe')
    this.link = this.$root.querySelector(`a.${this.config.linkClass}`)
    this.state = { isMouseDown: false }

    if (this.jsToggle && this.link) {
      this.announcements = document.createElement('span')
      this.announcements.classList.add(
        this.config.announcementsClass,
        'nhsuk-u-visually-hidden'
      )
      this.announcements.id = `${this.config.exampleId}-announcements`
      this.announcements.setAttribute('aria-live', 'polite')

      this.link.insertAdjacentElement('afterend', this.announcements)
      this.jsToggle.setAttribute('aria-describedby', this.announcements.id)

      this.announcements.textContent = this.config.javascript
        ? 'JavaScript is on'
        : 'JavaScript is off'
    }

    this.bindEvents()

    const hash = window.location.hash

    if (hash.match('^#options-')) {
      const $optionsElement = this.$root.querySelector(hash)
      if (!$optionsElement) {
        return
      }

      // Is hash for a specific options table? eg. #options-checkboxes-example--hint
      const isLinkToTable = hash.indexOf('--') > -1

      const exampleName = isLinkToTable
        ? hash.split('#options-')[1].split('--')[0]
        : hash.split('#options-')[1]

      if (exampleName) {
        const $tabLink = this.$root.querySelector(
          `a[href="#${exampleName}-nunjucks"]`
        )

        const $optionsDetailsElement = this.$root.querySelector(
          `#options-${exampleName}-details`
        )

        if (
          !($tabLink instanceof HTMLAnchorElement) ||
          !($optionsDetailsElement instanceof HTMLDetailsElement)
        ) {
          return
        }

        this.handleTabClick($tabLink)

        $optionsDetailsElement.open = true

        window.setTimeout(() => {
          $tabLink.focus()
          if (isLinkToTable) $optionsElement.scrollIntoView()
        }, 0)
      }
    }
  }

  bindEvents() {
    this.tabs.forEach((tab) =>
      tab.addEventListener('click', (event) => {
        this.handleTabClick(event.currentTarget)
        event.preventDefault()
      })
    )

    this.closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', (event) => {
        this.handleCloseClick()
        event.preventDefault()
      })

      closeButton.removeAttribute('hidden')
    })

    this.jsToggleButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        this.handleJsToggleClick(event.currentTarget)
      })
    })

    if (this.iframe) {
      const { iframe, state } = this

      iframe.addEventListener('mousedown', () => (state.isMouseDown = true))
      iframe.addEventListener('mouseup', () => (state.isMouseDown = false))

      initialize({ onBeforeIframeResize: () => this.isResizeAllowed() }, iframe)
    }
  }

  isResizeAllowed() {
    // Prevent resize when iframe has mouse down
    // e.g. When resizing manually using handle
    return !this.state.isMouseDown
  }

  handleTabClick($tabLink) {
    const { config, tabs } = this

    const $tabParent = $tabLink.parentElement
    const index = $tabParent.dataset.index

    tabs.forEach((tab) => {
      if (tab.href !== $tabLink.href) {
        tab.setAttribute('aria-expanded', 'false')
        tab.parentElement?.classList.remove(`${config.tabClass}--current`)
      }
    })

    $tabLink.setAttribute('aria-expanded', 'true')
    $tabParent.classList.add(`${config.tabClass}--current`)

    this.exampleToggler(index)
  }

  /**
   * @param {EventTarget | null} $button
   */
  handleJsToggleClick($button) {
    const { announcements, iframe, link } = this

    if (
      !($button instanceof HTMLButtonElement) ||
      !$button.dataset.href ||
      !announcements ||
      !iframe ||
      !link
    ) {
      return
    }

    const url = $button.dataset.href

    iframe.src = url
    link.href = url

    this.jsToggleButtons.forEach((link) => {
      link.setAttribute('aria-pressed', 'false')
    })

    $button.setAttribute('aria-pressed', 'true')

    announcements.textContent =
      $button === this.jsToggleOnButton
        ? 'JavaScript is on'
        : 'JavaScript is off'
  }

  handleCloseClick() {
    const { config, examples, tabs } = this

    examples.forEach((example) => {
      this.hideEl(example)
    })

    tabs.forEach((tab) => {
      if (
        tab.parentElement?.classList.contains(`${config.tabClass}--current`)
      ) {
        tab.setAttribute('aria-expanded', 'false')
        tab.parentElement.classList.remove(`${config.tabClass}--current`)
      }
    })
  }

  showEl(el) {
    const { config } = this

    if (el.classList.contains(config.hiddenClass)) {
      el.classList.remove(config.hiddenClass)
    }
  }

  hideEl(el) {
    const { config } = this

    if (!el.classList.contains(config.hiddenClass)) {
      el.classList.add(config.hiddenClass)
    }
  }

  exampleToggler(index) {
    const { config, examples } = this

    examples.forEach((example) =>
      example.dataset.index === index
        ? example.classList.remove(config.hiddenClass)
        : example.classList.add(config.hiddenClass)
    )
  }

  /**
   * Name for the component used when initialising using data-module attributes
   */
  static moduleName = 'app-design-example'

  /**
   * Design example default config
   *
   * @see {@link DesignExampleConfig}
   * @constant
   * @type {DesignExampleConfig}
   */
  static defaults = Object.freeze({
    announcementsClass: 'app-design-example__announcements',
    codeSnippetClass: 'app-code-snippet__preformatted',
    exampleId: 'example',
    hiddenClass: 'js-hidden',
    javascript: true,
    linkClass: 'app-design-example__link',
    tabClass: 'app-tabs__item',
    toggleGroupClass: 'app-design-example__js-toggle-group'
  })

  /**
   * Design example config schema
   *
   * @constant
   * @satisfies {Schema<DesignExampleConfig>}
   */
  static schema = Object.freeze({
    properties: {
      announcementsClass: { type: 'string' },
      codeSnippetClass: { type: 'string' },
      exampleId: { type: 'string' },
      hiddenClass: { type: 'string' },
      javascript: { type: 'boolean' },
      linkClass: { type: 'string' },
      tabClass: { type: 'string' },
      toggleGroupClass: { type: 'string' }
    }
  })
}

/**
 * Design example config
 *
 * @typedef {object} DesignExampleConfig
 * @property {string} announcementsClass - Announcements class
 * @property {string} codeSnippetClass - Code snippet class
 * @property {string} exampleId - Design example ID
 * @property {string} hiddenClass - Hidden class
 * @property {boolean} [javascript] - Whether JavaScript is enabled
 * @property {string} linkClass - Link class
 * @property {string} tabClass - Tab class
 * @property {string} toggleGroupClass - Toggle group class
 */

/**
 * @import { Schema } from 'nhsuk-frontend'
 */
