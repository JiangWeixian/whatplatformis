import path from 'node:path'
import fs from 'node:fs/promises'

import { expect, it } from 'vitest'
import fg from 'fast-glob'

const example = path.resolve(__dirname, '../example')

it('tree-shaking on webpack should work', () => {
  const dist = path.resolve(example, './webpack/dist')
  const files = fg.sync('**/**.js', {
    cwd: dist,
    onlyDirectories: true,
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
