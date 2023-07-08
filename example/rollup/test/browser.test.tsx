// @vitest-environment jsdom
import { isBrowser, isServer } from 'whatplatformis'
import { expect, test } from 'vitest'

test('browser', () => {
  expect(isBrowser).toBe(true)
  expect(isServer).toBe(false)
})
