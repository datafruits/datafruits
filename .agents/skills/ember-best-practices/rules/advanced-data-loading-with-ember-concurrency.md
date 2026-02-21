---
title: Use Ember Concurrency Correctly - User Concurrency Not Data Loading
impact: HIGH
impactDescription: Prevents infinite render loops and improves performance
tags: ember-concurrency, tasks, data-loading, anti-pattern
---

## Use Ember Concurrency Correctly - User Concurrency Not Data Loading

ember-concurrency is designed for **user-initiated concurrency patterns** (debouncing, throttling, preventing double-clicks), not data loading. Use task return values, don't set tracked state inside tasks.

**Incorrect (using ember-concurrency for data loading with tracked state):**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

class UserProfile extends Component {
  @tracked userData = null;
  @tracked error = null;

  // WRONG: Setting tracked state inside task
  loadUserTask = task(async () => {
    try {
      const response = await fetch(`/api/users/${this.args.userId}`);
      this.userData = await response.json(); // Anti-pattern!
    } catch (e) {
      this.error = e; // Anti-pattern!
    }
  });

  <template>
    {{#if this.loadUserTask.isRunning}}
      Loading...
    {{else if this.userData}}
      <h1>{{this.userData.name}}</h1>
    {{/if}}
  </template>
}
```

**Why This Is Wrong:**
- Setting tracked state during render can cause infinite render loops
- ember-concurrency adds overhead unnecessary for simple data loading
- Makes component state harder to reason about
- Can trigger multiple re-renders

**Correct (use getPromiseState from warp-drive/reactiveweb for data loading):**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { getPromiseState } from '@warp-drive/reactiveweb';

class UserProfile extends Component {
  @cached
  get userData() {
    const promise = fetch(`/api/users/${this.args.userId}`)
      .then(r => r.json());
    return getPromiseState(promise);
  }

  <template>
    {{#if this.userData.isPending}}
      <div>Loading...</div>
    {{else if this.userData.isRejected}}
      <div>Error: {{this.userData.error.message}}</div>
    {{else if this.userData.isFulfilled}}
      <h1>{{this.userData.value.name}}</h1>
    {{/if}}
  </template>
}
```

**Correct (use ember-concurrency for USER input with derived data patterns):**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';
import { on } from '@ember/modifier';
import { pick } from 'ember-composable-helpers';

class Search extends Component {
  // CORRECT: For user-initiated search with debouncing
  // Use derived data from TaskInstance API - lastSuccessful
  searchTask = restartableTask(async (query) => {
    await timeout(300); // Debounce user typing
    const response = await fetch(`/api/search?q=${query}`);
    return response.json(); // Return value, don't set tracked state
  });

  <template>
    <input
      type="search"
      {{on "input" (fn this.searchTask.perform (pick "target.value"))}}
    />

    {{! Use derived data from task state - no tracked properties needed }}
    {{#if this.searchTask.isRunning}}
      <div>Searching...</div>
    {{/if}}

    {{! lastSuccessful persists previous results while new search runs }}
    {{#if this.searchTask.lastSuccessful}}
      <ul>
        {{#each this.searchTask.lastSuccessful.value as |result|}}
          <li>{{result.name}}</li>
        {{/each}}
      </ul>
    {{/if}}

    {{! Show error from most recent failed attempt }}
    {{#if this.searchTask.last.isError}}
      <div>Error: {{this.searchTask.last.error.message}}</div>
    {{/if}}
  </template>
}
```

**Good Use Cases for ember-concurrency:**

1. **User input debouncing** - prevent API spam from typing
2. **Form submission** - prevent double-click submits with `dropTask`
3. **Autocomplete** - restart previous searches as user types
4. **Polling** - user-controlled refresh intervals
5. **Multi-step wizards** - sequential async operations

```glimmer-js
// app/components/form-submit.gjs
import Component from '@glimmer/component';
import { dropTask } from 'ember-concurrency';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

class FormSubmit extends Component {
  // dropTask prevents double-submit - perfect for user actions
  submitTask = dropTask(async (formData) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return response.json();
  });

  <template>
    <button
      {{on "click" (fn this.submitTask.perform @formData)}}
      disabled={{this.submitTask.isRunning}}
    >
      {{#if this.submitTask.isRunning}}
        Saving...
      {{else}}
        Save
      {{/if}}
    </button>

    {{! Use lastSuccessful for success message - derived data }}
    {{#if this.submitTask.lastSuccessful}}
      <div>Saved successfully!</div>
    {{/if}}

    {{#if this.submitTask.last.isError}}
      <div>Error: {{this.submitTask.last.error.message}}</div>
    {{/if}}
  </template>
}
```

**Bad Use Cases for ember-concurrency:**

1. ❌ **Loading data on component init** - use `getPromiseState` instead
2. ❌ **Route model hooks** - just return promises directly
3. ❌ **Simple API calls** - async/await is sufficient
4. ❌ **Setting tracked state inside tasks** - causes render loops

**Key Principles:**

- **Derive data, don't set it** - Use `task.lastSuccessful`, `task.last`, `task.isRunning` (derived from TaskInstance API)
- **Use task return values** - Read from `task.lastSuccessful.value` or `task.last.value`, never set tracked state
- **User-initiated only** - ember-concurrency is for handling user concurrency patterns
- **Data loading** - Use `getPromiseState` from warp-drive/reactiveweb for non-user-initiated loading
- **Avoid side effects** - Don't modify component state inside tasks that's read during render

**TaskInstance API for Derived Data:**

ember-concurrency provides a powerful derived data API through Task and TaskInstance:

- `task.last` - The most recent TaskInstance (successful or failed)
- `task.lastSuccessful` - The most recent successful TaskInstance (persists during new attempts)
- `task.isRunning` - Derived boolean if any instance is running
- `taskInstance.value` - The returned value from the task
- `taskInstance.isError` - Derived boolean if this instance failed
- `taskInstance.error` - The error if this instance failed

This follows the **derived data pattern** - all state comes from the task itself, no tracked properties needed!

References:
- [TaskInstance API](https://ember-concurrency.com/api/TaskInstance.html)
- [Task API](https://ember-concurrency.com/api/Task.html)

**Migration from tracked state pattern:**

```glimmer-js
// BEFORE (anti-pattern - setting tracked state)
class Bad extends Component {
  @tracked data = null;

  fetchTask = task(async () => {
    this.data = await fetch('/api/data').then(r => r.json());
  });

  // template reads: {{this.data}}
}

// AFTER (correct - using derived data from TaskInstance API)
class Good extends Component {
  fetchTask = restartableTask(async () => {
    return fetch('/api/data').then(r => r.json());
  });

  // template reads: {{this.fetchTask.lastSuccessful.value}}
  // All state derived from task - no tracked properties!
}

// Or better yet, for non-user-initiated loading:
class Better extends Component {
  @cached
  get data() {
    return getPromiseState(fetch('/api/data').then(r => r.json()));
  }

  // template reads: {{#if this.data.isFulfilled}}{{this.data.value}}{{/if}}
}
```

ember-concurrency is a powerful tool for **user concurrency patterns**. For data loading, use `getPromiseState` instead.

Reference:
- [ember-concurrency](https://ember-concurrency.com/)
- [warp-drive/reactiveweb](https://github.com/emberjs/data/tree/main/packages/reactiveweb)
