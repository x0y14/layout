import { raw } from 'hono/html'
import { Hono } from 'hono'
import { renderer } from './renderer'
import { processView } from './layout/processView.js'
import leftSideMenuViewSource from './views/LeftSideMenuView.txt?raw'
import contentViewSource from './views/ContentView.txt?raw'
import rightSideMenuViewSource from './views/RightSideMenuView.txt?raw'
import loginViewSource from './views/LoginView.txt?raw'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  const leftSideMenu = processView(leftSideMenuViewSource)
  const content = processView(contentViewSource)
  const rightSideMenu = processView(rightSideMenuViewSource)
  const html = `<div class="HStack main-layout">${leftSideMenu}${content}${rightSideMenu}</div>`
  return c.render(<div>{raw(html)}</div>)
})

app.get('/login', (c) => {
  const login = processView(loginViewSource)
  return c.render(<div>{raw(login)}</div>)
})

export default app
