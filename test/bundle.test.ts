import fs from 'node:fs/promises'
import path from 'node:path'

import fg from 'fast-glob'
import {
  describe,
  expect,
  it,
} from 'vitest'

const example = path.resolve(__dirname, '../example')

describe('tree shaking', () => {
  it('tree-shaking on webpack should work', () => {
    const dist = path.resolve(example, './webpack/dist')
    const files = fg.sync('**/**.js', {
      cwd: dist,
      onlyFiles: true,
      absolute: true,
      dot: false,
    })
    const notContainIsServer = files.every(async (file) => {
      const content = await fs.readFile(file, 'utf-8')
      return !content.includes('isServer')
    })
    expect(notContainIsServer).toBe(true)
  })

  it('tree-shaking on rollup should work', async () => {
    // index.mjs is for browser, node.mjs is for node
    const browser = path.resolve(example, './rollup/dist/index.mjs')
    const node = path.resolve(example, './rollup/dist/node.mjs')
    let content = await fs.readFile(browser, 'utf-8')
    expect(content).not.toContain('console.log(\'Server side\')')
    content = await fs.readFile(node, 'utf-8')
    expect(content).not.toContain('console.log(\'Browser side\')')
  })
})

const js = [
  'static/js/main.9c2da4e3af2e3d322fd0.js',
  'static/js/vendors.ccdc047af1c8df17f6b3.js',
]

describe('chunkhash', () => {
  it('chunkhash should be same', () => {
    const dist = path.resolve(example, './webpack/dist')
    const files = fg.sync('**/js/*.js', {
      cwd: dist,
      onlyFiles: true,
      absolute: false,
      dot: false,
    })
    expect(files).toStrictEqual(js)
  })
})
