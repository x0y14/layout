import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import type {MockTrend} from '../mockData.js';
import {StoreController, $trends} from '../stores.js';

/**
 * @element x-trend
 * Displays a search bar and trending topics.
 */
@customElement('x-trend')
export class Trend extends LitElement {
  private trendsController = new StoreController(this, $trends);

  static styles = css`
    :host {
      display: block;
      padding-top: 12px;
    }
    .search-bar {
      position: sticky;
      top: 0;
      background-color: #fff;
      padding-bottom: 12px;
      z-index: 1;
    }
    .search-input {
      width: 100%;
      padding: 12px 16px;
      background-color: #eff3f4;
      border: 1px solid transparent;
      border-radius: 9999px;
      font-size: 15px;
      font-family: inherit;
      color: #0f1419;
      outline: none;
      transition: all 0.2s;
    }
    .search-input::placeholder {
      color: #536471;
    }
    .search-input:focus {
      background-color: #fff;
      border-color: #1d9bf0;
    }
    .trends-card {
      background-color: #f7f9f9;
      border-radius: 16px;
      overflow: hidden;
    }
    .trends-header {
      font-size: 20px;
      font-weight: 800;
      padding: 12px 16px;
      color: #0f1419;
    }
    .trend-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .trend-item:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
    .trend-category {
      font-size: 13px;
      color: #536471;
      margin-bottom: 2px;
    }
    .trend-name {
      font-size: 15px;
      font-weight: 700;
      color: #0f1419;
      margin-bottom: 2px;
    }
    .trend-post-count {
      font-size: 13px;
      color: #536471;
    }
  `;

  private formatPostCount(count: number): string {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K posts`;
    return `${count} posts`;
  }

  private renderTrend(trend: MockTrend) {
    return html`
      <div class="trend-item">
        <div class="trend-category">${trend.category}</div>
        <div class="trend-name">${trend.name}</div>
        <div class="trend-post-count">${this.formatPostCount(trend.postCount)}</div>
      </div>
    `;
  }

  protected render() {
    return html`
      <div class="search-bar">
        <input class="search-input" type="text" placeholder="Search" />
      </div>
      <div class="trends-card">
        <div class="trends-header">Trends for you</div>
        ${this.trendsController.value.map((trend) => this.renderTrend(trend))}
      </div>
    `;
  }
}
