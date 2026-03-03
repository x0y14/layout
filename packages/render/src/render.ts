import type { DocumentNode, ElementNode } from "@layout/document"
import type { RenderOptions, RenderResult } from "./types.js"

/**
 * ElementNode をレンダリングする
 *
 * - レイアウトタグ → <div class="TagName decoration1 ...">children</div>
 * - コンポーネントタグ → ServerComponent 関数で解決
 */
function renderElement(
  element: ElementNode,
  layoutTagNames: Set<string>,
  options: RenderOptions,
): string {
  // レイアウトタグの場合
  if (layoutTagNames.has(element.name)) {
    const classes = [element.name, ...element.decorations].join(" ")
    const childrenHtml = element.children
      .map((child) => renderElement(child, layoutTagNames, options))
      .join("")
    return `<div class="${classes}">${childrenHtml}</div>`
  }

  // コンポーネントタグの場合: ServerComponent で解決
  const component = options.components?.[element.name]
  if (component === undefined) {
    throw new Error(`unknown component name: "${element.name}"`)
  }

  const childrenHtml = element.children
    .map((child) => renderElement(child, layoutTagNames, options))
    .join("")

  return component(element.attributes, childrenHtml)
}

/**
 * DocumentNode を HTML にレンダリングする
 *
 * pigeonhole の renderToHtml に相当する。
 * レイアウトタグは <div class="..."> に、
 * コンポーネントタグは ServerComponent 関数で解決する。
 *
 * @param document - レンダリング対象の DocumentNode AST
 * @param layoutTagNames - レイアウトタグ名のセット
 * @param options - レンダリングオプション
 * @returns レンダリング結果
 */
export function renderDocument(
  document: DocumentNode,
  layoutTagNames: Set<string>,
  options: RenderOptions = {},
): RenderResult {
  const html = document.children
    .map((child) => renderElement(child, layoutTagNames, options))
    .join("")
  return { html }
}
