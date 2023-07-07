import { expect, test } from 'vitest'

import { isBrowser, isServer } from '../src/exports/browser'

test('browser', () => {
  expect(isBrowser).toBe(true)
  expect(isServer).toBe(false)
})
