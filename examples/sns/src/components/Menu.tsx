import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {StoreController, $activeMenu} from '../stores.js';
import type {MenuKind} from '../stores.js';

const MENU_LABELS: Record<string, string> = {
  home: 'Home',
  explore: 'Explore',
  notifications: 'Notifications',
  messages: 'Messages',
  bookmarks: 'Bookmarks',
  profile: 'Profile',
};

const MENU_ICONS: Record<string, string> = {
  home: 'M21.591 7.146L12.52 1.157a.89.89 0 0 0-1.04 0L2.41 7.146A1.26 1.26 0 0 0 1.87 8.2v13.068c0 .4.32.732.72.732h5.96c.4 0 .72-.332.72-.732V14.39h5.46v6.878c0 .4.32.732.72.732h5.96c.4 0 .72-.332.72-.732V8.2a1.26 1.26 0 0 0-.54-1.054z',
  explore: 'M10.09 3.098L9.72 7h5.99l.39-4.089 1.99.187L17.72 7H21v2h-3.46l-.48 5H21v2h-4.13l-.39 4.089-1.99-.187.37-3.902H9.72l-.39 4.089-1.99-.187L7.72 16H4v-2h3.91l.48-5H4V7h4.58l.39-4.089 1.99.187zM10.29 9l-.48 5h5.99l.48-5h-5.99z',
  notifications: 'M19.993 9.042C19.48 5.017 16.054 2 11.996 2 7.938 2 4.512 5.017 3.998 9.042 2.794 9.18 1.87 10.166 1.87 11.37c0 1.31 1.062 2.37 2.37 2.37h.89c.68 3.146 3.47 5.51 6.87 5.51s6.19-2.364 6.87-5.51h.89c1.31 0 2.37-1.06 2.37-2.37 0-1.204-.925-2.19-2.13-2.328zM14.36 19.63A3.085 3.085 0 0 1 12 20.88a3.085 3.085 0 0 1-2.36-1.25c.77.2 1.56.3 2.36.3s1.59-.1 2.36-.3z',
  messages: 'M1.998 5.5a2.5 2.5 0 0 1 2.5-2.5h15a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5h-15a2.5 2.5 0 0 1-2.5-2.5v-13zm2.5-.5a.5.5 0 0 0-.5.5v.862l8 5.143 8-5.143V5.5a.5.5 0 0 0-.5-.5h-15zm15.5 3.138l-7.702 4.952a.5.5 0 0 1-.596 0L3.998 8.138V18.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V8.138z',
  bookmarks: 'M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4a.5.5 0 0 0-.5.5v14.56l6-4.29 6 4.29V4.5a.5.5 0 0 0-.5-.5h-11z',
  profile: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.5a8.46 8.46 0 0 1-5.784-2.272C7.26 15.592 9.393 14.5 12 14.5s4.74 1.092 5.784 2.728A8.46 8.46 0 0 1 12 19.5z',
};

/**
 * @element x-menu
 * Displays a navigation menu item with icon and label.
 */
@customElement('x-menu')
export class Menu extends LitElement {
  @property() kind = '';
  private activeMenuController = new StoreController(this, $activeMenu);

  static styles = css`
    :host {
      display: block;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 12px;
      border-radius: 9999px;
      cursor: pointer;
      transition: background-color 0.2s;
      text-decoration: none;
      color: #0f1419;
    }
    .menu-item:hover {
      background-color: rgba(15, 20, 25, 0.1);
    }
    .menu-item svg {
      width: 26px;
      height: 26px;
      fill: #0f1419;
    }
    .menu-label {
      font-size: 20px;
    }
    .menu-label.active {
      font-weight: 700;
    }
  `;

  private handleClick() {
    $activeMenu.set(this.kind as MenuKind);
  }

  protected render() {
    const label = MENU_LABELS[this.kind] ?? this.kind;
    const iconPath = MENU_ICONS[this.kind] ?? '';
    const isActive = this.activeMenuController.value === this.kind;

    return html`
      <div class="menu-item" @click=${this.handleClick}>
        <svg viewBox="0 0 24 24"><path d=${iconPath} /></svg>
        <span class="menu-label ${isActive ? 'active' : ''}">${label}</span>
      </div>
    `;
  }
}
