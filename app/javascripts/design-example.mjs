import { initialize } from '@open-iframe-resizer/core'
import { Component } from 'nhsuk-frontend'

export class DesignExample extends Component {
  /**
   * @param {Element | null} $root - HTML element to use for component
   */
  constructor($root) {
    super($root)

    this.tabClass = 'app-tabs__item'
    this.currentTabClass = `${this.tabClass}--current`
    this.hiddenClass = 'js-hidden'

    this.tabs = this.$root.querySelectorAll(`.${this.tabClass} a`)
    this.examples = /** @type {NodeListOf<HTMLElement>} */ (
      this.$root.querySelectorAll('.app-code-snippet__preformatted')
    )

    this.closeButtons = this.$root.querySelectorAll('.app-button--close')
    this.jsToggleButtons = this.$root.querySelectorAll('.app-button--js-toggle')
    this.jsToggleOnButton = this.jsToggleButtons[0]
    this.jsToggleOffButton = this.jsToggleButtons[1]

    this.iframe = this.$root.querySelector('iframe')
    this.announcement = this.$root.querySelector(
      '.app-design-example__announcement'
    )
    this.link = this.$root.querySelector('a.app-design-example__link')
    this.state = { isMouseDown: false }
    this.resizer = null

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
        .then(([resizer]) => {
          this.resizer = resizer
          return null
        })
        .catch(() => {
          // initialization failed, ignore
        })
    }
  }

  isResizeAllowed() {
    // Prevent resize when iframe has mouse down
    // e.g. When resizing manually using handle
    return !this.state.isMouseDown
  }

  handleTabClick($tabLink) {
    const $tabParent = $tabLink.parentElement
    const index = $tabParent.dataset.index

    this.tabs.forEach((tab) => {
      if (tab.href !== $tabLink.href) {
        tab.setAttribute('aria-expanded', 'false')
        tab.parentElement?.classList.remove(this.currentTabClass)
      }
    })

    $tabLink.setAttribute('aria-expanded', 'true')
    $tabParent.classList.add(this.currentTabClass)

    this.exampleToggler(index)
  }

  /**
   * @param {EventTarget | null} $button
   */
  handleJsToggleClick($button) {
    const { announcement, iframe, link } = this

    if (
      !($button instanceof HTMLButtonElement) ||
      !$button.dataset.href ||
      !announcement ||
      !iframe ||
      !link
    ) {
      return
    }

    iframe.addEventListener(
      'load',
      () => {
        this.resizer?.unsubscribe()
        initialize(
          { onBeforeIframeResize: () => this.isResizeAllowed() },
          iframe
        )
          .then(([resizer]) => {
            this.resizer = resizer
            return null
          })
          .catch(() => {
            // initialization failed, ignore
          })
      },
      { once: true }
    )

    const url = $button.dataset.href

    iframe.src = url
    link.href = url

    this.jsToggleButtons.forEach((link) => {
      link.setAttribute('aria-pressed', 'false')
    })

    $button.setAttribute('aria-pressed', 'true')

    announcement.textContent =
      $button === this.jsToggleOnButton
        ? 'JavaScript is on'
        : 'JavaScript is off'
  }

  handleCloseClick() {
    this.examples.forEach((example) => {
      this.hideEl(example)
    })

    this.tabs.forEach((tab) => {
      if (tab.parentElement?.classList.contains(this.currentTabClass)) {
        tab.setAttribute('aria-expanded', 'false')
        tab.parentElement.classList.remove(this.currentTabClass)
      }
    })
  }

  showEl(el) {
    if (el.classList.contains(this.hiddenClass)) {
      el.classList.remove(this.hiddenClass)
    }
  }

  hideEl(el) {
    if (!el.classList.contains(this.hiddenClass)) {
      el.classList.add(this.hiddenClass)
    }
  }

  exampleToggler(index) {
    this.examples.forEach((example) =>
      example.dataset.index === index
        ? example.classList.remove(this.hiddenClass)
        : example.classList.add(this.hiddenClass)
    )
  }

  static moduleName = 'app-design-example'
}
