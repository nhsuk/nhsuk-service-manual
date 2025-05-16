import { tmpdir } from 'os';

const { getAssetPath } = require('./file-helper');

describe('Asset helper', () => {
  it("should locate 'assets-manifest.json' assets", () => {
    expect(getAssetPath('main.js')).toBe(
      '/javascripts/main.xxxxxxx.min.js',
    );

    expect(getAssetPath('stylesheets/main.scss')).toBe(
      '/stylesheets/main.xxxxxxx.min.css',
    );
  });

  it("should throw when 'assets-manifest.json' is missing", async () => {
    await jest.isolateModulesAsync(async () => {
      const publicPath = tmpdir();

      // Mock empty public path
      jest.doMock('../app/config', () => ({ publicPath }));

      // Import when isolated to avoid cache
      const { getAssetPath: getAssetPathCopy } = await import(
        './file-helper'
      );

      expect(() => getAssetPathCopy('main.js')).toThrow(
        `ENOENT: no such file or directory, open '${publicPath}/assets-manifest.json'`,
      );

      expect(() => getAssetPathCopy('/stylesheets/main.xxxxxxx.min.css')).toThrow(
        `ENOENT: no such file or directory, open '${publicPath}/assets-manifest.json'`,
      );
    });
  });

  it('should return original path when unknown', () => {
    expect(getAssetPath()).toBe('/');
    expect(getAssetPath('example.jpg')).toBe('/example.jpg');
    expect(getAssetPath('example.gif')).toBe('/example.gif');
  });
});
