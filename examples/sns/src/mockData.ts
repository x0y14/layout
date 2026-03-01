/**
 * @interface MockPost
 * Represents a single post in the timeline.
 */
export interface MockPost {
  id: number
  userName: string
  displayName: string
  content: string
  timestamp: string
  replyCount: number
  retweetCount: number
  likeCount: number
  viewCount: number
}

/**
 * @interface MockTrend
 * Represents a trending topic.
 */
export interface MockTrend {
  category: string
  name: string
  postCount: number
}

/**
 * @interface CurrentUser
 * Represents the currently logged-in user.
 */
export interface CurrentUser {
  userName: string
  displayName: string
}

/**
 * @interface PageState
 * Represents the serializable state embedded in the page for client-side hydration.
 */
export interface PageState {
  posts: MockPost[]
  trends: MockTrend[]
  currentUser: CurrentUser
}

export const mockCurrentUser: CurrentUser = {
  userName: 'current_user',
  displayName: 'カレントユーザー',
}

export const mockPosts: MockPost[] = [
  {
    id: 1,
    userName: 'rust_fan',
    displayName: 'Rust 大好きエンジニア',
    content: 'Rust の所有権システム、最初は苦労したけど慣れると他の言語に戻れなくなる。メモリ安全性が保証されるのは本当にありがたい。',
    timestamp: '2m',
    replyCount: 12,
    retweetCount: 45,
    likeCount: 230,
    viewCount: 5400,
  },
  {
    id: 2,
    userName: 'web_dev_tokyo',
    displayName: 'フロントエンド職人',
    content: 'Lit で Web Components 作ってるけど、Shadow DOM のスタイルスコーピングが最高すぎる。React から移行して正解だった。',
    timestamp: '15m',
    replyCount: 8,
    retweetCount: 32,
    likeCount: 178,
    viewCount: 3200,
  },
  {
    id: 3,
    userName: 'infra_ninja',
    displayName: 'インフラ忍者',
    content: 'Cloudflare Workers で SSR やってみたら、コールドスタートほぼゼロで感動した。エッジコンピューティングの時代が来てる。',
    timestamp: '1h',
    replyCount: 24,
    retweetCount: 89,
    likeCount: 412,
    viewCount: 12000,
  },
  {
    id: 4,
    userName: 'ai_researcher',
    displayName: 'AI リサーチャー',
    content: '最近の LLM の進化速度がすごすぎて論文読むのが追いつかない。毎週新しいアーキテクチャが出てくる。',
    timestamp: '3h',
    replyCount: 56,
    retweetCount: 120,
    likeCount: 890,
    viewCount: 28000,
  },
  {
    id: 5,
    userName: 'oss_contributor',
    displayName: 'OSS コントリビューター',
    content: '今日初めて大きなプロジェクトに PR がマージされた！コードレビューで指摘されたところを直すのに3日かかったけど、達成感がすごい。',
    timestamp: '5h',
    replyCount: 34,
    retweetCount: 67,
    likeCount: 543,
    viewCount: 9800,
  },
]

export const mockTrends: MockTrend[] = [
  {
    category: 'テクノロジー',
    name: '#RustLang',
    postCount: 12400,
  },
  {
    category: 'テクノロジー',
    name: '#WebComponents',
    postCount: 8900,
  },
  {
    category: 'テクノロジー',
    name: '#CloudflareWorkers',
    postCount: 6700,
  },
  {
    category: 'トレンド',
    name: '#プログラミング初心者',
    postCount: 23000,
  },
  {
    category: 'テクノロジー',
    name: '#TypeScript5',
    postCount: 15600,
  },
]
