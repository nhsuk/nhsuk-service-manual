import { mockResizeObserver } from 'jsdom-testing-mocks'
import { createAll } from 'nhsuk-frontend'

import { Code } from './code.mjs'

const resizeObserverMock = mockResizeObserver()

describe('NHS digital service manual code', () => {
  /** @type {HTMLElement} */
  let $container

  beforeEach(() => {
    document.body.innerHTML = `
      <pre class="app-code" data-module="app-code">
        <code class="app-code__container hljs"></code>
      </pre>
    `

    const [code] = createAll(Code)
    $container = code.$container

    jest.spyOn($container, 'clientWidth', 'get').mockReturnValue(1024)
    jest.spyOn($container, 'clientHeight', 'get').mockReturnValue(768)

    jest.spyOn($container, 'scrollWidth', 'get').mockReturnValue(500)
    jest.spyOn($container, 'scrollHeight', 'get').mockReturnValue(500)
  })

  describe('Keyboard focus', () => {
    it('should not add tabindex by default', async () => {
      expect($container).not.toHaveAttribute('tabindex')
    })

    it('should add tabindex by code overflows container', async () => {
      jest.spyOn($container, 'clientWidth', 'get').mockReturnValue(320)
      jest.spyOn($container, 'clientHeight', 'get').mockReturnValue(240)

      resizeObserverMock.mockElementSize($container, {
        contentBoxSize: { inlineSize: 500, blockSize: 500 }
      })

      // Trigger resize
      resizeObserverMock.resize()

      expect($container).toHaveAttribute('tabindex')
    })
  })
})
