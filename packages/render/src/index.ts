// Types
export type {
  ServerComponent,
  RenderOptions,
  RenderResult,
} from "./types.js"

// Re-exports from @layout/document
export type {
  DocumentNode,
  ElementNode,
  AttributeValue,
} from "@layout/document"

// HTML rendering
export { renderDocument } from "./render.js"

// HTML utilities
export { escapeHtml, escapeAttribute } from "./escape.js"
export { serializeAttributes } from "./serialize-attributes.js"

// Component helpers
export { createElementRenderer } from "./create-element-renderer.js"
