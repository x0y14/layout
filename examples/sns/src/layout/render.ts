import { createElementRenderer } from '@layout/render'
import type { ServerComponent } from '@layout/render'

/**
 * SNS アプリケーションのコンポーネントマップ
 *
 * pigeonhole の ServerComponent パターンに基づき、
 * 各コンポーネント名からカスタム要素タグへのレンダラーを定義する。
 */
export const components: Record<string, ServerComponent> = {
  AppLogo: createElementRenderer('app-logo'),
  Menu: createElementRenderer('x-menu'),
  PostingArea: createElementRenderer('posting-area'),
  TimeLine: createElementRenderer('time-line'),
  Trend: createElementRenderer('x-trend'),
  LoginForm: createElementRenderer('login-form'),
  ContentArea: createElementRenderer('content-area'),
}
