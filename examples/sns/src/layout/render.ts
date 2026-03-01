import type { DocumentNode, ElementNode, AttributeValue } from '@layout/document'

const COMPONENT_NAME_MAP: Record<string, string> = {
  AppLogo: 'app-logo',
  Menu: 'x-menu',
  PostingArea: 'posting-area',
  TimeLine: 'time-line',
  Trend: 'x-trend',
  LoginForm: 'login-form',
}

/**
 * Converts an AttributeValue to its HTML string representation.
 * @param value - The attribute value to convert
 * @returns The string representation of the attribute value
 */
function attributeValueToString(value: AttributeValue): string {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return String(value)
}

/**
 * Renders an ElementNode to an HTML string.
 * @param element - The element node to render
 * @param layoutTagNames - Set of tag names that are layout tags
 * @returns The rendered HTML string
 */
function renderElement(element: ElementNode, layoutTagNames: Set<string>): string {
  // レイアウトタグの場合
  if (layoutTagNames.has(element.name)) {
    const classes = [element.name, ...element.decorations].join(' ')
    const childrenHtml = element.children
      .map((child) => renderElement(child, layoutTagNames))
      .join('')
    return `<div class="${classes}">${childrenHtml}</div>`
  }

  // コンポーネントタグの場合
  const customElementName = COMPONENT_NAME_MAP[element.name]
  if (customElementName === undefined) {
    throw new Error(`unknown component name: "${element.name}"`)
  }

  const attributes = Object.entries(element.attributes)
    .map(([key, value]) => ` ${key}="${attributeValueToString(value)}"`)
    .join('')
  const childrenHtml = element.children
    .map((child) => renderElement(child, layoutTagNames))
    .join('')
  return `<${customElementName}${attributes}>${childrenHtml}</${customElementName}>`
}

/**
 * Renders a DocumentNode to an HTML string.
 * Layout tags are converted to `<div class="TagName decoration1 decoration2">`.
 * Component tags are converted to their corresponding custom elements.
 * @param document - The document node to render
 * @param layoutTagNames - Set of tag names that are layout tags
 * @returns The rendered HTML string
 */
export function renderDocument(document: DocumentNode, layoutTagNames: Set<string>): string {
  return document.children
    .map((child) => renderElement(child, layoutTagNames))
    .join('')
}
