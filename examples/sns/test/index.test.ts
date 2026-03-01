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
  assert(html.includes('<content-area></content-area>'))
  assert(html.includes('<x-trend></x-trend>'))
})

test('/ のレスポンスに __PAGE_STATE__ が含まれる', async () => {
  const response = await app.request('/')
  assert.equal(response.status, 200)
  const html = await response.text()
  assert(html.includes('<script id="__PAGE_STATE__" type="application/json">'))
  const match = html.match(/<script id="__PAGE_STATE__" type="application\/json">([\s\S]*?)<\/script>/)
  assert(match !== null)
  const pageState = JSON.parse(match![1])
  assert(Array.isArray(pageState.posts))
  assert(pageState.posts.length > 0)
  assert(Array.isArray(pageState.trends))
  assert(pageState.trends.length > 0)
  assert.equal(typeof pageState.currentUser.userName, 'string')
})

test('/login のレスポンスにログインフォームが含まれる', async () => {
  const response = await app.request('/login')
  assert.equal(response.status, 200)
  const html = await response.text()
  assert(html.includes('<app-logo></app-logo>'))
  assert(html.includes('<login-form></login-form>'))
})

test('/login のレスポンスに __PAGE_STATE__ が含まれない', async () => {
  const response = await app.request('/login')
  assert.equal(response.status, 200)
  const html = await response.text()
  assert(!html.includes('__PAGE_STATE__'))
})
