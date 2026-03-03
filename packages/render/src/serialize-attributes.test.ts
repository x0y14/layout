import { test } from "vitest"
import assert from "node:assert/strict"
import { serializeAttributes } from "./serialize-attributes.js"

test("空の属性オブジェクトは空文字列を返す", () => {
  assert.equal(serializeAttributes({}), "")
})

test("文字列属性をシリアライズする", () => {
  assert.equal(serializeAttributes({ name: "hello" }), ' name="hello"')
})

test("数値属性をシリアライズする", () => {
  assert.equal(serializeAttributes({ count: 42 }), ' count="42"')
})

test("真偽値 true は属性名のみ出力する", () => {
  assert.equal(serializeAttributes({ disabled: true }), " disabled")
})

test("真偽値 false はスキップする", () => {
  assert.equal(serializeAttributes({ disabled: false }), "")
})

test("複数の属性をシリアライズする", () => {
  const result = serializeAttributes({ kind: "home", active: true })
  assert.equal(result, ' kind="home" active')
})

test("特殊文字を含む属性値はエスケープされる", () => {
  assert.equal(serializeAttributes({ value: '<"&">' }), ' value="&lt;&quot;&amp;&quot;&gt;"')
})
