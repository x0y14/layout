import { onlytag } from "onlytag"
import type { Token, DocumentNode, ElementNode, GroupValue } from "onlytag"

/** Condition function names allowed on if/elif logic tags */
export const CONDITION_FUNCTIONS = new Set([
  "equal",
  "notequal",
  "include",
  "notinclude",
] as const)

/** Number of arguments required by condition functions */
export const CONDITION_ARITY = 2

/** Condition functions that require an array as the second argument */
export const CONDITION_FUNCTIONS_REQUIRING_ARRAY = new Set([
  "include",
  "notinclude",
] as const)

/**
 * Logic tag definition.
 * Describes the closure form and condition requirement for each logic tag.
 */
interface LogicTagDefinition {
  closure: "open-close" | "self-closing"
  condition: "required" | "none"
}

/** Logic tag definitions indexed by tag name */
export const LOGIC_TAGS: Record<string, LogicTagDefinition> = {
  if: { closure: "open-close", condition: "required" },
  elif: { closure: "self-closing", condition: "required" },
  else: { closure: "self-closing", condition: "none" },
}

/** Set of valid logic tag names */
export const LOGIC_TAG_NAMES = new Set(Object.keys(LOGIC_TAGS))

const COMPONENT_PAIR_INDEX = 0
const LOGIC_PAIR_INDEX = 1

const parser = new onlytag({
  allowAttributes: true,
  allowDecorations: true,
  allowGroup: true,
  allowPlaceholders: true,
  allowMixedDelimiters: false,
  allowInconsistentClosures: false,
  tags: [
    { opening: "<", closing: ">" },
    { opening: "|", closing: "|" },
  ],
})

/**
 * Validate that tag names use the correct delimiter pair.
 * Logic tags (if, elif, else) must use "||", and
 * component tags must use "<>".
 * @param tokens - Token array from onlytag tokenize
 * @throws {Error} If a tag name uses the wrong delimiter pair
 */
function validateTokenDelimiters(tokens: Token[]): void {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    // LT と LT_SLASH の直後の IDENT がタグ名
    if (token.kind !== "LT" && token.kind !== "LT_SLASH") {
      continue
    }

    const pairIndex = token.pairIndex
    const nextToken = tokens[i + 1]
    if (nextToken === undefined || nextToken.kind !== "IDENT") {
      continue
    }

    const tagName = nextToken.value
    const isLogicTag = LOGIC_TAG_NAMES.has(tagName)

    if (isLogicTag && pairIndex === COMPONENT_PAIR_INDEX) {
      // ロジックタグ名をコンポーネントデリミタ(<>)で使用している
      throw new Error(
        `logic tag "${tagName}" must use "||" delimiters, but found "<>" at position ${token.position}`,
      )
    }

    if (!isLogicTag && pairIndex === LOGIC_PAIR_INDEX) {
      // 未知のタグ名をロジックデリミタ(||)で使用している
      throw new Error(
        `tag "${tagName}" is not a valid logic tag for "||" delimiters, expected one of: ${[...LOGIC_TAG_NAMES].join(", ")}`,
      )
    }
  }
}

/**
 * Recursively validate logic tag constraints on the AST.
 * Logic tags must not have decorations, must use the correct closure form,
 * must satisfy condition requirements, and elif/else must be direct children of if.
 * @param node - Element node to validate
 * @param parentName - Name of the parent element, or null if at document root
 * @throws {Error} If a logic tag violates constraints
 */
function validateLogicTagConstraints(node: ElementNode, parentName: string | null): void {
  if (LOGIC_TAG_NAMES.has(node.name)) {
    const definition = LOGIC_TAGS[node.name]

    // デコレーション禁止
    if (node.decorations.length > 0) {
      throw new Error(
        `logic tag "${node.name}" must not have decorations, but found: ${node.decorations.join(", ")}`,
      )
    }

    // closure 制約
    const actualClosure = node.selfClosing ? "self-closing" : "open-close"
    if (actualClosure !== definition.closure) {
      throw new Error(
        `logic tag "${node.name}" must use ${definition.closure} form, but found ${actualClosure}`,
      )
    }

    // 親ノード制約: elif/else は if の直接の子でなければならない
    if (node.name === "elif" || node.name === "else") {
      if (parentName !== "if") {
        throw new Error(
          `logic tag "${node.name}" must be a direct child of parent "if", but found parent "${parentName ?? "document"}"`,
        )
      }
    }

    // 条件属性バリデーション
    const attributeKeys = Object.keys(node.attributes)
    if (definition.condition === "required") {
      // 条件が必ず 1 つ必要
      if (attributeKeys.length !== 1) {
        throw new Error(
          `logic tag "${node.name}" requires exactly one condition, expected 1 but got ${attributeKeys.length}`,
        )
      }

      const conditionName = attributeKeys[0]

      // 条件名が有効か
      if (!CONDITION_FUNCTIONS.has(conditionName as any)) {
        throw new Error(
          `logic tag "${node.name}" has invalid condition name "${conditionName}", expected one of: ${[...CONDITION_FUNCTIONS].join(", ")}`,
        )
      }

      const conditionValue = node.attributes[conditionName]

      // 値がグループ形式か
      if (typeof conditionValue !== "object" || conditionValue === null || !("type" in conditionValue) || conditionValue.type !== "group") {
        throw new Error(
          `logic tag "${node.name}" condition "${conditionName}" must be a group value, but found a non-group value`,
        )
      }

      // ガードで形状を検証済みなので GroupValue として扱う
      const groupValue = conditionValue as GroupValue

      // グループの要素数が CONDITION_ARITY と一致するか
      if (groupValue.values.length !== CONDITION_ARITY) {
        throw new Error(
          `logic tag "${node.name}" condition "${conditionName}" requires ${CONDITION_ARITY} arguments, but got ${groupValue.values.length}`,
        )
      }

      // 第二引数が配列であることを要求する条件関数のバリデーション
      if (CONDITION_FUNCTIONS_REQUIRING_ARRAY.has(conditionName as any)) {
        const secondArgument = groupValue.values[1]
        if (!Array.isArray(secondArgument)) {
          throw new Error(
            `logic tag "${node.name}" condition "${conditionName}" requires an array as the second argument, but got ${typeof secondArgument}`,
          )
        }
      }
    } else {
      // condition: "none" のタグ: 属性があればエラー
      if (attributeKeys.length > 0) {
        throw new Error(
          `logic tag "${node.name}" must not have attributes, but found: ${attributeKeys.join(", ")}`,
        )
      }
    }
  }

  for (const child of node.children) {
    validateLogicTagConstraints(child, node.name)
  }
}

/**
 * Parse a document string into a DocumentNode AST with validation.
 * Uses onlytag for parsing with fixed configuration, then applies
 * domain-specific validation rules for logic tags vs component tags.
 * @param input - The document markup string to parse
 * @returns The parsed and validated DocumentNode AST
 * @throws {Error} If the input violates delimiter or logic tag constraints
 */
export function parse(input: string): DocumentNode {
  const tokens = parser.tokenize(input)

  // トークン段階でデリミタとタグ名の対応を検証
  validateTokenDelimiters(tokens)

  const document = parser.parse(tokens)

  // AST 段階でロジックタグの制約を検証
  for (const child of document.children) {
    validateLogicTagConstraints(child, null)
  }

  return document
}
