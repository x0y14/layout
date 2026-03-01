import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * @element login-form
 * Displays a sign-in form for Toritter.
 */
@customElement('login-form')
export class LoginForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      font-size: 31px;
      font-weight: 800;
      color: #0f1419;
      margin-bottom: 32px;
    }
    .form-group {
      margin-bottom: 24px;
    }
    label {
      display: block;
      font-size: 15px;
      color: #536471;
      margin-bottom: 8px;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #cfd9de;
      border-radius: 4px;
      font-size: 17px;
      font-family: inherit;
      color: #0f1419;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus {
      border-color: #1d9bf0;
    }
    .login-button {
      width: 100%;
      padding: 14px;
      background-color: #0f1419;
      color: #fff;
      border: none;
      border-radius: 9999px;
      font-size: 17px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .login-button:hover {
      background-color: #272c30;
    }
  `;

  protected render() {
    return html`
      <h1>Sign in to Toritter</h1>
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" type="text" placeholder="Username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="Password" />
      </div>
      <button class="login-button">Log in</button>
    `;
  }
}
