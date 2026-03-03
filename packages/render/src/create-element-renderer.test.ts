import { test } from "vitest"
import assert from "node:assert/strict"
import { createElementRenderer } from "./create-element-renderer.js"

test("カスタム要素タグを生成する", () => {
  const render = createElementRenderer("app-logo")
  const html = render({}, "")
  assert.equal(html, "<app-logo></app-logo>")
})

test("属性を含むカスタム要素タグを生成する", () => {
  const render = createElementRenderer("x-menu")
  const html = render({ kind: "home" }, "")
  assert.equal(html, '<x-menu kind="home"></x-menu>')
})

test("子要素を含むカスタム要素タグを生成する", () => {
  const render = createElementRenderer("x-wrapper")
  const html = render({}, "<span>child</span>")
  assert.equal(html, "<x-wrapper><span>child</span></x-wrapper>")
})

test("属性値の特殊文字がエスケープされる", () => {
  const render = createElementRenderer("x-comp")
  const html = render({ value: '<"&">' }, "")
  assert.equal(html, '<x-comp value="&lt;&quot;&amp;&quot;&gt;"></x-comp>')
})
