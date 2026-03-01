import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {StoreController, $activeMenu} from '../stores.js';
import type {MenuKind} from '../stores.js';

const PAGE_LABELS: Record<MenuKind, string> = {
  home: 'Home',
  explore: 'Explore',
  notifications: 'Notifications',
  messages: 'Messages',
  bookmarks: 'Bookmarks',
  list: 'List',
  profile: 'Profile',
  more: 'More',
};

/**
 * @element content-area
 * Switches displayed content based on the active menu selection.
 */
@customElement('content-area')
export class ContentArea extends LitElement {
  private activeMenuController = new StoreController(this, $activeMenu);

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .placeholder {
      padding: 32px 16px;
      font-size: 20px;
      font-weight: 700;
      color: #0f1419;
    }
  `;

  protected render() {
    const current = this.activeMenuController.value;

    if (current === 'home') {
      return html`<posting-area></posting-area><time-line></time-line>`;
    }

    return html`<div class="placeholder">${PAGE_LABELS[current]}</div>`;
  }
}
