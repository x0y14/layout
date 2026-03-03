import type { AttributeValue } from "@layout/document"
import { serializeAttributes } from "./serialize-attributes.js"
import type { ServerComponent } from "./types.js"

/**
 * カスタム要素タグ名を指定して ServerComponent を生成するヘルパー
 *
 * pigeonhole では各コンポーネントの ServerComponent を Lit SSR で生成するが、
 * layout ではカスタム要素タグへの単純な変換が基本パターンとなる。
 * このヘルパーはそのパターンを簡潔に表現する。
 *
 * @param customElementTagName - カスタム要素のタグ名 (例: "app-logo", "x-menu")
 * @returns ServerComponent 関数
 */
export function createElementRenderer(customElementTagName: string): ServerComponent {
  return (props: Record<string, AttributeValue>, children: string): string => {
    const attrs = serializeAttributes(props)
    return `<${customElementTagName}${attrs}>${children}</${customElementTagName}>`
  }
}
