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

    this.tabs = this.$root.querySelectorAll(`.${this.tabClass}`)
    this.examples = this.$root.querySelectorAll(
      '.app-code-snippet__preformatted'
    )
    this.closeButtons = this.$root.querySelectorAll('.app-button--close')
    this.copyButtons = this.$root.querySelectorAll('.app-button--copy')

    this.iframe = {
      element: this.$root.querySelector('iframe'),
      isMouseDown: false
    }

    this.bindEvents()
  }

  bindEvents() {
    this.tabs.forEach((tab) =>
      tab.addEventListener('click', (e) => this.handleTabClick(e))
    )

    this.closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', (e) => this.handleCloseClick(e))
      closeButton.removeAttribute('hidden')
    })

    if (ClipboardJS.isSupported()) {
      this.copyButtons.forEach((copyButton) => this.initCopyClick(copyButton))
    }

    if (this.iframe.element) {
      const { iframe: state } = this
      const { element: iframe } = this.iframe

      iframe.addEventListener('mousedown', () => (state.isMouseDown = true))
      iframe.addEventListener('mouseup', () => (state.isMouseDown = false))

      initialize({ onBeforeIframeResize: () => this.isResizeAllowed() }, iframe)
    }
  }

  isResizeAllowed() {
    // Prevent when iframe and body has focus
    // e.g. When resizing manually using handle
    return !this.iframe.isMouseDown
  }

  handleTabClick(e) {
    const targetEl = e.target.parentElement
    const index = targetEl.dataset.index

    e.preventDefault()

    this.tabs.forEach((tab) => {
      if (tab.classList.contains(this.currentTabClass)) {
        tab.classList.remove(this.currentTabClass)
      }
    })

    targetEl.classList.add(this.currentTabClass)

    this.exampleToggler(index)
  }

  handleCloseClick() {
    this.examples.forEach((example) => {
      this.hideEl(example)
    })

    this.tabs.forEach((tab) => {
      if (tab.classList.contains(this.currentTabClass)) {
        tab.classList.remove(this.currentTabClass)
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
