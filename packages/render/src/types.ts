import type { AttributeValue } from "@layout/document"

/**
 * サーバーコンポーネント関数の型
 *
 * コンポーネントタグの属性と子要素の HTML を受け取り、HTML 文字列を返す。
 * pigeonhole の ServerComponent パターンに基づく。
 */
export type ServerComponent = (
  props: Record<string, AttributeValue>,
  children: string,
) => string

/**
 * レンダリングオプション
 */
export interface RenderOptions {
  /** コンポーネント名から ServerComponent へのマップ */
  components?: Record<string, ServerComponent>
}

/**
 * レンダリング結果
 */
export interface RenderResult {
  html: string
}
