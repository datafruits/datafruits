/**
 * ShrimpoCountdownElement — countdown timer for a running shrimpo.
 *
 * Replaces the Ember `Shrimpo::Countdown` component.
 *
 * Usage:
 *   <shrimpo-countdown end-at="2026-03-15T18:00:00Z"></shrimpo-countdown>
 *
 * The element updates every second, showing days / hours / minutes / seconds
 * remaining until the `end-at` ISO-8601 timestamp.
 */
class ShrimpoCountdownElement extends HTMLElement {
  static get observedAttributes() {
    return ["end-at"];
  }

  connectedCallback() {
    this._render();
    this._timer = setInterval(() => this._render(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const endAt = this.getAttribute("end-at");
    if (!endAt) {
      this.textContent = "";
      return;
    }

    const now = Date.now();
    const end = new Date(endAt).getTime();
    const diffMs = end - now;

    if (diffMs <= 0) {
      this.innerHTML = `<span class="text-white">Time's up!</span>`;
      clearInterval(this._timer);
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    this.innerHTML = `
      <span class="text-white">
        Time left: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds
      </span>
    `;
  }
}

customElements.define("shrimpo-countdown", ShrimpoCountdownElement);
