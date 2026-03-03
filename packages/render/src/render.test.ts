import { test } from "vitest"
import assert from "node:assert/strict"
import { renderDocument } from "./render.js"
import type { DocumentNode } from "@layout/document"
import type { ServerComponent } from "./types.js"

function makeDocument(children: DocumentNode["children"]): DocumentNode {
  return { type: "document", children }
}

function makeElement(
  name: string,
  overrides: Partial<{
    decorations: string[]
    attributes: Record<string, any>
    children: DocumentNode["children"]
    selfClosing: boolean
  }> = {},
): DocumentNode["children"][number] {
  return {
    type: "element" as const,
    name,
    decorations: overrides.decorations ?? [],
    attributes: overrides.attributes ?? {},
    children: overrides.children ?? [],
    selfClosing: overrides.selfClosing ?? false,
  }
}

test("空のドキュメントは空文字列を返す", () => {
  const doc = makeDocument([])
  const result = renderDocument(doc, new Set())
  assert.equal(result.html, "")
})

test("レイアウトタグを div に変換する", () => {
  const doc = makeDocument([
    makeElement("VStack"),
  ])
  const result = renderDocument(doc, new Set(["VStack"]))
  assert.equal(result.html, '<div class="VStack"></div>')
})

test("レイアウトタグのデコレーションを CSS クラスに変換する", () => {
  const doc = makeDocument([
    makeElement("VStack", { decorations: ["align-center", "gap-4"] }),
  ])
  const result = renderDocument(doc, new Set(["VStack"]))
  assert.equal(result.html, '<div class="VStack align-center gap-4"></div>')
})

test("ネストしたレイアウトタグをレンダリングする", () => {
  const doc = makeDocument([
    makeElement("HStack", {
      children: [
        makeElement("VStack"),
      ],
    }),
  ])
  const result = renderDocument(doc, new Set(["HStack", "VStack"]))
  assert.equal(result.html, '<div class="HStack"><div class="VStack"></div></div>')
})

test("コンポーネントタグを ServerComponent で解決する", () => {
  const components: Record<string, ServerComponent> = {
    AppLogo: (_props, _children) => "<app-logo></app-logo>",
  }
  const doc = makeDocument([
    makeElement("AppLogo", { selfClosing: true }),
  ])
  const result = renderDocument(doc, new Set(), { components })
  assert.equal(result.html, "<app-logo></app-logo>")
})

test("コンポーネントタグの属性が ServerComponent に渡される", () => {
  const components: Record<string, ServerComponent> = {
    Menu: (props, _children) => `<x-menu kind="${props.kind}"></x-menu>`,
  }
  const doc = makeDocument([
    makeElement("Menu", { attributes: { kind: "home" } }),
  ])
  const result = renderDocument(doc, new Set(), { components })
  assert.equal(result.html, '<x-menu kind="home"></x-menu>')
})

test("コンポーネントタグの子要素が ServerComponent に渡される", () => {
  const components: Record<string, ServerComponent> = {
    Wrapper: (_props, children) => `<div class="wrapper">${children}</div>`,
    Inner: (_props, _children) => "<span>inner</span>",
  }
  const doc = makeDocument([
    makeElement("Wrapper", {
      children: [makeElement("Inner")],
    }),
  ])
  const result = renderDocument(doc, new Set(), { components })
  assert.equal(result.html, '<div class="wrapper"><span>inner</span></div>')
})

test("レイアウトタグとコンポーネントタグの混合をレンダリングする", () => {
  const components: Record<string, ServerComponent> = {
    AppLogo: (_props, _children) => "<app-logo></app-logo>",
    Menu: (props, _children) => `<x-menu kind="${props.kind}"></x-menu>`,
  }
  const doc = makeDocument([
    makeElement("VStack", {
      decorations: ["align-center"],
      children: [
        makeElement("AppLogo", { selfClosing: true }),
        makeElement("Menu", { attributes: { kind: "home" } }),
      ],
    }),
  ])
  const result = renderDocument(doc, new Set(["VStack"]), { components })
  assert.equal(
    result.html,
    '<div class="VStack align-center"><app-logo></app-logo><x-menu kind="home"></x-menu></div>',
  )
})

test("未登録のコンポーネント名でエラーをスローする", () => {
  const doc = makeDocument([
    makeElement("Unknown", { selfClosing: true }),
  ])
  assert.throws(
    () => renderDocument(doc, new Set()),
    { message: 'unknown component name: "Unknown"' },
  )
})
