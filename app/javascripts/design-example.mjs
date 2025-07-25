import ClipboardJS from 'clipboard'
import { iframeResize } from 'iframe-resizer'

class DesignExample {
  static selector() {
    return '.design-example'
  }

  constructor(node) {
    this.node = node
    this.tabClass = 'app-tabs__item'
    this.currentTabClass = `${this.tabClass}--current`
    this.hiddenClass = 'js-hidden'

    this.tabs = this.node.querySelectorAll(`.${this.tabClass}`)
    this.examples = this.node.querySelectorAll('.code-snippet__preformatted')
    this.closeButtons = this.node.querySelectorAll('.app-button--close')
    this.copyButtons = this.node.querySelectorAll('.app-button--copy')
    this.iframe = this.node.querySelector('iframe')

    this.bindEvents()

    iframeResize([{ heightCalculationMethod: 'max' }], this.iframe)
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

  // Yoink attr: https://www.456bereastreet.com/archive/201112/how_to_adjust_an_iframe_elements_height_to_fit_its_content/
  setIframeHeight(iframe) {
    if (iframe) {
      const iframeWin =
        iframe.contentWindow || iframe.contentDocument.parentWindow
      if (iframeWin.document.body) {
        iframe.height =
          iframeWin.document.documentElement.scrollHeight ||
          iframeWin.document.body.scrollHeight
      }
    }
  }
}

export default DesignExample
