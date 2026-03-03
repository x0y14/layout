import { test } from "vitest"
import assert from "node:assert/strict"
import { escapeHtml, escapeAttribute } from "./escape.js"

test("escapeHtml: & をエスケープする", () => {
  assert.equal(escapeHtml("a & b"), "a &amp; b")
})

test("escapeHtml: < をエスケープする", () => {
  assert.equal(escapeHtml("a < b"), "a &lt; b")
})

test("escapeHtml: > をエスケープする", () => {
  assert.equal(escapeHtml("a > b"), "a &gt; b")
})

test("escapeHtml: 複数の文字を同時にエスケープする", () => {
  assert.equal(escapeHtml('<a href="&">'), "&lt;a href=&quot;&amp;&quot;&gt;".replace(/&quot;/g, '"'))
  assert.equal(escapeHtml("<script>alert('xss')</script>"), "&lt;script&gt;alert('xss')&lt;/script&gt;")
})

test("escapeHtml: エスケープ不要な文字列はそのまま返す", () => {
  assert.equal(escapeHtml("hello world"), "hello world")
})

test("escapeAttribute: & をエスケープする", () => {
  assert.equal(escapeAttribute("a & b"), "a &amp; b")
})

test("escapeAttribute: < をエスケープする", () => {
  assert.equal(escapeAttribute("a < b"), "a &lt; b")
})

test("escapeAttribute: > をエスケープする", () => {
  assert.equal(escapeAttribute("a > b"), "a &gt; b")
})

test('escapeAttribute: " をエスケープする', () => {
  assert.equal(escapeAttribute('a "b" c'), "a &quot;b&quot; c")
})

test("escapeAttribute: 複数の文字を同時にエスケープする", () => {
  assert.equal(escapeAttribute('<"&">'), "&lt;&quot;&amp;&quot;&gt;")
})

test("escapeAttribute: エスケープ不要な文字列はそのまま返す", () => {
  assert.equal(escapeAttribute("hello world"), "hello world")
})
