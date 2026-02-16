import { Component, ElementError } from 'nhsuk-frontend'

/**
 * Code with scroll container component
 *
 * @augments {Component<HTMLPreElement>}
 */
export class Code extends Component {
  static elementType = HTMLPreElement

  /**
   * @param {Element | null} $root - HTML element to use for component
   */
  constructor($root) {
    super($root)

    const $container = this.$root.querySelector('.app-code__container')
    if (!($container instanceof HTMLElement)) {
      throw new ElementError({
        component: Code,
        element: $container,
        identifier: 'Code container (`.app-code__container`)'
      })
    }

    this.$container = $container
    this.handleEnableFocus = this.enableFocus.bind(this)

    // ResizeObserver isn't supported by Safari < 13.1 so we need to fall back
    // to window resize, checking the container width has actually changed
    if ('ResizeObserver' in window) {
      this.resizeObserver = new window.ResizeObserver(this.handleEnableFocus)
      this.resizeObserver.observe(this.$container)
    } else {
      window.addEventListener('resize', this.handleEnableFocus)
    }
  }

  /**
   * Enable container focus
   */
  enableFocus() {
    if (this.isOverflowing()) {
      this.$container.setAttribute('tabindex', '0')
    } else {
      this.$container.removeAttribute('tabindex')
    }
  }

  /**
   * Checks if the container scrollable width or height is greater than the
   * width or height the container is being rendered at
   */
  isOverflowing() {
    return (
      this.$container.scrollHeight > this.$container.clientHeight ||
      this.$container.scrollWidth > this.$container.clientWidth
    )
  }

  static moduleName = 'app-code'
}
