import { test, assert } from "vitest"
import type { DocumentNode } from "onlytag"
import { parse } from "./parse.js"

// ========================================
// 正常系
// ========================================

test("単一コンポーネントタグ (self-closing)", () => {
  const result = parse("<Button />")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Button",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("単一コンポーネントタグ (open-close)", () => {
  const result = parse("<Container></Container>")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Container",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: false,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("デコレーション+属性付きコンポーネント", () => {
  const result = parse('<Button.primary text="Click" />')
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Button",
        decorations: ["primary"],
        attributes: { text: "Click" },
        children: [],
        selfClosing: true,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("ネストしたコンポーネント", () => {
  const result = parse("<Layout><Header /><Body><Content /></Body></Layout>")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Layout",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "Header",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "Body",
            decorations: [],
            attributes: {},
            children: [
              {
                type: "element",
                name: "Content",
                decorations: [],
                attributes: {},
                children: [],
                selfClosing: true,
              },
            ],
            selfClosing: false,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("ロジックタグ if (open-close)", () => {
  const result = parse("|if|<Foo />|/if|")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "Foo",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("ロジックタグ elseif (self-closing)", () => {
  const result = parse("|if|<A />|elseif /||/if|")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "A",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "elseif",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("ロジックタグ else (self-closing)", () => {
  const result = parse("|if|<A />|else /||/if|")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "A",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "else",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("コンポーネント+ロジック混在", () => {
  const result = parse("<Layout>|if|<Dark />|/if||else /|<Light /></Layout>")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Layout",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "if",
            decorations: [],
            attributes: {},
            children: [
              {
                type: "element",
                name: "Dark",
                decorations: [],
                attributes: {},
                children: [],
                selfClosing: true,
              },
            ],
            selfClosing: false,
          },
          {
            type: "element",
            name: "else",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "Light",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

test("空文字列", () => {
  const result = parse("")
  const expected: DocumentNode = {
    type: "document",
    children: [],
  }
  assert.deepStrictEqual(result, expected)
})

test("placeholder/group 付きコンポーネント", () => {
  const result = parse("<Input value=$name items=(1, 2, 3) />")
  const expected: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Input",
        decorations: [],
        attributes: {
          value: { type: "placeholder", name: "name" },
          items: { type: "group", values: [1, 2, 3] },
        },
        children: [],
        selfClosing: true,
      },
    ],
  }
  assert.deepStrictEqual(result, expected)
})

// ========================================
// エラー系
// ========================================

test("ロジックタグ名をコンポーネントデリミタで使用", () => {
  assert.throws(
    () => parse("<if></if>"),
    Error,
    /logic tag "if".*"\|\|".*"<>"/, // expected/actual のデリミタ情報を含む
  )
})

test("未知のタグ名をロジックデリミタで使用", () => {
  assert.throws(
    () => parse("|Custom /|"),
    Error,
    /tag "Custom".*"\|\|"/, // 不正なタグ名とデリミタ情報を含む
  )
})

test("ロジックタグにデコレーション", () => {
  assert.throws(
    () => parse("|if.active|<Foo />|/if|"),
    Error,
    /logic tag "if".*decoration/, // タグ名とデコレーション違反を含む
  )
})

test("ロジックタグに属性", () => {
  assert.throws(
    () => parse("|if cond=true|<Foo />|/if|"),
    Error,
    /logic tag "if".*attribute/, // タグ名と属性違反を含む
  )
})

test("if を self-closing で使用", () => {
  assert.throws(
    () => parse("|if /|"),
    Error,
    /logic tag "if".*open-close.*self-closing/, // 期待形式と実際の形式を含む
  )
})

test("elseif を open-close で使用", () => {
  assert.throws(
    () => parse("|elseif||/elseif|"),
    Error,
    /logic tag "elseif".*self-closing.*open-close/, // 期待形式と実際の形式を含む
  )
})

test("else を open-close で使用", () => {
  assert.throws(
    () => parse("|else||/else|"),
    Error,
    /logic tag "else".*self-closing.*open-close/, // 期待形式と実際の形式を含む
  )
})

test("深いネストでのロジックタグ制約違反", () => {
  assert.throws(
    () => parse("<Layout><Container>|if.broken|<Foo />|/if|</Container></Layout>"),
    Error,
    /logic tag "if".*decoration/, // 深いネストでもデコレーション違反を検出
  )
})
