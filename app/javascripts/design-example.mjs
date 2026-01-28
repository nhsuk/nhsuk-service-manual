import { initialize } from '@open-iframe-resizer/core'
import ClipboardJS from 'clipboard'
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
    this.examples = this.$root.querySelectorAll(
      '.app-code-snippet__preformatted'
    )
    this.closeButtons = this.$root.querySelectorAll('.app-button--close')
    this.copyButtons = this.$root.querySelectorAll('.app-button--copy')
    this.iframe = this.$root.querySelector('iframe')

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

    if (ClipboardJS.isSupported()) {
      this.copyButtons.forEach((copyButton) => this.initCopyClick(copyButton))
    }

    if (this.iframe) {
      initialize(
        {
          // Prevent resize when iframe has mouse cursor
          // e.g. When resizing manually using handle
          onBeforeIframeResize({ interactionState }) {
            return !interactionState.isHovered
          }
        },
        this.iframe
      )
    }
  }

  handleTabClick($tabLink) {
    const $tabParent = $tabLink.parentElement
    const index = $tabParent.dataset.index

    this.tabs.forEach((tab) => {
      if (tab.href !== $tabLink.href) {
        tab.setAttribute('aria-expanded', 'false')
        tab.parentElement.classList.remove(this.currentTabClass)
      }
    })

    $tabLink.setAttribute('aria-expanded', 'true')
    $tabParent.classList.add(this.currentTabClass)

    this.exampleToggler(index)
  }

  handleCloseClick() {
    this.examples.forEach((example) => {
      this.hideEl(example)
    })

    this.tabs.forEach((tab) => {
      if (tab.parentElement.classList.contains(this.currentTabClass)) {
        tab.setAttribute('aria-expanded', 'false')
        tab.parentElement.classList.remove(this.currentTabClass)
      }
    })
  }

  initCopyClick(copyButton) {
    const clipboard = new ClipboardJS(copyButton, {
      target: () => copyButton.parentElement.querySelector('pre')
    })

    // Update button on success
    clipboard.on('success', (event) => {
      copyButton.innerText = 'Code copied'
      event.clearSelection()

      // Reset button after delay
      setTimeout(() => {
        copyButton.innerText = 'Copy code'
      }, 2500)
    })

    // Reveal button
    copyButton.removeAttribute('hidden')
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
