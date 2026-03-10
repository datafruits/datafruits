# Shrimpos — Rails / Hotwire proof of concept

This directory contains a proof of concept (POC) for migrating the **Shrimpos**
pages from the [datafruits/datafruits](https://github.com/datafruits/datafruits)
Ember.js frontend to server-side rendered HTML in the
[datafruits/streampusher-api](https://github.com/datafruits/streampusher-api)
Rails application.

---

## Goals

1. **Server-side rendering** — Shrimpos pages are rendered by Rails (ERB) instead
   of the Ember SPA. This improves SEO, initial load time, and accessibility.

2. **Hotwire navigation** — [Turbo Drive](https://turbo.hotwired.dev/handbook/drive)
   handles navigation between pages without full reloads, giving a SPA-like feel.

3. **No audio interruption** — The audio player and background visuals are marked
   with `data-turbo-permanent` in the layout. Turbo Drive preserves these elements
   across page navigations, so music keeps playing while the user browses.

4. **Web components for interactivity** — Instead of rebuilding Ember's rich
   component system, JavaScript-heavy UI elements (countdown timer, entry player,
   voting) are implemented as [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).
   They work with vanilla HTML and require no build step beyond what Rails already
   provides.

---

## File map

```
rails_poc/
├── app/
│   ├── controllers/
│   │   ├── shrimpos_controller.rb          # index + show actions
│   │   └── shrimpo_entries_controller.rb   # show + create actions
│   │
│   ├── views/
│   │   ├── layouts/
│   │   │   └── hotwire.html.erb            # Layout with persistent player & visuals
│   │   │
│   │   ├── shrimpos/
│   │   │   ├── index.html.erb              # Shrimpos listing
│   │   │   ├── show.html.erb               # Single shrimpo detail page
│   │   │   ├── _card.html.erb              # Shrimpo card partial
│   │   │   ├── _entry_card.html.erb        # Entry card partial (used in show)
│   │   │   └── _entry_uploader.html.erb    # Entry submission form partial
│   │   │
│   │   └── shrimpo_entries/
│   │       └── show.html.erb               # Single entry detail page
│   │
│   └── javascript/
│       └── web_components/
│           ├── shrimpo-countdown.js        # Countdown timer custom element
│           ├── shrimpo-player.js           # Entry audio player custom element
│           └── shrimpo-vote.js             # Voting slider custom element
│
└── config/
    └── routes.rb                           # Route definitions to add to streampusher-api
```

---

## How the "no audio interruption" works

Turbo Drive (part of Hotwire) intercepts link clicks and `form` submissions,
fetches the new page via AJAX, and replaces the `<body>` of the current page
with the new body.

By default this would kill the audio player because its DOM node is removed and
a new one is inserted. The fix is `data-turbo-permanent`:

```html
<!-- layouts/hotwire.html.erb -->
<div
  id="datafruits-audio-player"
  data-turbo-permanent
  ...
>
  <datafruits-player ...></datafruits-player>
</div>
```

Rules for `data-turbo-permanent`:

- The element **must have a unique `id`**.
- The same element must appear with the same `id` in every page of the app
  (the layout handles this).
- Turbo Drive moves the element from the old `<body>` to the new `<body>` on
  every navigation, keeping its internal state (including `<audio>` playback).

The background visuals canvas element is marked the same way:

```html
<div id="datafruits-visuals" data-turbo-permanent ...>
  <canvas id="datafruits-visuals-canvas" ...></canvas>
</div>
```

---

## Web components

### `<shrimpo-countdown end-at="ISO8601">`

Shows a live countdown to the end of the submission period.
Updates every second without polling the server.

```html
<shrimpo-countdown end-at="2026-03-15T18:00:00Z"></shrimpo-countdown>
```

### `<shrimpo-player cdn-url="…" download-url="…" title="…">`

Renders a play/pause button and a download link for a shrimpo entry.
Uses the native `HTMLAudioElement` — no external audio library required.

```html
<shrimpo-player
  cdn-url="https://cdn.example.com/entry.mp3"
  download-url="https://cdn.example.com/entry.mp3"
  title="My Shrimpo Track"
></shrimpo-player>
```

### `<shrimpo-vote …>`

Renders an emoji-based score slider and submits votes via `fetch`.
All required data is passed as HTML attributes (rendered by ERB), so no
separate API call is needed on mount.

```html
<shrimpo-vote
  entry-id="42"
  shrimpo-slug="cool-beats-2026"
  entry-slug="my-tune"
  emoji="🦐"
  existing-score="3"
  voting-completion-percentage="60"
  vote-url="/shrimpos/cool-beats-2026/entries/my-tune/votes"
  csrf-token="<%= form_authenticity_token %>"
></shrimpo-vote>
```

---

## Integration steps for `streampusher-api`

1. **Copy views** — Copy everything under `rails_poc/app/views/` into the
   corresponding `app/views/` directory of `streampusher-api`.

2. **Copy controllers** — Copy `shrimpos_controller.rb` and
   `shrimpo_entries_controller.rb` into `app/controllers/`.
   Adjust the model names and associations to match the existing Rails models.

3. **Copy web components** — Copy the files under
   `rails_poc/app/javascript/web_components/` into
   `app/javascript/web_components/` (or wherever the asset pipeline picks up JS).
   Add an `import` for each file in the main `application.js` entrypoint, or
   include them with `<script type="module">` tags in the layout.

4. **Add routes** — Merge the route definitions from `rails_poc/config/routes.rb`
   into `config/routes.rb`.

5. **Add Turbo** — If not already present, add the `turbo-rails` gem:
   ```ruby
   # Gemfile
   gem "turbo-rails"
   ```
   Run `bundle install` and `rails turbo:install`.

6. **Add helper methods** — The views reference a few helpers that may need to
   be added to `app/helpers/`:

   ```ruby
   # app/helpers/shrimpos_helper.rb
   module ShrimposHelper
     # Returns "1st", "2nd", "3rd", etc. with a special label for top spots.
     def formatted_shrimpo_ranking(ranking, total_entries)
       return "???" unless ranking
       ranking.to_i.ordinalize
     end

     # Returns the full URL for a custom emoji image.
     def emoji_path(emoji_name)
       "/assets/emoji/#{emoji_name}.png"
     end

     # Renders the rule_pack markdown as safe HTML.
     def markdown(text)
       return "" if text.blank?
       ActionController::Base.helpers.sanitize(
         Commonmarker.to_html(text),
         tags: %w[p br strong em ul ol li a]
       )
     end
   end
   ```

7. **Update the Ember app** (optional, for a phased migration) — Once the Rails
   pages are live, update the Ember `shrimpos` route to redirect to the
   server-rendered URLs, or simply change the links from `<LinkTo>` (Ember
   router) to regular `<a href>` tags that point to the Rails-rendered paths.

---

## Testing

Once integrated in `streampusher-api`, the controllers can be tested with
standard Rails request specs:

```ruby
# spec/requests/shrimpos_spec.rb
RSpec.describe "Shrimpos", type: :request do
  describe "GET /shrimpos" do
    it "renders the shrimpos listing" do
      get shrimpos_path
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("THE POWER OF SHRIMPO")
    end
  end

  describe "GET /shrimpos/:slug" do
    let!(:shrimpo) { create(:shrimpo, status: "running") }

    it "renders the shrimpo detail page" do
      get shrimpo_path(shrimpo.slug)
      expect(response).to have_http_status(:ok)
      expect(response.body).to include(shrimpo.title)
    end
  end
end
```
