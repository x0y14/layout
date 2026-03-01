import { test } from 'vitest'
import assert from 'node:assert/strict'
import app from '../src/index'

test('/ のレスポンスに my-element が含まれる', async () => {
  const response = await app.request('/')
  assert.equal(response.status, 200)
  const html = await response.text()
  assert(html.includes('<my-element>'))
})
