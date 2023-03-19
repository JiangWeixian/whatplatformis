import { isBrowser, isServer } from '../src/exports/node'
import { describe, expect, test } from 'vitest'

test('node', () => {
  expect(isBrowser).toBe(false)
  expect(isServer).toBe(true)
})
