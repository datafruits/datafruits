---
title: Use {{#each}} with @key for Lists
impact: MEDIUM
impactDescription: 50-100% faster list updates
tags: templates, each, performance, rendering
---

## Use {{#each}} with @key for Lists

Use the `key=` parameter with `{{#each}}` when objects are recreated between renders (e.g., via `.map()` or fresh API data). The default behavior uses object identity (`@identity`), which works when object references are stable.

**Incorrect (no key):**

```glimmer-js
// app/components/user-list.gjs
import UserCard from './user-card';

<template>
  <ul>
    {{#each this.users as |user|}}
      <li>
        <UserCard @user={{user}} />
      </li>
    {{/each}}
  </ul>
</template>```

**Correct (with key):**

```glimmer-js
// app/components/user-list.gjs
import UserCard from './user-card';

<template>
  <ul>
    {{#each this.users key="id" as |user|}}
      <li>
        <UserCard @user={{user}} />
      </li>
    {{/each}}
  </ul>
</template>```

**For arrays of primitives (strings, numbers):**

`@identity` is the default, so you rarely need to specify it explicitly. It compares items by value for primitives.

```glimmer-js
// app/components/tag-list.gjs
<template>
  {{! @identity is implicit, no need to write it }}
  {{#each this.tags as |tag|}}
    <span class="tag">{{tag}}</span>
  {{/each}}
</template>```

**For complex scenarios with @index:**

```glimmer-js
// app/components/item-list.gjs
<template>
  {{#each this.items key="@index" as |item index|}}
    <div data-index={{index}}>
      {{item.name}}
    </div>
  {{/each}}
</template>```

Using proper keys allows Ember's rendering engine to efficiently update, reorder, and remove items without re-rendering the entire list.

**When to use `key=`:**
- Objects recreated between renders (`.map()`, generators, fresh API responses) → use `key="id"` or similar
- High-frequency updates (animations, real-time data) → always specify a key
- Stable object references (Apollo cache, Ember Data) → default `@identity` is fine
- Items never reorder → `key="@index"` is acceptable

**Performance comparison (dbmon benchmark, 40 rows at 60fps):**
- Without key (objects recreated): Destroys/recreates DOM every frame
- With `key="data.db.id"`: DOM reuse, **2x FPS improvement**

### References: 
- [Ember API: each helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each)
- [Ember template lint: equire-each-key](https://github.com/ember-template-lint/ember-template-lint/blob/main/docs/rule/require-each-key.md)
- [Example PR showing the fps improvement on updated lists](https://github.com/universal-ember/table/pull/68)
