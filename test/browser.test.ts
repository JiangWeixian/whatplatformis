import { isBrowser, isServer } from '../src/exports/browser'
import { describe, expect, test } from 'vitest'

test('browser', () => {
  expect(isBrowser).toBe(true)
  expect(isServer).toBe(false)
})
