# whatplatformis

[![npm](https://img.shields.io/npm/v/whatplatformis)](https://github.com/JiangWeixian/whatplatformis) [![GitHub](https://img.shields.io/npm/l/whatplatformis)](https://github.com/JiangWeixian/whatplatformis)

## why this repo

Thanks to `nodejs` condition exports feature, `isServer` will automatic be `false` in browser side, and be `true` in node side. It's friendly for bundler to make `tree shaking` work. No more runtime `typeof window === 'undefined'` check.


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
  ]
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
  ]
}
```

Check [example/rollup](./example/rollup) for more details.

### `webpack`

When `splitChunks` is enabled, in `webpack.config.js`, should add plugin into plugin list to make tree shaking work.

```js
import { WhatPlatformIsPlugin } from 'whatplatformis/webpack'

{
  // ...other configs
  plugins: [
    new WhatPlatformIsPlugin()
  ]
}
```

Check [example/webpack](./example/webpack) for more details.

## development

- **Setup** - `pnpm i`
- **Build** - `pnpm build`

# 
<div align='right'>

*built with ❤️ by 😼*

</div>

