import { onlytag } from "onlytag"
import type { Token, DocumentNode, ElementNode } from "onlytag"

const LOGIC_TAG_NAMES = new Set(["if", "elseif", "else"])

// ロジックタグの closure 制約: if は open-close のみ、elseif/else は self-closing のみ
const LOGIC_TAG_CLOSURE: Record<string, "open-close" | "self-closing"> = {
  if: "open-close",
  elseif: "self-closing",
  else: "self-closing",
}

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
 * Logic tags (if, elseif, else) must use "||", and
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
 * Logic tags must not have decorations or attributes,
 * and must use the correct closure form.
 * @param node - Element node to validate
 * @throws {Error} If a logic tag violates constraints
 */
function validateLogicTagConstraints(node: ElementNode): void {
  if (LOGIC_TAG_NAMES.has(node.name)) {
    if (node.decorations.length > 0) {
      throw new Error(
        `logic tag "${node.name}" must not have decorations, but found: ${node.decorations.join(", ")}`,
      )
    }

    if (Object.keys(node.attributes).length > 0) {
      throw new Error(
        `logic tag "${node.name}" must not have attributes, but found: ${Object.keys(node.attributes).join(", ")}`,
      )
    }

    const expectedClosure = LOGIC_TAG_CLOSURE[node.name]
    const actualClosure = node.selfClosing ? "self-closing" : "open-close"
    if (actualClosure !== expectedClosure) {
      throw new Error(
        `logic tag "${node.name}" must use ${expectedClosure} form, but found ${actualClosure}`,
      )
    }
  }

  for (const child of node.children) {
    validateLogicTagConstraints(child)
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
    validateLogicTagConstraints(child)
  }

  return document
}
