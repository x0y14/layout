import { raw } from 'hono/html'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { renderer } from './renderer'
import { processView } from './layout/processView.js'
import { mockPosts, mockTrends, mockCurrentUser } from './mockData.js'
import type { MockPost, MockTrend, CurrentUser, PageState } from './mockData.js'
import leftSideMenuViewSource from './views/LeftSideMenuView.txt?raw'
import contentViewSource from './views/ContentView.txt?raw'
import rightSideMenuViewSource from './views/RightSideMenuView.txt?raw'
import loginViewSource from './views/LoginView.txt?raw'

/**
 * @interface AppEnv
 * Hono environment type for variables set by the page state middleware.
 */
interface AppEnv {
  Variables: {
    posts: MockPost[]
    trends: MockTrend[]
    currentUser: CurrentUser
  }
}

const pageStateMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  c.set('posts', mockPosts)
  c.set('trends', mockTrends)
  c.set('currentUser', mockCurrentUser)
  await next()
})

const app = new Hono<AppEnv>()

app.use(renderer)

app.get('/', pageStateMiddleware, (c) => {
  const leftSideMenu = processView(leftSideMenuViewSource)
  const content = processView(contentViewSource)
  const rightSideMenu = processView(rightSideMenuViewSource)

  const pageState: PageState = {
    posts: c.get('posts'),
    trends: c.get('trends'),
    currentUser: c.get('currentUser'),
  }
  const stateScript = `<script id="__PAGE_STATE__" type="application/json">${JSON.stringify(pageState)}</script>`

  const html = `<div class="HStack main-layout">${leftSideMenu}${content}${rightSideMenu}</div>${stateScript}`
  return c.render(<div>{raw(html)}</div>)
})

app.get('/login', (c) => {
  const login = processView(loginViewSource)
  return c.render(<div>{raw(login)}</div>)
})

export default app
