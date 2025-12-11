import { initAll } from 'nhsuk-frontend'

jest.mock('nhsuk-frontend')

describe('NHS digital service manual', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = ''
    document.body.classList.add('nhsuk-frontend-supported')
  })

  describe('NHS.UK frontend', () => {
    it('should init all components', async () => {
      await import('./main.mjs')

      // Should initialise after import
      expect(initAll).toHaveBeenCalled()
    })
  })
})
