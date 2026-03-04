# Datastar Demo – Code of Conduct Page

This document describes the Datastar spike/demo added to the datafruits Ember app.

## What was changed

| File | Change |
|------|--------|
| `app/router.js` | Added `home/coc-datastar` route |
| `app/routes/home/coc-datastar.js` | New route that dynamically imports Datastar |
| `app/templates/home/coc-datastar.hbs` | New Datastar-powered template with interactive CoC content |
| `app/templates/home/coc.hbs` | Added a link to the demo page |
| `translations/en-us.json` (and others) | Added `coc.datastar_demo_link` translation key |
| `tests/acceptance/coc-datastar-test.js` | Acceptance test for the new route |
| `package.json` | Added `@starfederation/datastar` npm dependency |

## Why this approach

[Datastar](https://data-star.dev) is a lightweight (~14 kB) HTML-first library that adds
reactivity through `data-*` attributes, similar to Alpine.js or HTMX. It uses reactive
signals to manage state and updates the DOM directly, without requiring a framework-level
compilation step for the interactive parts.

This demo shows what it would look like to "escape" Ember's Handlebars rendering for a page
body while still benefiting from Ember's routing, layout, and nav shell. The Ember route
dynamically imports Datastar on first visit (`beforeModel`), and Datastar's built-in
`MutationObserver` picks up the `data-*` attributes from the rendered template.

Key differences from the Ember CoC page (`/coc`):
- **Rendering**: content is static HTML in the template; Datastar drives interactivity via
  `data-signals`, `data-show`, `data-on-*`, and `data-bind-*` attributes.
- **Translations**: the demo page uses plain English strings rather than `{{t "..."}}` helpers,
  to keep the Datastar markup simple and self-contained.
- **Reactivity**: collapsible sections and a live keyword filter are implemented entirely with
  `data-*` attributes — no Ember components or computed properties required.

## Features demonstrated

1. **Collapsible sections** – Each CoC section (Pledge, Standards, Responsibilities, Scope,
   Enforcement, Attribution) has a toggle button. `data-on-click` updates a boolean signal,
   and `data-show` conditionally hides/shows the section content.

2. **Live keyword filter** – A text input bound with `data-bind-filter` updates a `$filter`
   signal. Each Standards list item has a `data-show` expression that evaluates whether its
   text contains the current filter value.

## How to run locally and view the demo

```bash
# Install dependencies (if not already done)
npm install

# Start the development server (FastBoot disabled for simplicity)
npm run dev
```

Then open [http://localhost:4200/coc](http://localhost:4200/coc) and click the
**"✨ View Datastar demo version"** link, or navigate directly to
[http://localhost:4200/coc-datastar](http://localhost:4200/coc-datastar).

## Running the acceptance test

```bash
ember test --filter "coc datastar"
```

## Notes / Limitations

- **Demo only** – This is a spike intended to illustrate the approach, not a production-ready
  migration.
- **No i18n** – The demo template uses plain English text. A real migration would need to
  integrate with ember-intl or a separate i18n mechanism.
- **FastBoot** – Datastar is a client-only library. The route's dynamic import is
  skipped on the server side because `beforeModel` is called on the client. If FastBoot SSR
  is a requirement, the import would need to be guarded with a `fastboot.isFastBoot` check.
- **Global MutationObserver** – Once Datastar is loaded (first visit to `/coc-datastar`),
  its `MutationObserver` remains active for the lifetime of the page session. This is
  intentional and how Datastar handles SPA navigation.
- **Bundle size** – `@starfederation/datastar` is loaded lazily via a dynamic import only
  when the demo route is visited, so it does not affect other pages.
