const { tmpdir } = require('os')
const { join } = require('path')

const nunjucks = require('nunjucks')

const config = require('../app/config')

const {
  getNunjucksParams,
  getNunjucksPath,
  getNunjucksCode,
  getHTMLCode,
  getAssetPath
} = require('./file-helper')

describe('Nunjucks params helper', () => {
  describe('Component directories from NHS.UK frontend', () => {
    it.each([
      'action-link',
      'back-link',
      'breadcrumb',
      'button',
      'card',
      'character-count',
      'checkboxes',
      'contents-list',
      'date-input',
      'details',
      'do-dont-list',
      'error-message',
      'error-summary',
      'fieldset',
      'footer',
      'header',
      'hero',
      'hint',
      'images',
      'input',
      'inset-text',
      'label',
      'pagination',
      'panel',
      'radios',
      'select',
      'skip-link',
      'summary-list',
      'tables',
      'tabs',
      'tag',
      'task-list',
      'textarea',
      'warning-callout'
    ])("should return macro options for '%s' directory", (component) => {
      expect(getNunjucksParams(component)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            type: expect.any(String),
            required: expect.any(Boolean),
            description: expect.any(String)
          })
        ])
      )
    })
  })

  describe('Item names from NHS.UK digital service manual', () => {
    it.each([
      'breadcrumbs',
      'buttons',
      'care-cards',
      'do-and-dont-lists',
      'expander',
      'hint-text',
      'table',
      'text-input'
    ])("should return macro options for '%s' item", (component) => {
      expect(getNunjucksParams(component)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            type: expect.any(String),
            required: expect.any(Boolean),
            description: expect.any(String)
          })
        ])
      )
    })
  })

  describe('Unknown item names', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    it.each(['cryptic-text', 'dont-care-cards', 'forward-link', 'unexpander'])(
      "should return empty array for '%s' item",
      (component) => {
        expect(getNunjucksParams(component)).toEqual([])

        // eslint-disable-next-line no-console
        expect(console.log).toHaveBeenCalledWith('Not found:', {
          component,
          item: component,
          path: expect.any(String)
        })
      }
    )
  })
})

describe('Nunjucks path helper', () => {
  it('should return Nunjucks path for an example', () => {
    expect(
      getNunjucksPath({ group: 'components', item: 'buttons', type: 'default' })
    ).toBe(
      join(
        config.sourcePath,
        'views/design-system/components/buttons/default/index.njk'
      )
    )

    expect(
      getNunjucksPath({
        group: 'components',
        item: 'buttons',
        type: 'secondary'
      })
    ).toBe(
      join(
        config.sourcePath,
        'views/design-system/components/buttons/secondary/index.njk'
      )
    )

    expect(
      getNunjucksPath({ group: 'components', item: 'buttons', type: 'reverse' })
    ).toBe(
      join(
        config.sourcePath,
        'views/design-system/components/buttons/reverse/index.njk'
      )
    )
  })
})

describe('Nunjucks code helper', () => {
  it('should return Nunjucks code for an example', () => {
    expect(
      getNunjucksCode({
        group: 'components',
        item: 'buttons',
        type: 'default'
      })
    ).toContain('{% from "button/macro.njk" import button %}')

    expect(
      getNunjucksCode({
        group: 'components',
        item: 'buttons',
        type: 'secondary'
      })
    ).toContain('{% from "button/macro.njk" import button %}')

    expect(
      getNunjucksCode({
        group: 'components',
        item: 'buttons',
        type: 'reverse'
      })
    ).toContain('{% from "button/macro.njk" import button %}')
  })
})

describe('HTML code helper', () => {
  const env = nunjucks.configure(config.nunjucksPaths)

  it('should return HTML code for an example', () => {
    expect(
      getHTMLCode({
        group: 'components',
        item: 'buttons',
        type: 'default',
        env
      })
    ).toContain(
      '<button class="nhsuk-button" data-module="nhsuk-button" type="submit">'
    )

    expect(
      getHTMLCode({
        group: 'components',
        item: 'buttons',
        type: 'secondary',
        env
      })
    ).toContain(
      '<button class="nhsuk-button nhsuk-button--secondary" data-module="nhsuk-button" type="submit">'
    )

    expect(
      getHTMLCode({
        group: 'components',
        item: 'buttons',
        type: 'reverse',
        env
      })
    ).toContain(
      '<button class="nhsuk-button nhsuk-button--reverse" data-module="nhsuk-button" type="submit">'
    )
  })
})

describe('Asset path helper', () => {
  it("should locate 'assets-manifest.json' assets", () => {
    expect(getAssetPath('main.mjs')).toBe('/javascripts/main.xxxxxxx.min.js')

    expect(getAssetPath('stylesheets/main.scss')).toBe(
      '/stylesheets/main.xxxxxxx.min.css'
    )
  })

  it("should throw when 'assets-manifest.json' is missing", async () => {
    await jest.isolateModulesAsync(async () => {
      const publicPath = tmpdir()

      // Mock empty public path
      jest.doMock('../app/config', () => ({ publicPath }))

      // Import when isolated to avoid cache
      const { getAssetPath: getAssetPathCopy } = await import(
        './file-helper.js'
      )

      expect(() => getAssetPathCopy('main.mjs')).toThrow(
        `ENOENT: no such file or directory, open '${publicPath}/assets-manifest.json'`
      )

      expect(() =>
        getAssetPathCopy('/stylesheets/main.xxxxxxx.min.css')
      ).toThrow(
        `ENOENT: no such file or directory, open '${publicPath}/assets-manifest.json'`
      )
    })
  })

  it('should return original path when unknown', () => {
    expect(getAssetPath()).toBe('/')
    expect(getAssetPath('example.jpg')).toBe('/example.jpg')
    expect(getAssetPath('example.gif')).toBe('/example.gif')
  })
})
