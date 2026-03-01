import { test } from 'vitest'
import assert from 'node:assert/strict'
import app from '../src/index'

test('/ のレスポンスにレイアウトとコンポーネントが含まれる', async () => {
  const response = await app.request('/')
  assert.equal(response.status, 200)
  const html = await response.text()
  assert(html.includes('<div class="HStack main-layout">'))
  assert(html.includes('<app-logo></app-logo>'))
  assert(html.includes('<x-menu kind="home"></x-menu>'))
  assert(html.includes('<posting-area></posting-area>'))
  assert(html.includes('<time-line></time-line>'))
  assert(html.includes('<x-trend></x-trend>'))
})

test('/login のレスポンスにログインフォームが含まれる', async () => {
  const response = await app.request('/login')
  assert.equal(response.status, 200)
  const html = await response.text()
  assert(html.includes('<app-logo></app-logo>'))
  assert(html.includes('<login-form></login-form>'))
})
