---
title: Compose Helpers for Reusable Logic
impact: MEDIUM-HIGH
impactDescription: Better code reuse and testability
tags: helpers, composition, functions, pipes, reusability
---

## Compose Helpers for Reusable Logic

Compose helpers to create reusable, testable logic that can be combined in templates and components.

**Incorrect (logic duplicated in templates):**

```glimmer-js
// app/components/user-profile.gjs
<template>
  <div class="profile">
    <h1>{{uppercase (truncate @user.name 20)}}</h1>

    {{#if (and @user.isActive (not @user.isDeleted))}}
      <span class="status">Active</span>
    {{/if}}

    <p>{{lowercase @user.email}}</p>

    {{#if (gt @user.posts.length 0)}}
      <span>Posts: {{@user.posts.length}}</span>
    {{/if}}
  </div>
</template>
```

**Correct (composed helpers):**

```javascript
// app/helpers/display-name.js
export function displayName(name, { maxLength = 20 } = {}) {
  if (!name) return '';

  const truncated = name.length > maxLength
    ? name.slice(0, maxLength) + '...'
    : name;

  return truncated.toUpperCase();
}
```

```javascript
// app/helpers/is-visible-user.js
export function isVisibleUser(user) {
  return user && user.isActive && !user.isDeleted;
}
```

```javascript
// app/helpers/format-email.js
export function formatEmail(email) {
  return email?.toLowerCase() || '';
}
```

```glimmer-js
// app/components/user-profile.gjs
import { displayName } from '../helpers/display-name';
import { isVisibleUser } from '../helpers/is-visible-user';
import { formatEmail } from '../helpers/format-email';

<template>
  <div class="profile">
    <h1>{{displayName @user.name}}</h1>

    {{#if (isVisibleUser @user)}}
      <span class="status">Active</span>
    {{/if}}

    <p>{{formatEmail @user.email}}</p>

    {{#if (gt @user.posts.length 0)}}
      <span>Posts: {{@user.posts.length}}</span>
    {{/if}}
  </div>
</template>
```

**Functional composition with pipe helper:**

```javascript
// app/helpers/pipe.js
export function pipe(...fns) {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}
```

**Or use a compose helper:**

```javascript
// app/helpers/compose.js
export function compose(...helperFns) {
  return (value) => helperFns.reduceRight((acc, fn) => fn(acc), value);
}
```

**Usage:**

```glimmer-js
// app/components/text-processor.gjs
import { fn } from '@ember/helper';

// Individual helpers
const uppercase = (str) => str?.toUpperCase() || '';
const trim = (str) => str?.trim() || '';
const truncate = (str, length = 20) => str?.slice(0, length) || '';

<template>
  {{! Compose multiple transformations }}
  <div>
    {{pipe @text (fn trim) (fn uppercase) (fn truncate 50)}}
  </div>
</template>
```

**Higher-order helpers:**

```javascript
// app/helpers/partial-apply.js
export function partialApply(fn, ...args) {
  return (...moreArgs) => fn(...args, ...moreArgs);
}
```

```javascript
// app/helpers/map-by.js
export function mapBy(array, property) {
  return array?.map(item => item[property]) || [];
}
```

```glimmer-js
// Usage in template
import { mapBy } from '../helpers/map-by';
import { partialApply } from '../helpers/partial-apply';

<template>
  {{! Extract property from array }}
  <ul>
    {{#each (mapBy @users "name") as |name|}}
      <li>{{name}}</li>
    {{/each}}
  </ul>

  {{! Partial application }}
  {{#let (partialApply @formatNumber 2) as |formatTwoDecimals|}}
    <span>Price: {{formatTwoDecimals @price}}</span>
  {{/let}}
</template>
```

**Chainable transformation helpers:**

```javascript
// app/helpers/transform.js
class Transform {
  constructor(value) {
    this.value = value;
  }

  filter(fn) {
    this.value = this.value?.filter(fn) || [];
    return this;
  }

  map(fn) {
    this.value = this.value?.map(fn) || [];
    return this;
  }

  sort(fn) {
    this.value = [...(this.value || [])].sort(fn);
    return this;
  }

  take(n) {
    this.value = this.value?.slice(0, n) || [];
    return this;
  }

  get result() {
    return this.value;
  }
}

export function transform(value) {
  return new Transform(value);
}
```

```glimmer-js
// Usage
import { transform } from '../helpers/transform';

<template>
  {{#let (transform @items) as |t|}}
    {{#each t.filter((i) => i.active).sort((a, b) => a.name.localeCompare(b.name)).take(10).result as |item|}}
      <div>{{item.name}}</div>
    {{/each}}
  {{/let}}
</template>
```

**Conditional composition:**

```javascript
// app/helpers/when.js
export function when(condition, trueFn, falseFn) {
  return condition ? trueFn() : (falseFn ? falseFn() : null);
}
```

```javascript
// app/helpers/unless.js
export function unless(condition, falseFn, trueFn) {
  return !condition ? falseFn() : (trueFn ? trueFn() : null);
}
```

**Testing composed helpers:**

```javascript
// tests/helpers/display-name-test.js
import { module, test } from 'qunit';
import { displayName } from 'my-app/helpers/display-name';

module('Unit | Helper | display-name', function() {
  test('it formats name correctly', function(assert) {
    assert.strictEqual(
      displayName('John Doe'),
      'JOHN DOE'
    );
  });

  test('it truncates long names', function(assert) {
    assert.strictEqual(
      displayName('A Very Long Name That Should Be Truncated', { maxLength: 10 }),
      'A VERY LON...'
    );
  });

  test('it handles null', function(assert) {
    assert.strictEqual(displayName(null), '');
  });
});
```

Composed helpers provide testable, reusable logic that keeps templates clean and components focused on behavior rather than data transformation.

Reference: [Ember Helpers](https://guides.emberjs.com/release/components/helper-functions/)
