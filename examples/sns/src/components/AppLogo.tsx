import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * @element app-logo
 * Displays the Toritter bird logo.
 */
@customElement('app-logo')
export class AppLogo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 12px;
    }
    .logo-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      transition: background-color 0.2s;
      cursor: pointer;
    }
    .logo-link:hover {
      background-color: rgba(29, 155, 240, 0.1);
    }
    svg {
      width: 28px;
      height: 28px;
      fill: #1d9bf0;
    }
  `;

  protected render() {
    return html`
      <div class="logo-link">
        <svg viewBox="0 0 24 24" aria-label="Toritter">
          <path d="M21.591 7.146L12.52 1.157a.89.89 0 0 0-1.04 0L2.41 7.146A1.26 1.26 0 0 0 1.87 8.2v13.068c0 .4.32.732.72.732h5.96c.4 0 .72-.332.72-.732V14.39h5.46v6.878c0 .4.32.732.72.732h5.96c.4 0 .72-.332.72-.732V8.2a1.26 1.26 0 0 0-.54-1.054z" />
        </svg>
      </div>
    `;
  }
}
