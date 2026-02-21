---
title: No helper() Wrapper for Plain Functions
impact: LOW-MEDIUM
impactDescription: Simpler code, better performance
tags: helpers, templates, modern-ember
---

## No helper() Wrapper for Plain Functions

In modern Ember, plain functions can be used directly as helpers without wrapping them with `helper()`. The `helper()` wrapper is legacy and adds unnecessary complexity.

**Incorrect (using helper() wrapper):**

```javascript
// app/utils/format-date.js
import { helper } from '@ember/component/helper';

function formatDate([date]) {
  return new Date(date).toLocaleDateString();
}

export default helper(formatDate);
```

**Correct (plain function):**

```javascript
// app/utils/format-date.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
```

**Usage in templates:**

```glimmer-js
// app/components/post-card.gjs
import { formatDate } from '../utils/format-date';

<template>
  <article>
    <h2>{{@post.title}}</h2>
    <time>{{formatDate @post.publishedAt}}</time>
  </article>
</template>```

**With Multiple Arguments:**

```javascript
// app/utils/format-currency.js
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
```

```glimmer-js
// app/components/price.gjs
import { formatCurrency } from '../utils/format-currency';

<template>
  <span class="price">
    {{formatCurrency @amount @currency}}
  </span>
</template>```

**For Helpers that Need Services (use class-based):**

When you need dependency injection, use a class instead of `helper()`:

```javascript
// app/utils/format-relative-time.js
export class FormatRelativeTime {
  constructor(owner) {
    this.intl = owner.lookup('service:intl');
  }

  compute(date) {
    return this.intl.formatRelative(date);
  }
}
```

**Why Avoid helper():**

1. **Simpler**: Plain functions are easier to understand
2. **Standard JavaScript**: No Ember-specific wrapper needed
3. **Better Testing**: Plain functions are easier to test
4. **Performance**: No wrapper overhead
5. **Modern Pattern**: Aligns with modern Ember conventions

**Migration from helper():**

```javascript
// Before
import { helper } from '@ember/component/helper';

function capitalize([text]) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default helper(capitalize);

// After
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
```

**Common Helper Patterns:**

```javascript
// app/utils/string-helpers.js
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text, length = 50) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}
```

```glimmer-js
// Usage
import { capitalize, truncate, pluralize } from '../utils/string-helpers';

<template>
  <h1>{{capitalize @title}}</h1>
  <p>{{truncate @description 100}}</p>
  <span>{{@count}} {{pluralize @count "item" "items"}}</span>
</template>```

Plain functions are the modern way to create helpers in Ember. Only use classes when you need dependency injection.

Reference: [Ember Helpers - Plain Functions](https://guides.emberjs.com/release/components/helper-functions/)
