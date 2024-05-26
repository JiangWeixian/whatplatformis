# whatplatformis

[![npm](https://img.shields.io/npm/v/whatplatformis)](https://github.com/JiangWeixian/whatplatformis) [![GitHub](https://img.shields.io/npm/l/whatplatformis)](https://github.com/JiangWeixian/whatplatformis)

## why this repo

> Thanks to `nodejs` condition exports feature, `isServer` will automatic be `false` in browser side, and be `true` in node side. It's friendly for bundler to make `tree shaking` work. No more runtime `typeof window === 'undefined'` check.


## install

```console
pnpm i whatplatformis
```

## usage

```ts
import { isBrowser, isServer } from 'whatplatformis'

// isServer will be false in browser
// isBrowser will be true in browser

if (isServer) {
  // code...
}
```

Code under `isServer` will be automatic tree shaking in target `browser` bundled codes.

### `rollup`

Build for target `browser`

```js
// rollup.config.mjs
module.exports = {
  input: ['<entries>'],
  plugins: [
    // other plugins...
    resolve({
      browser: true,
    }),
  ],
}
```

Build for target `node`

```js
// rollup.config.mjs
module.exports = {
  input: ['<entries>'],
  plugins: [
    // other plugins...
    resolve(),
  ],
}
```

Check [example/rollup](./example/rollup) for more details.

### swc

```console
pnpm i swc-plugin-whatplatformis
```

add this plugin in `.swcrc` or `swc-loader` options

```json
{
  "jsc": {
    "experimental": {
      "plugins": [
        [
          "swc-plugin-whatplatformis",
          {
            "target": "server",
            "packages": ["whatplatformis"],
            "isServerFns": []
          }
        ]
      ]
    }
  }
}
```

will replace `isServer` or `isBrowser` into bool. e.g. when target is `server`

**before**

```ts
import { isBrowser, isServer } from 'whatplatformis'

if (isServer) {
  console.log('isServer')
}

const target = isBrowser
```

**after**

```ts
import { isBrowser, isServer } from 'whatplatformis'

if (true) {
  console.log('isServer')
}

const target = false
```

`options.target`

- `type: "server" | "browser"`

Control replace `isBrowser | isServer` into `false | true`

`options.packages`

- `type: string[]`

Sometimes you maintain similar packages like `whatplatformis`, e.g. `is-server`, you can defined extra packages

```json
{ "target": "server", "packages": ["whatplatformis", "is-server"] }
```

Plugin will also replace `isServer` and `isBrowser` from packages `whatplatformis` and `is-server`

`options.isServerFns`

- `type: string[]`

> [!WARNING]  
`serverFns` ignore packages config, will not check where imported from, any package's `isServreFns` will be replaced into boolean.

Replace runtime `isSSR()` or `isSSR?.()` or `namespace.isSSR()` into `true` or `false` based on `options.target`.


## `FAQ`

**failed when `webpack.splitChunks` enabled**

When `splitChunks` is enabled in `webpack`, `whatplatformis` maybe bundled into common chunks, should add plugin into plugin list to make tree shaking work.

```
import { WhatPlatformIsPlugin } from 'whatplatformis/webpack'

{
  // ...other configs
  plugins: [
    new WhatPlatformIsPlugin()
  ]
}
```

or use `swc-plugin-whatplatformis` if in `swc` world.

Check [example/webpack](./example/webpack) for more details.

## development

- **Setup** - `pnpm i`
- **Build** - `pnpm build`

# 
<div align='right'>

*built with ❤️ by 😼*

</div>

