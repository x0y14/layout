declare module 'hono/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'my-element': Hono.HTMLAttributes
    }
  }
}
