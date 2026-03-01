declare module 'hono/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'app-logo': Hono.HTMLAttributes
      'x-menu': Hono.HTMLAttributes & { kind?: string }
      'posting-area': Hono.HTMLAttributes
      'time-line': Hono.HTMLAttributes
      'x-trend': Hono.HTMLAttributes
      'login-form': Hono.HTMLAttributes
      'content-area': Hono.HTMLAttributes
    }
  }
}

declare module '*.txt?raw' {
  const content: string
  export default content
}
