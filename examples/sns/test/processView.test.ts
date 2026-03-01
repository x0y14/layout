import { test } from 'vitest'
import assert from 'node:assert/strict'
import { processView } from '../src/layout/processView.js'

test('LeftSideMenuView 相当の入力が正しくレンダリングされる', () => {
  const source = `%VStack.align-center%
<AppLogo />
<Menu kind="home" />
%/VStack%
`
  const html = processView(source)
  assert(html.includes('<div class="VStack align-center">'))
  assert(html.includes('<app-logo></app-logo>'))
  assert(html.includes('<x-menu kind="home"></x-menu>'))
  assert(html.includes('</div>'))
})

test('ContentView 相当の入力が正しくレンダリングされる', () => {
  const source = `%ZStack%
%VStack.align-center%
%Popup /%
%/VStack%
%VStack.align-center%
<ContentArea />
%/VStack%
%/ZStack%
`
  const html = processView(source)
  assert(html.includes('<div class="ZStack">'))
  assert(html.includes('<div class="VStack align-center">'))
  assert(html.includes('<div class="Popup"></div>'))
  assert(html.includes('<content-area></content-area>'))
})

test('LoginView 相当の入力が正しくレンダリングされる', () => {
  const source = `%VStack.align-center%
<AppLogo />
<LoginForm />
%/VStack%
`
  const html = processView(source)
  assert(html.includes('<div class="VStack align-center">'))
  assert(html.includes('<app-logo></app-logo>'))
  assert(html.includes('<login-form></login-form>'))
})
