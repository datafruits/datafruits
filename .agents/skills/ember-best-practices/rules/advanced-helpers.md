---
title: Use Helper Functions for Reusable Logic
impact: LOW-MEDIUM
impactDescription: Better code reuse and testability
tags: helpers, templates, reusability, advanced
---

## Use Helper Functions for Reusable Logic

Extract reusable template logic into helper functions that can be tested independently and used across templates.

**Incorrect (logic duplicated in components):**

```javascript
// app/components/user-card.js
class UserCard extends Component {
  get formattedDate() {
    const date = new Date(this.args.user.createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
}

// app/components/post-card.js - same logic duplicated!
class PostCard extends Component {
  get formattedDate() {
    // Same implementation...
  }
}
```

**Correct (reusable helper):**

For single-use helpers, keep them in the same file as the component:

```glimmer-js
// app/components/post-list.gjs
import Component from '@glimmer/component';

// Helper co-located in same file
function formatRelativeDate(date) {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return dateObj.toLocaleDateString();
}

class PostList extends Component {
  <template>
    {{#each @posts as |post|}}
      <article>
        <h2>{{post.title}}</h2>
        <time>{{formatRelativeDate post.createdAt}}</time>
      </article>
    {{/each}}
  </template>
}
```

For helpers shared across multiple components in a feature, use a subdirectory:

```javascript
// app/components/blog/format-relative-date.js
export function formatRelativeDate(date) {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return dateObj.toLocaleDateString();
}
```

**Alternative (shared helper in utils):**

For truly shared helpers used across the whole app, use `app/utils/`:

```javascript
// app/utils/format-relative-date.js
// Flat structure - use subpath-imports in package.json for nicer imports if needed
export function formatRelativeDate(date) {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return dateObj.toLocaleDateString();
}
```

**Note**: Keep utils flat (`app/utils/format-relative-date.js`), not nested (`app/utils/date/format-relative-date.js`). If you need cleaner top-level imports, configure subpath-imports in package.json instead of nesting files.

```glimmer-js
// app/components/user-card.gjs
import { formatRelativeDate } from '../utils/format-relative-date';

<template>
  <p>Joined: {{formatRelativeDate @user.createdAt}}</p>
</template>
```

```glimmer-js
// app/components/post-card.gjs
import { formatRelativeDate } from '../utils/format-relative-date';

<template>
  <p>Posted: {{formatRelativeDate @post.createdAt}}</p>
</template>
```

**For helpers with state, use class-based helpers:**

```javascript
// app/utils/helpers/format-currency.js
export class FormatCurrencyHelper {
  constructor(owner) {
    this.intl = owner.lookup('service:intl');
  }

  compute(amount, { currency = 'USD' } = {}) {
    return this.intl.formatNumber(amount, {
      style: 'currency',
      currency
    });
  }
}
```

**Common helpers to create:**
- Date/time formatting
- Number formatting
- String manipulation
- Array operations
- Conditional logic

Helpers promote code reuse, are easier to test, and keep components focused on behavior.

Reference: [Ember Helpers](https://guides.emberjs.com/release/components/helper-functions/)
