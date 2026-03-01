import type {
  DocumentNode,
  ElementNode,
  AttributeValue,
  Placeholder,
  GroupValue,
  JsonValue,
} from "@layout/document"

/**
 * Normalize and stringify a JSON value for deep comparison.
 * Object keys are sorted recursively to ensure key-order independence.
 * @param value - JSON value to normalize
 * @returns Normalized JSON string
 */
function normalizeJson(value: JsonValue): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return "[" + value.map(normalizeJson).join(",") + "]"
  }
  const sortedKeys = Object.keys(value).sort()
  return (
    "{" +
    sortedKeys
      .map((key) => JSON.stringify(key) + ":" + normalizeJson((value as Record<string, JsonValue>)[key]))
      .join(",") +
    "}"
  )
}

/**
 * Deep equality comparison for JSON values.
 * Normalizes object key order before comparing.
 * @param a - First JSON value
 * @param b - Second JSON value
 * @returns True if the values are deeply equal
 */
function jsonDeepEqual(a: JsonValue, b: JsonValue): boolean {
  return normalizeJson(a) === normalizeJson(b)
}

/**
 * Evaluate a condition function with resolved arguments.
 * @param name - Condition function name (equal, notequal, include, notinclude)
 * @param args - Resolved argument pair
 * @returns Boolean result of the condition
 */
function evaluateCondition(name: string, args: [JsonValue, JsonValue]): boolean {
  switch (name) {
    case "equal":
      return jsonDeepEqual(args[0], args[1])
    case "notequal":
      return !jsonDeepEqual(args[0], args[1])
    case "include": {
      const haystack = args[1] as JsonValue[]
      return haystack.some((element) => jsonDeepEqual(args[0], element))
    }
    case "notinclude": {
      const haystack = args[1] as JsonValue[]
      return !haystack.some((element) => jsonDeepEqual(args[0], element))
    }
    default:
      throw new Error(`unknown condition function "${name}"`)
  }
}

/**
 * Resolve a placeholder or pass through a JSON value.
 * @param value - Placeholder or JSON value
 * @param placeholders - Map of placeholder names to values
 * @returns Resolved JSON value
 */
function resolvePlaceholder(
  value: Placeholder | JsonValue,
  placeholders: Map<string, JsonValue>,
): JsonValue {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "type" in value &&
    (value as Placeholder).type === "placeholder"
  ) {
    const placeholder = value as Placeholder
    if (!placeholders.has(placeholder.name)) {
      throw new Error(`placeholder "${placeholder.name}" is not defined`)
    }
    return placeholders.get(placeholder.name)!
  }
  return value as JsonValue
}

/**
 * Resolve placeholders within an attribute value.
 * @param value - Attribute value (Placeholder, GroupValue, or JsonValue)
 * @param placeholders - Map of placeholder names to values
 * @returns Resolved attribute value
 */
function resolveAttributeValue(
  value: AttributeValue,
  placeholders: Map<string, JsonValue>,
): AttributeValue {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "type" in value
  ) {
    const typed = value as Placeholder | GroupValue
    if (typed.type === "placeholder") {
      return resolvePlaceholder(typed, placeholders)
    }
    if (typed.type === "group") {
      return {
        type: "group",
        values: typed.values.map((v) => resolvePlaceholder(v, placeholders)),
      }
    }
  }
  return value
}

/**
 * Extract the condition from an if/elif node and evaluate it.
 * @param node - Element node with a condition attribute
 * @param placeholders - Map of placeholder names to values
 * @returns Boolean result of the condition evaluation
 */
function evaluateNodeCondition(
  node: ElementNode,
  placeholders: Map<string, JsonValue>,
): boolean {
  const conditionName = Object.keys(node.attributes)[0]
  const conditionValue = node.attributes[conditionName] as GroupValue
  const resolvedArgs = conditionValue.values.map((v) =>
    resolvePlaceholder(v, placeholders),
  ) as [JsonValue, JsonValue]
  return evaluateCondition(conditionName, resolvedArgs)
}

interface Branch {
  condition: ElementNode | null // null は else ブランチ
  children: ElementNode[]
}

/**
 * Split an if node's children into branches by elif/else separators,
 * evaluate conditions, and return the first matching branch's children.
 * @param ifNode - The if element node
 * @param placeholders - Map of placeholder names to values
 * @returns Children of the first matching branch
 */
function splitAndSelectBranch(
  ifNode: ElementNode,
  placeholders: Map<string, JsonValue>,
): ElementNode[] {
  const branches: Branch[] = []
  let currentChildren: ElementNode[] = []

  // 最初のブランチは if 自体の条件
  branches.push({ condition: ifNode, children: currentChildren })

  for (const child of ifNode.children) {
    if (child.name === "elif" || child.name === "else") {
      // 新しいブランチを開始
      currentChildren = []
      branches.push({
        condition: child.name === "else" ? null : child,
        children: currentChildren,
      })
    } else {
      currentChildren.push(child)
    }
  }

  // 条件を評価して最初に true になるブランチを返す
  for (const branch of branches) {
    if (branch.condition === null) {
      // else ブランチ: 無条件で採用
      return branch.children
    }
    if (evaluateNodeCondition(branch.condition, placeholders)) {
      return branch.children
    }
  }

  return []
}

/**
 * Recursively transform children, evaluating logic tags and resolving placeholders.
 * @param children - Array of element nodes to transform
 * @param placeholders - Map of placeholder names to values
 * @param layoutTagNames - Set of tag names that are layout tags
 * @returns Transformed array of element nodes
 */
function transformChildren(
  children: ElementNode[],
  placeholders: Map<string, JsonValue>,
  layoutTagNames: Set<string>,
): ElementNode[] {
  const result: ElementNode[] = []

  for (const child of children) {
    if (child.name === "if") {
      // ブランチを分割して選択し、選択されたブランチの子を再帰的に変換
      const selectedChildren = splitAndSelectBranch(child, placeholders)
      result.push(...transformChildren(selectedChildren, placeholders, layoutTagNames))
    } else if (layoutTagNames.has(child.name)) {
      // レイアウトタグ: 属性解決なし、デコレーションと子を保持
      result.push({
        type: "element",
        name: child.name,
        decorations: [...child.decorations],
        attributes: {},
        children: transformChildren(child.children, placeholders, layoutTagNames),
        selfClosing: child.selfClosing,
      })
    } else {
      // コンポーネントタグ: 属性を解決し、子を再帰的に変換
      const resolvedAttributes: Record<string, AttributeValue> = {}
      for (const [key, value] of Object.entries(child.attributes)) {
        resolvedAttributes[key] = resolveAttributeValue(value, placeholders)
      }

      result.push({
        type: "element",
        name: child.name,
        decorations: [...child.decorations],
        attributes: resolvedAttributes,
        children: transformChildren(child.children, placeholders, layoutTagNames),
        selfClosing: child.selfClosing,
      })
    }
  }

  return result
}

/**
 * Transform a DocumentNode by evaluating logic tags and resolving placeholders.
 * Logic tags (if/elif/else) are evaluated based on their conditions and the
 * matching branch's children replace the logic tag. Layout tags pass through
 * without attribute resolution. Placeholders in component attributes are
 * resolved from the provided map.
 * @param document - The input DocumentNode AST
 * @param placeholders - Map of placeholder names to JSON values
 * @param layoutTagNames - Set of tag names that are layout tags
 * @returns A new DocumentNode with logic tags evaluated and placeholders resolved
 */
export function transform(
  document: DocumentNode,
  placeholders: Map<string, JsonValue>,
  layoutTagNames: Set<string>,
): DocumentNode {
  return {
    type: "document",
    children: transformChildren(document.children, placeholders, layoutTagNames),
  }
}
