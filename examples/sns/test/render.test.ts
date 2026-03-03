import { test } from 'vitest'
import assert from 'node:assert/strict'
import type { DocumentNode } from '@layout/document'
import { renderDocument } from '@layout/render'
import { components } from '../src/layout/render.js'

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
  const result = renderDocument(document, layoutTagNames, { components })
  assert.equal(result.html, '<div class="VStack"></div>')
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
  const result = renderDocument(document, layoutTagNames, { components })
  assert.equal(result.html, '<div class="VStack align-center"></div>')
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
  const result = renderDocument(document, layoutTagNames, { components })
  assert.equal(result.html, '<app-logo></app-logo>')
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
  const result = renderDocument(document, layoutTagNames, { components })
  assert.equal(result.html, '<x-menu kind="home"></x-menu>')
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
  assert.throws(() => renderDocument(document, layoutTagNames, { components }), {
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
  const result = renderDocument(document, layoutTagNames, { components })
  assert.equal(
    result.html,
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
  const result = renderDocument(document, layoutTagNames, { components })
  assert.equal(result.html, '<div class="Spacer"></div>')
})
