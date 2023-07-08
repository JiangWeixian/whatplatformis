import { isBrowser, isServer } from 'whatplatformis'
import { expect, test } from 'vitest'

test('node', () => {
  expect(isBrowser).toBe(false)
  expect(isServer).toBe(true)
})
