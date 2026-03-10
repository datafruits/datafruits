/**
 * DatafruitsPlayerElement — persistent live-stream audio player.
 *
 * This is the site-wide audio player that lives in the page footer.
 * It is marked with `data-turbo-permanent` in the layout, so Turbo Drive
 * keeps it alive across page navigations — the stream never stops playing
 * when the user browses to a different page.
 *
 * Usage (in layouts/hotwire.html.erb):
 *   <datafruits-player
 *     stream-url="http://relay.datafruits.fm:8000/datafruits"
 *   ></datafruits-player>
 *
 * Attributes:
 *   stream-url  — The Icecast/Shoutcast stream URL to play.
 *
 * The element renders a simple play/pause toggle. Because the element is
 * preserved by Turbo Drive (data-turbo-permanent), the Audio object and its
 * playback state persist across navigations automatically.
 */
class DatafruitsPlayerElement extends HTMLElement {
  static get observedAttributes() {
    return ["stream-url"];
  }

  connectedCallback() {
    // Only create the Audio instance once (on first connection).
    // Turbo Drive calls connectedCallback again when the element is moved
    // back into the new document body, so we guard against re-initialising.
    if (!this._audio) {
      this._audio = new Audio();
      this._audio.addEventListener("playing", () => this._setPlaying(true));
      this._audio.addEventListener("pause", () => this._setPlaying(false));
      this._audio.addEventListener("error", () => {
        this._error = true;
        this._render();
      });
    }
    this._render();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "stream-url" && this._audio) {
      const wasPlaying = this._playing;
      this._audio.src = newValue;
      if (wasPlaying) this._audio.play();
    }
  }

  _setPlaying(playing) {
    this._playing = playing;
    this._error = false;
    this._render();
  }

  _render() {
    const streamUrl = this.getAttribute("stream-url") || "";

    this.innerHTML = `
      <div class="flex items-center space-x-3 px-4">
        <button
          class="play-pause-btn text-df-green hover:text-df-yellow text-xl font-bold"
          type="button"
          aria-label="${this._playing ? "Pause stream" : "Play stream"}"
        >
          ${this._playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <span class="text-white text-sm">
          ${this._playing ? "🔴 LIVE" : "datafruits.fm"}
        </span>
        ${this._error ? `<span class="text-red-400 text-sm">Stream unavailable — try again shortly.</span>` : ""}
      </div>
    `;

    this.querySelector(".play-pause-btn").addEventListener("click", () => {
      if (this._playing) {
        this._audio.pause();
      } else {
        // Set src fresh on each play attempt so the browser fetches a new
        // chunk from the live stream rather than seeking in a stale buffer.
        this._audio.src = streamUrl;
        this._audio.play().catch(() => {
          this._error = true;
          this._render();
        });
      }
    });
  }
}

customElements.define("datafruits-player", DatafruitsPlayerElement);
