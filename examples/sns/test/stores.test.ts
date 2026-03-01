// @vitest-environment jsdom
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { $posts, $trends, $currentUser, $activeMenu, hydrate } from '../src/stores'
import { mockPosts, mockTrends, mockCurrentUser } from '../src/mockData'
import type { PageState } from '../src/mockData'

test('hydrate() が __PAGE_STATE__ から atom を復元する', () => {
  const pageState: PageState = {
    posts: mockPosts,
    trends: mockTrends,
    currentUser: mockCurrentUser,
  }
  const script = document.createElement('script')
  script.id = '__PAGE_STATE__'
  script.type = 'application/json'
  script.textContent = JSON.stringify(pageState)
  document.body.appendChild(script)

  hydrate()

  assert.deepEqual($posts.get(), mockPosts)
  assert.deepEqual($trends.get(), mockTrends)
  assert.deepEqual($currentUser.get(), mockCurrentUser)

  document.body.removeChild(script)
})

test('__PAGE_STATE__ が存在しない場合何もしない', () => {
  // atom をリセット
  $posts.set([])
  $trends.set([])
  $currentUser.set(null)

  hydrate()

  assert.deepEqual($posts.get(), [])
  assert.deepEqual($trends.get(), [])
  assert.equal($currentUser.get(), null)
})

test('$activeMenu の初期値は home', () => {
  assert.equal($activeMenu.get(), 'home')
})

test('$activeMenu に値を設定できる', () => {
  $activeMenu.set('explore')
  assert.equal($activeMenu.get(), 'explore')

  $activeMenu.set('notifications')
  assert.equal($activeMenu.get(), 'notifications')

  // リセット
  $activeMenu.set('home')
})
