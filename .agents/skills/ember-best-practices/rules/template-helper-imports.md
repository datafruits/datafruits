---
title: Import Helpers Directly in Templates
impact: MEDIUM
impactDescription: Better tree-shaking and clarity
tags: helpers, imports, templates, gjs
---

## Import Helpers Directly in Templates

Import helpers directly in gjs/gts files for better tree-shaking, clearer dependencies, and improved type safety.

**Incorrect (global helper resolution):**

```glimmer-js
// app/components/user-profile.gjs
<template>
  <div class="profile">
    <h1>{{capitalize @user.name}}</h1>
    <p>Joined: {{format-date @user.createdAt}}</p>
    <p>Posts: {{pluralize @user.postCount "post"}}</p>
  </div>
</template>```

**Correct (explicit helper imports):**

```glimmer-js
// app/components/user-profile.gjs
import { capitalize } from 'ember-string-helpers';
import { formatDate } from 'ember-intl';
import { pluralize } from 'ember-inflector';

<template>
  <div class="profile">
    <h1>{{capitalize @user.name}}</h1>
    <p>Joined: {{formatDate @user.createdAt}}</p>
    <p>Posts: {{pluralize @user.postCount "post"}}</p>
  </div>
</template>```

**Built-in and library helpers:**

```glimmer-js
// app/components/conditional-content.gjs
import { fn, hash } from '@ember/helper'; // Actually built-in to Ember
import { eq, not } from 'ember-truth-helpers'; // From ember-truth-helpers addon

<template>
  <div class="content">
    {{#if (eq @status "active")}}
      <span class="badge">Active</span>
    {{/if}}

    {{#if (not @isLoading)}}
      <button {{on "click" (fn @onSave (hash id=@id data=@data))}}>
        Save
      </button>
    {{/if}}
  </div>
</template>```

**Custom helper with imports:**

```javascript
// app/utils/format-currency.js
export function formatCurrency(amount, { currency = 'USD' } = {}) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
```

```glimmer-js
// app/components/price-display.gjs
import { formatCurrency } from '../utils/format-currency';

<template>
  <div class="price">
    {{formatCurrency @amount currency="EUR"}}
  </div>
</template>```

**Type-safe helpers with TypeScript:**

```glimmer-ts
// app/components/typed-component.gts
import { fn } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

interface Signature {
  Args: {
    items: Array<{ id: string; name: string }>;
    onSelect: (id: string) => void;
  };
}

const TypedComponent: TOC<Signature> = <template>
  <ul>
    {{#each @items as |item|}}
      <li {{on "click" (fn @onSelect item.id)}}>
        {{item.name}}
      </li>
    {{/each}}
  </ul>
</template>;

export default TypedComponent;
```

Explicit helper imports enable better tree-shaking, make dependencies clear, and improve IDE support with proper type checking.

Reference: [Template Imports](https://github.com/ember-template-imports/ember-template-imports)
