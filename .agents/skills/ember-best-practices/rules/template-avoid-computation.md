---
title: Avoid Heavy Computation in Templates
impact: MEDIUM
impactDescription: 40-60% reduction in render time
tags: templates, performance, getters, helpers
---

## Avoid Heavy Computation in Templates

Move expensive computations from templates to cached getters in the component class or in-scope functions for template-only components. Templates should only display data, not compute it. Keep templates easy for humans to read by minimizing nested function invocations.

**Why this matters:**
- Templates should be easy to read and understand
- Nested function calls create cognitive overhead
- Computations should be cached and reused, not recalculated on every render
- Template-only components (without `this`) need alternative patterns

**Incorrect (heavy computation in template):**

```glimmer-js
// app/components/stats.gjs
import { sum, map, div, max, multiply, sortBy } from '../helpers/math';

<template>
  <div>
    <p>Total: {{sum (map @items "price")}}</p>
    <p>Average: {{div (sum (map @items "price")) @items.length}}</p>
    <p>Max: {{max (map @items "price")}}</p>

    {{#each (sortBy "name" @items) as |item|}}
      <div>{{item.name}}: {{multiply item.price item.quantity}}</div>
    {{/each}}
  </div>
</template>```

**Correct (computation in component with cached getters):**

```glimmer-js
// app/components/stats.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

export class Stats extends Component {
  // @cached is useful when getters are accessed multiple times
  // For single access, regular getters are sufficient

  @cached
  get total() {
    return this.args.items.reduce((sum, item) => sum + item.price, 0);
  }

  get average() {
    // No @cached needed if only accessed once in template
    return this.args.items.length > 0
      ? this.total / this.args.items.length
      : 0;
  }

  get maxPrice() {
    return Math.max(...this.args.items.map(item => item.price));
  }

  @cached
  get sortedItems() {
    // @cached useful here as it's used by itemsWithTotal
    return [...this.args.items].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  @cached
  get itemsWithTotal() {
    // @cached useful as accessed multiple times in {{#each}}
    return this.sortedItems.map(item => ({
      ...item,
      total: item.price * item.quantity
    }));
  }

  <template>
    <div>
      <p>Total: {{this.total}}</p>
      <p>Average: {{this.average}}</p>
      <p>Max: {{this.maxPrice}}</p>

      {{#each this.itemsWithTotal key="id" as |item|}}
        <div>{{item.name}}: {{item.total}}</div>
      {{/each}}
    </div>
  </template>
}
```

**Note on @cached**: Use `@cached` when a getter is accessed multiple times (like in `{{#each}}` loops or by other getters). For getters accessed only once, regular getters are sufficient and avoid unnecessary memoization overhead.

Moving computations to getters ensures they run only when dependencies change, not on every render. Templates remain clean and readable.
