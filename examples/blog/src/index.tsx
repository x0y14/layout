import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
      <div>
        <h1>Hello!</h1>
        <my-element></my-element>
      </div>
    )
})

export default app
