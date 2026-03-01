import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * @element posting-area
 * Displays a compose area with avatar, textarea, and Post button.
 */
@customElement('posting-area')
export class PostingArea extends LitElement {
  static styles = css`
    :host {
      display: block;
      border-bottom: 1px solid #eff3f4;
    }
    .compose {
      display: flex;
      padding: 16px;
      gap: 12px;
    }
    .avatar {
      flex-shrink: 0;
    }
    .compose-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    textarea {
      width: 100%;
      min-height: 52px;
      border: none;
      outline: none;
      resize: none;
      font-size: 20px;
      font-family: inherit;
      color: #0f1419;
      line-height: 1.4;
    }
    textarea::placeholder {
      color: #536471;
    }
    .compose-footer {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #eff3f4;
      padding-top: 12px;
    }
    .post-button {
      background-color: #1d9bf0;
      color: #fff;
      border: none;
      border-radius: 9999px;
      padding: 8px 24px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .post-button:hover {
      background-color: #1a8cd8;
    }
  `;

  protected render() {
    return html`
      <div class="compose">
        <div class="avatar">
          <playful-avatar name="CurrentUser" size="40"></playful-avatar>
        </div>
        <div class="compose-body">
          <textarea placeholder="What is happening?!"></textarea>
          <div class="compose-footer">
            <button class="post-button">Post</button>
          </div>
        </div>
      </div>
    `;
  }
}
