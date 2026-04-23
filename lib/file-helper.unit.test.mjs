import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { nunjucks } from 'nhsuk-frontend/lib'

import config from '../app/config.js'
import {
  getAssetPath,
  getHTMLCode,
  getNunjucksCode,
  getNunjucksPath,
  placeholders
} from './file-helper.js'

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
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2026, 3, 2))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

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

  it('should update find and replace placeholders', () => {
    const code = getNunjucksCode({
      group: 'components',
      item: 'date-input',
      type: 'default'
    })

    const replacement = placeholders.get('((dateLastMonth))')?.()
    expect(replacement).toBe('18 3 2026')

    expect(code).not.toContain('For example, ((dateLastMonth))')
    expect(code).toContain(`For example, ${replacement}`)
  })
})

describe('HTML code helper', () => {
  const env = nunjucks.configure(config.nunjucksPaths)

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2026, 3, 18))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should return HTML code for an example', () => {
    expect(
      getHTMLCode.call(
        { env },
        {
          group: 'components',
          item: 'buttons',
          type: 'default'
        }
      )
    ).toContain(
      '<button class="nhsuk-button" data-module="nhsuk-button" type="submit">'
    )

    expect(
      getHTMLCode.call(
        { env },
        {
          group: 'components',
          item: 'buttons',
          type: 'secondary'
        }
      )
    ).toContain(
      '<button class="nhsuk-button nhsuk-button--secondary" data-module="nhsuk-button" type="submit">'
    )

    expect(
      getHTMLCode.call(
        { env },
        {
          group: 'components',
          item: 'buttons',
          type: 'reverse'
        }
      )
    ).toContain(
      '<button class="nhsuk-button nhsuk-button--reverse" data-module="nhsuk-button" type="submit">'
    )
  })

  it('should update find and replace placeholders', () => {
    const code = getHTMLCode.call(
      { env },
      {
        group: 'components',
        item: 'date-input',
        type: 'default'
      }
    )

    const replacement = placeholders.get('((dateLastMonth))')?.()
    expect(replacement).toBe('18 3 2026')

    expect(code).not.toContain('For example, ((dateLastMonth))')
    expect(code).toContain(`For example, ${replacement}`)
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
      const { getAssetPath: getAssetPathCopy } =
        await import('./file-helper.js')

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
