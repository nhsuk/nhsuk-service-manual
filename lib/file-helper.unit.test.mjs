import { tmpdir } from 'node:os'
import { join } from 'node:path'

import nunjucks from 'nunjucks'

import config from '../app/config.js'

import {
  getNunjucksPath,
  getNunjucksCode,
  getHTMLCode,
  getAssetPath
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
