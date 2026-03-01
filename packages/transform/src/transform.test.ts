import { test, assert } from "vitest"
import type { DocumentNode } from "@layout/document"
import { transform } from "./transform.js"

// ========================================
// 基本
// ========================================

test("ロジックタグなし・プレースホルダーなしの AST はそのまま返す", () => {
  const input: DocumentNode = {
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
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
  })
})

test("空の DocumentNode", () => {
  const input: DocumentNode = { type: "document", children: [] }
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, { type: "document", children: [] })
})

// ========================================
// プレースホルダー解決
// ========================================

test("コンポーネント属性の Placeholder を解決", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Input",
        decorations: [],
        attributes: {
          value: { type: "placeholder", name: "userName" },
        },
        children: [],
        selfClosing: true,
      },
    ],
  }
  const result = transform(input, new Map([["userName", "Alice"]]), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "Input",
        decorations: [],
        attributes: { value: "Alice" },
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("GroupValue 内の Placeholder を解決", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "List",
        decorations: [],
        attributes: {
          items: {
            type: "group",
            values: [
              { type: "placeholder", name: "first" },
              "literal",
              { type: "placeholder", name: "second" },
            ],
          },
        },
        children: [],
        selfClosing: true,
      },
    ],
  }
  const result = transform(
    input,
    new Map([
      ["first", 1],
      ["second", 2],
    ]),
    new Set(),
  )
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "List",
        decorations: [],
        attributes: {
          items: { type: "group", values: [1, "literal", 2] },
        },
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("存在しないプレースホルダーでエラー", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Input",
        decorations: [],
        attributes: {
          value: { type: "placeholder", name: "missing" },
        },
        children: [],
        selfClosing: true,
      },
    ],
  }
  assert.throws(
    () => transform(input, new Map(), new Set()),
    Error,
    /placeholder "missing" is not defined/,
  )
})

// ========================================
// if 評価
// ========================================

test("equal 条件が true → 子を展開", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { equal: { type: "group", values: ["a", "a"] } },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
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
  })
})

test("equal 条件が false → 子を除去", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { equal: { type: "group", values: ["a", "b"] } },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, { type: "document", children: [] })
})

test("notequal 条件が true", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { notequal: { type: "group", values: ["a", "b"] } },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
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
  })
})

test("notequal 条件が false", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { notequal: { type: "group", values: ["a", "a"] } },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, { type: "document", children: [] })
})

test("include 条件が true", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          include: { type: "group", values: ["a", ["a", "b", "c"]] },
        },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
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
  })
})

test("include 条件が false", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          include: { type: "group", values: ["x", ["a", "b", "c"]] },
        },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, { type: "document", children: [] })
})

test("notinclude 条件が true", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          notinclude: { type: "group", values: ["x", ["a", "b", "c"]] },
        },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
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
  })
})

test("notinclude 条件が false", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          notinclude: { type: "group", values: ["a", ["a", "b", "c"]] },
        },
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, { type: "document", children: [] })
})

test("条件引数に Placeholder を使用", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          equal: {
            type: "group",
            values: [{ type: "placeholder", name: "theme" }, "dark"],
          },
        },
        children: [
          {
            type: "element",
            name: "DarkMode",
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
  const resultTrue = transform(input, new Map([["theme", "dark"]]), new Set())
  assert.deepStrictEqual(resultTrue, {
    type: "document",
    children: [
      {
        type: "element",
        name: "DarkMode",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })

  const resultFalse = transform(input, new Map([["theme", "light"]]), new Set())
  assert.deepStrictEqual(resultFalse, { type: "document", children: [] })
})

// ========================================
// if/elif/else チェーン
// ========================================

test("if が true → if ブランチ展開", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { equal: { type: "group", values: ["a", "a"] } },
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
            name: "elif",
            decorations: [],
            attributes: { equal: { type: "group", values: ["x", "x"] } },
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "B",
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
          {
            type: "element",
            name: "C",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "A",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("if false + elif true → elif ブランチ展開", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { equal: { type: "group", values: ["a", "b"] } },
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
            name: "elif",
            decorations: [],
            attributes: { equal: { type: "group", values: ["x", "x"] } },
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "B",
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
          {
            type: "element",
            name: "C",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "B",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("if false + elif false + else → else ブランチ展開", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { equal: { type: "group", values: ["a", "b"] } },
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
            name: "elif",
            decorations: [],
            attributes: { equal: { type: "group", values: ["x", "y"] } },
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "B",
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
          {
            type: "element",
            name: "C",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "C",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("全条件 false + else なし → 空", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { equal: { type: "group", values: ["a", "b"] } },
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
            name: "elif",
            decorations: [],
            attributes: { equal: { type: "group", values: ["x", "y"] } },
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "B",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, { type: "document", children: [] })
})

// ========================================
// ネスト
// ========================================

test("コンポーネント内のロジックタグ", () => {
  const input: DocumentNode = {
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
            attributes: { equal: { type: "group", values: ["a", "a"] } },
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
            name: "Footer",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
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
            name: "Dark",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
          {
            type: "element",
            name: "Footer",
            decorations: [],
            attributes: {},
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  })
})

test("if の中にネストした if", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: { equal: { type: "group", values: ["a", "a"] } },
        children: [
          {
            type: "element",
            name: "if",
            decorations: [],
            attributes: { equal: { type: "group", values: ["x", "y"] } },
            children: [
              {
                type: "element",
                name: "Inner",
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
            name: "Outer",
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
  const result = transform(input, new Map(), new Set())
  // 外側の if は true なので子を展開
  // 内側の if は false なので除去
  // Outer はそのまま残る
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "Outer",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

// ========================================
// 不変性
// ========================================

test("入力の DocumentNode を変更しない", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "Input",
        decorations: [],
        attributes: {
          value: { type: "placeholder", name: "name" },
        },
        children: [],
        selfClosing: true,
      },
    ],
  }
  const inputSnapshot = JSON.stringify(input)
  transform(input, new Map([["name", "Alice"]]), new Set())
  assert.strictEqual(JSON.stringify(input), inputSnapshot)
})

// ========================================
// equal の深い比較
// ========================================

test("equal でオブジェクト同士の深い比較", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          equal: {
            type: "group",
            values: [
              { key: "value" },
              { key: "value" },
            ],
          },
        },
        children: [
          {
            type: "element",
            name: "Match",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "Match",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("equal でキー順序が異なるオブジェクトも一致", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          equal: {
            type: "group",
            values: [
              { a: 1, b: 2 },
              { b: 2, a: 1 },
            ],
          },
        },
        children: [
          {
            type: "element",
            name: "Match",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "Match",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("include でオブジェクトを含む配列の検索", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "if",
        decorations: [],
        attributes: {
          include: {
            type: "group",
            values: [
              { id: 1 },
              [{ id: 1 }, { id: 2 }],
            ],
          },
        },
        children: [
          {
            type: "element",
            name: "Found",
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
  const result = transform(input, new Map(), new Set())
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "Found",
        decorations: [],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

// ========================================
// レイアウトタグ
// ========================================

test("レイアウトタグはデコレーションを保持してそのまま通過する", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "VStack",
        decorations: ["align-center"],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  }
  const result = transform(input, new Map(), new Set(["VStack"]))
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "VStack",
        decorations: ["align-center"],
        attributes: {},
        children: [],
        selfClosing: true,
      },
    ],
  })
})

test("レイアウトタグの子要素を再帰的に変換する", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "VStack",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "if",
            decorations: [],
            attributes: { equal: { type: "group", values: ["a", "a"] } },
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
        selfClosing: false,
      },
    ],
  }
  const result = transform(input, new Map(), new Set(["VStack"]))
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "VStack",
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
  })
})

test("レイアウトタグ内のコンポーネントのプレースホルダーを解決する", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "VStack",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "Input",
            decorations: [],
            attributes: {
              value: { type: "placeholder", name: "userName" },
            },
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  const result = transform(input, new Map([["userName", "Alice"]]), new Set(["VStack"]))
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "VStack",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "Input",
            decorations: [],
            attributes: { value: "Alice" },
            children: [],
            selfClosing: true,
          },
        ],
        selfClosing: false,
      },
    ],
  })
})

test("ネストしたレイアウトタグ", () => {
  const input: DocumentNode = {
    type: "document",
    children: [
      {
        type: "element",
        name: "ZStack",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "VStack",
            decorations: [],
            attributes: {},
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
            selfClosing: false,
          },
        ],
        selfClosing: false,
      },
    ],
  }
  const result = transform(input, new Map(), new Set(["ZStack", "VStack"]))
  assert.deepStrictEqual(result, {
    type: "document",
    children: [
      {
        type: "element",
        name: "ZStack",
        decorations: [],
        attributes: {},
        children: [
          {
            type: "element",
            name: "VStack",
            decorations: [],
            attributes: {},
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
            selfClosing: false,
          },
        ],
        selfClosing: false,
      },
    ],
  })
})
