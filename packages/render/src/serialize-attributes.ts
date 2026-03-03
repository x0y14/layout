import type { AttributeValue } from "@layout/document"
import { escapeAttribute } from "./escape.js"

/**
 * AttributeValue を文字列に変換する
 */
function attributeValueToString(value: AttributeValue): string {
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return String(value)
}

/**
 * 属性をシリアライズする
 *
 * - null/undefined/false → スキップ
 * - true → 属性名のみ
 * - string → エスケープして出力
 * - number → 文字列化してエスケープして出力
 * - その他 → 文字列化してエスケープして出力
 */
export function serializeAttributes(attributes: Record<string, AttributeValue>): string {
  const parts: string[] = []

  for (const [key, value] of Object.entries(attributes)) {
    if (value === null || value === undefined) {
      continue
    }

    if (value === false) {
      continue
    }

    if (value === true) {
      parts.push(key)
      continue
    }

    const stringValue = attributeValueToString(value)
    parts.push(`${key}="${escapeAttribute(stringValue)}"`)
  }

  if (parts.length === 0) {
    return ""
  }

  return ` ${parts.join(" ")}`
}
