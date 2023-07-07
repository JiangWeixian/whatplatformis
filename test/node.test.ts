import { expect, test } from 'vitest'

import { isBrowser, isServer } from '../src/exports/node'

test('node', () => {
  expect(isBrowser).toBe(false)
  expect(isServer).toBe(true)
})
