/**
 * ShrimpoVoteElement — voting slider for a normal (non-mega) shrimpo entry.
 *
 * Replaces the Ember `Shrimpo::VotingTable` component.
 *
 * Usage:
 *   <shrimpo-vote
 *     entry-id="42"
 *     shrimpo-slug="cool-beats-2026"
 *     entry-slug="my-tune"
 *     emoji="🦐"
 *     existing-score="3"
 *     voting-completion-percentage="60"
 *     vote-url="/shrimpos/cool-beats-2026/entries/my-tune/votes"
 *     csrf-token="abc123"
 *   ></shrimpo-vote>
 *
 * The element submits a JSON request to `vote-url` with the selected score.
 * CSRF protection uses the token supplied as an attribute (rendered by ERB).
 */
class ShrimpoVoteElement extends HTMLElement {
  connectedCallback() {
    this._score = parseInt(this.getAttribute("existing-score") || "1", 10);
    this._voted = this.hasAttribute("existing-score") && this.getAttribute("existing-score") !== "";
    this._saving = false;
    this._render();
  }

  _render() {
    const emoji = this.getAttribute("emoji") || "🦐";
    const completionPct = this.getAttribute("voting-completion-percentage") || "0";

    const pips = Array.from({ length: 6 }, (_, i) => {
      const active = i + 1 <= this._score ? "opacity-100" : "opacity-50";
      return `<span class="${active} text-2xl" aria-hidden="true">${emoji}</span>`;
    }).join("");

    this.innerHTML = `
      <div>
        <h3>Shrimps command voting happens now!</h3>
        <h2 class="text-lg">You are... ${completionPct}% done voting for this shrimpo!</h2>
        <p>Rate tune by number of ${emoji}.</p>

        ${this._voted ? `
          <p>You already voted on this entry.</p>
          <img class="bounce" src="/assets/images/i_voted.png" alt="I voted!" />
        ` : ""}

        <div class="shrimpo-score-picker mb-2">
          <input
            type="range"
            min="1"
            max="6"
            value="${this._score}"
            class="score-slider"
            aria-label="Score (1–6)"
          />
          <div class="flex">${pips}</div>
        </div>

        <button
          class="cool-button save-vote-btn"
          type="button"
          ${this._saving ? "disabled" : ""}
        >
          ${this._saving ? "Saving…" : "SAVE VOTE"}
        </button>

        ${this._error ? `<p class="text-red-400">${this._error}</p>` : ""}
      </div>
    `;

    this.querySelector(".score-slider").addEventListener("input", (e) => {
      this._score = parseInt(e.target.value, 10);
      this._render();
    });

    this.querySelector(".save-vote-btn").addEventListener("click", () => this._saveVote());
  }

  async _saveVote() {
    this._saving = true;
    this._error = null;
    this._render();

    const voteUrl = this.getAttribute("vote-url");
    const csrfToken = this.getAttribute("csrf-token");

    try {
      const response = await fetch(voteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ shrimpo_vote: { score: this._score } }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      this._voted = true;
      this._saving = false;
      this._render();
    } catch (err) {
      this._error = "Couldn't save vote — please try again.";
      this._saving = false;
      this._render();
    }
  }
}

customElements.define("shrimpo-vote", ShrimpoVoteElement);
