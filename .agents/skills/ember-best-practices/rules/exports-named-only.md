---
title: No Default Exports (Except Route Templates)
impact: LOW
impactDescription: Better tree-shaking and consistency
tags: exports, modules, code-organization
---

## No Default Exports (Except Route Templates)

Use named exports instead of default exports for better tree-shaking, explicit imports, and easier refactoring. The only exception is route template files.

**Incorrect (default exports):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

export default class UserCard extends Component {
  <template>
    <div>{{@user.name}}</div>
  </template>
}```

**Correct (named exports):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

export class UserCard extends Component {
  <template>
    <div>{{@user.name}}</div>
  </template>
}```

**Why Named Exports:**

1. **Explicit Imports**: Clear what you're importing
2. **Better Tree-shaking**: Bundlers can remove unused exports
3. **Easier Refactoring**: Rename refactoring works better
4. **No Name Confusion**: Import name must match export name
5. **Multiple Exports**: Can export multiple items from one file

**For Helpers:**

```javascript
// ❌ Wrong - default export
// app/utils/format-date.js
export default function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// ✅ Correct - named export
// app/utils/format-date.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
```

**For Services:**

```javascript
// ❌ Wrong - default export
// app/services/auth.js
import Service from '@ember/service';

export default class AuthService extends Service {
  // ...
}

// ✅ Correct - named export
// app/services/auth.js
import Service from '@ember/service';

export class AuthService extends Service {
  // ...
}
```

**For Modifiers:**

```javascript
// ❌ Wrong - default export
// app/modifiers/auto-focus.js
import { modifier } from 'ember-modifier';

export default modifier((element) => {
  element.focus();
});

// ✅ Correct - named export
// app/modifiers/auto-focus.js
import { modifier } from 'ember-modifier';

export const autoFocus = modifier((element) => {
  element.focus();
});
```

**Exception: Route Templates**

Route templates are the ONLY place where default exports are used in modern Ember:

```glimmer-js
// ✅ Correct - default export for route template
// app/routes/dashboard.gjs
import Route from '@ember/routing/route';

export default class DashboardRoute extends Route {
  model() {
    return this.store.findAll('dashboard-item');
  }
}

<template>
  <div class="dashboard">
    {{#each this.model as |item|}}
      <DashboardCard @item={{item}} />
    {{/each}}
  </template>
</template>```

This is because Ember's router expects a default export from route files.

**Multiple Exports from One File:**

```javascript
// app/utils/validators.js
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhoneNumber(value) {
  return /^\d{3}-\d{3}-\d{4}$/.test(value);
}

export function isZipCode(value) {
  return /^\d{5}(-\d{4})?$/.test(value);
}

// Import specific validators
import { isEmail, isPhoneNumber } from '../utils/validators';
```

**Import Comparison:**

```javascript
// Default export - can rename arbitrarily
import MyComponent from './my-component'; // Can name it anything
import WhateverIWant from './my-component'; // Still works!

// Named export - explicit and consistent
import { MyComponent } from './my-component'; // Must use exact name
import { MyComponent as MyComp } from './my-component'; // Rename explicitly if needed
```

**Benefits for Tree-shaking:**

```javascript
// app/utils/string-utils.js
export function capitalize(text) { /* ... */ }
export function lowercase(text) { /* ... */ }
export function uppercase(text) { /* ... */ }

// Only imports what's used - unused exports can be removed
import { capitalize } from './utils/string-utils';
// capitalize is bundled, lowercase and uppercase are tree-shaken
```

Use named exports everywhere except route template files for better maintainability and optimization.

Reference: [ES Modules Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
