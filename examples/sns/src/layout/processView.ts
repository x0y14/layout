import type { JsonValue } from '@layout/document'
import { parse } from '@layout/document'
import { transform } from '@layout/transform'
import { renderDocument } from '@layout/render'
import { components } from './render.js'

/**
 * Processes a view source string through the parse → transform → render pipeline.
 *
 * pigeonhole の ServerComponent パターンに基づき、
 * コンポーネントの解決をアプリケーション側で定義された components マップに委譲する。
 *
 * @param source - The raw layout source string
 * @param placeholders - Optional map of placeholder values for template resolution
 * @returns The rendered HTML string
 */
export function processView(source: string, placeholders?: Map<string, JsonValue>): string {
  const { document, layoutTagNames } = parse(source)
  const transformed = transform(document, placeholders ?? new Map(), layoutTagNames)
  const result = renderDocument(transformed, layoutTagNames, { components })
  return result.html
}
