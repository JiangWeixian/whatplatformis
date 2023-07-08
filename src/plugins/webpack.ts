import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import webpack from 'webpack'

import type { Compiler } from 'webpack'

const PACKAGE_RE = /^whatplatformis/
const require = createRequire(import.meta.url)

export class WhatPlatformIsPlugin {
  nmp: webpack.NormalModuleReplacementPlugin
  constructor() {
    this.nmp = new webpack.NormalModuleReplacementPlugin(PACKAGE_RE, (resource) => {
      if (resource.request.includes('?t')) {
        return
      }
      // whatplatformis always is uniq package againts webpack common chunks rules
      resource.request = `whatplatformis?t=${Date.now()}`
    })
  }

  apply(compiler: Compiler) {
    this.nmp.apply(compiler)
    const dir = dirname(require.resolve('whatplatformis/package.json'))
    if (compiler.options.target === 'node') {
      compiler.options.resolve.alias = {
        ...compiler.options.resolve.alias,
        whatplatformis: join(dir, 'dist/node.mjs'),
      }
    } else {
      compiler.options.resolve.alias = {
        ...compiler.options.resolve.alias,
        whatplatformis: join(dir, 'dist/browser.mjs'),
      }
    }
  }
}
