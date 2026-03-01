import { test } from 'vitest'
import assert from 'node:assert/strict'
import type { DocumentNode } from '@layout/document'
import { renderDocument } from '../src/layout/render.js'

test('レイアウトタグが div class="TagName" に変換される', () => {
  const document: DocumentNode = {
    type: 'document',
    children: [
      {
        type: 'element',
        name: 'VStack',
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: false,
      },
    ],
  }
  const layoutTagNames = new Set(['VStack'])
  const html = renderDocument(document, layoutTagNames)
  assert.equal(html, '<div class="VStack"></div>')
})

test('レイアウトタグのデコレーションが class に含まれる', () => {
  const document: DocumentNode = {
    type: 'document',
    children: [
      {
        type: 'element',
        name: 'VStack',
        decorations: ['align-center'],
        attributes: {},
        children: [],
        selfClosing: false,
      },
    ],
  }
  const layoutTagNames = new Set(['VStack'])
  const html = renderDocument(document, layoutTagNames)
  assert.equal(html, '<div class="VStack align-center"></div>')
})

test('コンポーネントタグがカスタム要素に変換される', () => {
  const document: DocumentNode = {
    type: 'document',
    children: [
      {
        type: 'element',
        name: 'AppLogo',
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  }
  const layoutTagNames = new Set<string>()
  const html = renderDocument(document, layoutTagNames)
  assert.equal(html, '<app-logo></app-logo>')
})

test('属性付きコンポーネントが変換される', () => {
  const document: DocumentNode = {
    type: 'document',
    children: [
      {
        type: 'element',
        name: 'Menu',
        decorations: [],
        attributes: { kind: 'home' },
        children: [],
        selfClosing: true,
      },
    ],
  }
  const layoutTagNames = new Set<string>()
  const html = renderDocument(document, layoutTagNames)
  assert.equal(html, '<x-menu kind="home"></x-menu>')
})

test('未知のコンポーネント名でエラーになる', () => {
  const document: DocumentNode = {
    type: 'document',
    children: [
      {
        type: 'element',
        name: 'Unknown',
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  }
  const layoutTagNames = new Set<string>()
  assert.throws(() => renderDocument(document, layoutTagNames), {
    message: 'unknown component name: "Unknown"',
  })
})

test('ネストしたレイアウトタグとコンポーネントが変換される', () => {
  const document: DocumentNode = {
    type: 'document',
    children: [
      {
        type: 'element',
        name: 'VStack',
        decorations: ['align-center'],
        attributes: {},
        children: [
          {
            type: 'element',
            name: 'AppLogo',
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
          {
            type: 'element',
            name: 'Menu',
            decorations: [],
            attributes: { kind: 'home' },
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  const layoutTagNames = new Set(['VStack'])
  const html = renderDocument(document, layoutTagNames)
  assert.equal(
    html,
    '<div class="VStack align-center"><app-logo></app-logo><x-menu kind="home"></x-menu></div>'
  )
})

test('self-closing レイアウトタグが変換される', () => {
  const document: DocumentNode = {
    type: 'document',
    children: [
      {
        type: 'element',
        name: 'Spacer',
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  }
  const layoutTagNames = new Set(['Spacer'])
  const html = renderDocument(document, layoutTagNames)
  assert.equal(html, '<div class="Spacer"></div>')
})
