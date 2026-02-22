---
title: Avoid Legacy Lifecycle Hooks (did-insert, will-destroy, did-update)
impact: HIGH
impactDescription: Prevents memory leaks and enforces modern patterns
tags: components, lifecycle, anti-pattern, modifiers, derived-data
---

## Avoid Legacy Lifecycle Hooks

**Never use `{{did-insert}}`, `{{will-destroy}}`, or `{{did-update}}` in new code.** These legacy helpers create coupling between templates and component lifecycle, making code harder to test and maintain. Modern Ember provides better alternatives through derived data and custom modifiers.

### Why These Are Problematic

1. **Memory Leaks**: Easy to forget cleanup, especially with `did-insert`
2. **Tight Coupling**: Mixes template concerns with JavaScript logic
3. **Poor Testability**: Lifecycle hooks are harder to unit test
4. **Not Composable**: Can't be easily shared across components
5. **Deprecated Pattern**: Not recommended in modern Ember

### Alternative 1: Use Derived Data

For computed values or reactive transformations, use getters and `@cached`:

**❌ Incorrect (did-update):**

```glimmer-js
// app/components/user-greeting.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class UserGreeting extends Component {
  @tracked displayName = '';

  @action
  updateDisplayName() {
    // Runs on every render - inefficient and error-prone
    this.displayName = `${this.args.user.firstName} ${this.args.user.lastName}`;
  }

  <template>
    <div {{did-update this.updateDisplayName @user}}>
      Hello, {{this.displayName}}
    </div>
  </template>
}```

**✅ Correct (derived data with getter):**

```glimmer-js
// app/components/user-greeting.gjs
import Component from '@glimmer/component';

class UserGreeting extends Component {
  // Automatically reactive - updates when args change
  get displayName() {
    return `${this.args.user.firstName} ${this.args.user.lastName}`;
  }

  <template>
    <div>
      Hello, {{this.displayName}}
    </div>
  </template>
}```

**✅ Even better (use @cached for expensive computations):**

```glimmer-js
// app/components/user-stats.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class UserStats extends Component {
  @cached
  get sortedPosts() {
    // Expensive computation only runs when @posts changes
    return [...this.args.posts].sort((a, b) =>
      b.createdAt - a.createdAt
    );
  }

  @cached
  get statistics() {
    return {
      total: this.args.posts.length,
      published: this.args.posts.filter(p => p.published).length,
      drafts: this.args.posts.filter(p => !p.published).length
    };
  }

  <template>
    <div>
      <p>Total: {{this.statistics.total}}</p>
      <p>Published: {{this.statistics.published}}</p>
      <p>Drafts: {{this.statistics.drafts}}</p>

      <ul>
        {{#each this.sortedPosts as |post|}}
          <li>{{post.title}}</li>
        {{/each}}
      </ul>
    </div>
  </template>
}```

### Alternative 2: Use Custom Modifiers

For DOM side effects, element setup, or cleanup, use custom modifiers:

**❌ Incorrect (did-insert + will-destroy):**

```glimmer-js
// app/components/chart.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';

class Chart extends Component {
  chartInstance = null;

  @action
  setupChart(element) {
    this.chartInstance = new Chart(element, this.args.config);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    // Easy to forget cleanup!
    this.chartInstance?.destroy();
  }

  <template>
    <canvas {{did-insert this.setupChart}}></canvas>
  </template>
}```

**✅ Correct (custom modifier with automatic cleanup):**

```javascript
// app/modifiers/chart.js
import { modifier } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

export default modifier((element, [config]) => {
  // Setup
  const chartInstance = new Chart(element, config);

  // Cleanup happens automatically
  registerDestructor(element, () => {
    chartInstance.destroy();
  });
});
```

```glimmer-js
// app/components/chart.gjs
import chart from '../modifiers/chart';

<template>
  <canvas {{chart @config}}></canvas>
</template>```

### Alternative 3: Use Resources for Lifecycle Management

For complex state management with automatic cleanup, use `ember-resources`:

**❌ Incorrect (did-insert for data fetching):**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class UserProfile extends Component {
  @tracked userData = null;
  @tracked loading = true;
  controller = new AbortController();

  @action
  async loadUser() {
    this.loading = true;
    try {
      const response = await fetch(`/api/users/${this.args.userId}`, {
        signal: this.controller.signal
      });
      this.userData = await response.json();
    } finally {
      this.loading = false;
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.controller.abort(); // Easy to forget!
  }

  <template>
    <div {{did-insert this.loadUser}}>
      {{#if this.loading}}
        Loading...
      {{else}}
        {{this.userData.name}}
      {{/if}}
    </div>
  </template>
}```

**✅ Correct (Resource with automatic cleanup):**

```javascript
// app/resources/user-data.js
import { Resource } from 'ember-resources';
import { tracked } from '@glimmer/tracking';

export default class UserDataResource extends Resource {
  @tracked data = null;
  @tracked loading = true;
  controller = new AbortController();

  modify(positional, named) {
    const [userId] = positional;
    this.loadUser(userId);
  }

  async loadUser(userId) {
    this.loading = true;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: this.controller.signal
      });
      this.data = await response.json();
    } finally {
      this.loading = false;
    }
  }

  willDestroy() {
    // Cleanup happens automatically
    this.controller.abort();
  }
}
```

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import UserDataResource from '../resources/user-data';

class UserProfile extends Component {
  userData = UserDataResource.from(this, () => [this.args.userId]);

  <template>
    {{#if this.userData.loading}}
      Loading...
    {{else}}
      {{this.userData.data.name}}
    {{/if}}
  </template>
}```

### When to Use Each Alternative

| Use Case | Solution | Why |
|----------|----------|-----|
| Computed values | Getters + `@cached` | Reactive, efficient, no lifecycle needed |
| DOM manipulation | Custom modifiers | Encapsulated, reusable, automatic cleanup |
| Data fetching | getPromiseState from warp-drive | Declarative, automatic cleanup |
| Event listeners | `{{on}}` modifier | Built-in, automatic cleanup |
| Focus management | Custom modifier or ember-focus-trap | Proper lifecycle, accessibility |

### Migration Strategy

If you have existing code using these hooks:

1. **Identify the purpose**: What is the hook doing?
2. **Choose the right alternative**:
   - Deriving data? → Use getters/`@cached`
   - DOM setup/teardown? → Use a custom modifier
   - Async data loading? → Use getPromiseState from warp-drive
3. **Test thoroughly**: Ensure cleanup happens correctly
4. **Remove the legacy hook**: Delete `{{did-insert}}`, `{{will-destroy}}`, or `{{did-update}}`

### Performance Benefits

Modern alternatives provide better performance:

- **Getters**: Only compute when dependencies change
- **@cached**: Memoizes expensive computations
- **Modifiers**: Scoped to specific elements, composable
- **getPromiseState**: Declarative data loading, automatic cleanup

### Common Pitfalls to Avoid

❌ **Don't use `willDestroy()` for cleanup when a modifier would work**
❌ **Don't use `@action` + `did-insert` when a getter would suffice**
❌ **Don't manually track changes when `@cached` handles it automatically**
❌ **Don't forget `registerDestructor` in custom modifiers**

### Summary

Modern Ember provides superior alternatives to legacy lifecycle hooks:

- **Derived Data**: Use getters and `@cached` for reactive computations
- **DOM Side Effects**: Use custom modifiers with `registerDestructor`
- **Async Data Loading**: Use getPromiseState from warp-drive/reactiveweb
- **Better Code**: More testable, composable, and maintainable

**Never use `{{did-insert}}`, `{{will-destroy}}`, or `{{did-update}}` in new code.**

Reference:
- [Ember Modifiers](https://github.com/ember-modifier/ember-modifier)
- [warp-drive/reactiveweb](https://github.com/emberjs/data/tree/main/packages/reactiveweb)
- [Glimmer Tracking](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
