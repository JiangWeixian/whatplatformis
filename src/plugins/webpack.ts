import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import webpack from 'webpack'

import type { Compiler } from 'webpack'

const PACKAGE_RE = /^whatplatformis/
const require = createRequire(import.meta.url)

export class WhatPlatformIsPlugin {
  nmp: webpack.NormalModuleReplacementPlugin
  constructor() {
    const crypto = createHash('sha256')
    this.nmp = new webpack.NormalModuleReplacementPlugin(PACKAGE_RE, (resource) => {
      if (resource.request.includes('?t')) {
        return
      }
      // Use which file import "whatplatformis" as uniq id
      // Make sure chunkhash is keeping same
      const issuer = resource.contextInfo.issuer ?? Date.now().toString()
      const hash = crypto.update(issuer)
      // whatplatformis always is uniq package againts webpack common chunks rules
      resource.request = `whatplatformis?t=${hash}`
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
