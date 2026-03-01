import { atom } from 'nanostores'
import type { ReadableAtom } from 'nanostores'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { MockPost, MockTrend, CurrentUser, PageState } from './mockData.js'

export type MenuKind = 'home' | 'explore' | 'notifications' | 'messages' | 'bookmarks' | 'list' | 'profile' | 'more'

export const $activeMenu = atom<MenuKind>('home')
export const $posts = atom<MockPost[]>([])
export const $trends = atom<MockTrend[]>([])
export const $currentUser = atom<CurrentUser | null>(null)

/**
 * @class StoreController
 * Lit ReactiveController that subscribes to a nanostores atom and triggers host updates.
 */
export class StoreController<T> implements ReactiveController {
  private host: ReactiveControllerHost
  private store: ReadableAtom<T>
  private unsubscribe: (() => void) | undefined

  get value(): T {
    return this.store.get()
  }

  constructor(host: ReactiveControllerHost, store: ReadableAtom<T>) {
    this.host = host
    this.store = store
    host.addController(this)
  }

  hostConnected(): void {
    this.unsubscribe = this.store.subscribe(() => {
      this.host.requestUpdate()
    })
  }

  hostDisconnected(): void {
    this.unsubscribe?.()
  }
}

/**
 * @function hydrate
 * Reads the serialized PageState from the DOM and populates the nanostores atoms.
 */
export function hydrate(): void {
  const element = document.getElementById('__PAGE_STATE__')
  if (!element?.textContent) return

  const pageState: PageState = JSON.parse(element.textContent)
  $posts.set(pageState.posts)
  $trends.set(pageState.trends)
  $currentUser.set(pageState.currentUser)
}
