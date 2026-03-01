import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {mockPosts} from '../mockData.js';
import type {MockPost} from '../mockData.js';

/**
 * @element time-line
 * Displays a list of posts from mock data with avatars and action buttons.
 */
@customElement('time-line')
export class TimeLine extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .post {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #eff3f4;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .post:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
    .post-avatar {
      flex-shrink: 0;
    }
    .post-body {
      flex: 1;
      min-width: 0;
    }
    .post-header {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 2px;
    }
    .display-name {
      font-weight: 700;
      font-size: 15px;
      color: #0f1419;
    }
    .user-name {
      font-size: 15px;
      color: #536471;
    }
    .timestamp {
      font-size: 15px;
      color: #536471;
    }
    .separator {
      font-size: 15px;
      color: #536471;
      padding: 0 4px;
    }
    .post-content {
      font-size: 15px;
      line-height: 1.4;
      color: #0f1419;
      margin-bottom: 12px;
    }
    .post-actions {
      display: flex;
      justify-content: space-between;
      max-width: 425px;
    }
    .action {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #536471;
      font-size: 13px;
      cursor: pointer;
      transition: color 0.2s;
    }
    .action:hover {
      color: #1d9bf0;
    }
    .action.reply:hover {
      color: #1d9bf0;
    }
    .action.retweet:hover {
      color: #00ba7c;
    }
    .action.like:hover {
      color: #f91880;
    }
    .action svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
  `;

  private formatCount(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return String(count);
  }

  private renderPost(post: MockPost) {
    return html`
      <div class="post">
        <div class="post-avatar">
          <playful-avatar name=${post.userName} size="40"></playful-avatar>
        </div>
        <div class="post-body">
          <div class="post-header">
            <span class="display-name">${post.displayName}</span>
            <span class="user-name">@${post.userName}</span>
            <span class="separator">·</span>
            <span class="timestamp">${post.timestamp}</span>
          </div>
          <div class="post-content">${post.content}</div>
          <div class="post-actions">
            <span class="action reply">
              <svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.25-.893 4.306-2.394 5.824l-5.61 5.67a.87.87 0 0 1-1.237.005L8.372 17h-2.5l-.071-.002A8.004 8.004 0 0 1 1.751 10zm8.005-6a6.005 6.005 0 0 0-5.9 7.142l.048.233a6.003 6.003 0 0 0 5.165 4.574L9.34 16h3.306l4.573 4.574 4.574-4.574.168-.18A6.127 6.127 0 0 0 20.251 10.13 6.128 6.128 0 0 0 14.122 4H9.756z"/></svg>
              ${this.formatCount(post.replyCount)}
            </span>
            <span class="action retweet">
              <svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>
              ${this.formatCount(post.retweetCount)}
            </span>
            <span class="action like">
              <svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.56-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>
              ${this.formatCount(post.likeCount)}
            </span>
            <span class="action">
              <svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18.25 21V8.5h2V21h-2zM13.5 21v-9h2v9h-2zM3.5 21v-4h2v4h-2z"/></svg>
              ${this.formatCount(post.viewCount)}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  protected render() {
    return html`${mockPosts.map((post) => this.renderPost(post))}`;
  }
}
