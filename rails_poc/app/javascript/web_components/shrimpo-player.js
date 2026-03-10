/**
 * ShrimpoPlayerElement — audio player for a shrimpo entry.
 *
 * Replaces the Ember `Shrimpo::Player` component.
 *
 * Usage:
 *   <shrimpo-player
 *     cdn-url="https://cdn.example.com/entry.mp3"
 *     download-url="https://cdn.example.com/entry.mp3"
 *     title="My Shrimpo Track"
 *   ></shrimpo-player>
 *
 * The element renders a play/pause toggle and a download link.
 * Playback uses the native HTMLAudioElement so it works without any framework.
 *
 * NOTE: This component plays audio *within the entry card*. It is separate from
 * the main datafruits live-stream player in the page footer (which uses
 * data-turbo-permanent to persist across navigations).
 */
class ShrimpoPlayerElement extends HTMLElement {
  static get observedAttributes() {
    return ["cdn-url", "title"];
  }

  connectedCallback() {
    this._audio = new Audio(this.getAttribute("cdn-url"));
    this._audio.addEventListener("ended", () => this._setPlaying(false));
    this._render();
  }

  disconnectedCallback() {
    if (this._audio) {
      this._audio.pause();
      this._audio = null;
    }
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "cdn-url" && this._audio) {
      this._audio.src = newValue;
      this._setPlaying(false);
    }
    this._render();
  }

  _setPlaying(playing) {
    this._playing = playing;
    this._render();
  }

  _render() {
    const downloadUrl = this.getAttribute("download-url") || this.getAttribute("cdn-url");

    this.innerHTML = `
      <div class="mt-1 flex space-x-1">
        <button
          class="text-df-green hover:text-df-yellow text-xl play-pause-btn"
          type="button"
          aria-label="${this._playing ? "Pause" : "Play"}"
        >
          ${this._playing ? "Pause" : "Play"}
        </button>
        <a href="${downloadUrl}" download="" aria-label="Download">
          <span class="fa fa-download text-df-green hover:text-df-yellow text-xl" aria-hidden="true">⬇</span>
        </a>
      </div>
    `;

    this.querySelector(".play-pause-btn").addEventListener("click", (e) => {
      e.preventDefault();
      if (this._playing) {
        this._audio.pause();
        this._setPlaying(false);
      } else {
        this._audio.play();
        this._setPlaying(true);
      }
    });
  }
}

customElements.define("shrimpo-player", ShrimpoPlayerElement);
