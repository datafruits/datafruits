---
title: Use Ember Concurrency for User Input Concurrency
impact: HIGH
impactDescription: Better control of user-initiated async operations
tags: ember-concurrency, tasks, user-input, concurrency-patterns
---

## Use Ember Concurrency for User Input Concurrency

Use ember-concurrency for managing **user-initiated** async operations like search, form submission, and autocomplete. It provides automatic cancelation, debouncing, and prevents race conditions from user actions.

**Incorrect (manual async handling with race conditions):**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Search extends Component {
  @tracked results = [];
  @tracked isSearching = false;
  @tracked error = null;
  currentRequest = null;

  @action
  async search(event) {
    const query = event.target.value;

    // Manual cancelation - easy to get wrong
    if (this.currentRequest) {
      this.currentRequest.abort();
    }

    this.isSearching = true;
    this.error = null;

    const controller = new AbortController();
    this.currentRequest = controller;

    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal
      });
      this.results = await response.json();
    } catch (e) {
      if (e.name !== 'AbortError') {
        this.error = e.message;
      }
    } finally {
      this.isSearching = false;
    }
  }

  <template>
    <input {{on "input" this.search}} />
    {{#if this.isSearching}}Loading...{{/if}}
    {{#if this.error}}Error: {{this.error}}{{/if}}
  </template>
}
```

**Correct (using ember-concurrency with task return values):**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { restartableTask } from 'ember-concurrency';

class Search extends Component {
  // restartableTask automatically cancels previous searches
  // IMPORTANT: Return the value, don't set tracked state inside tasks
  searchTask = restartableTask(async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json(); // Return, don't set @tracked
  });

  <template>
    <input {{on "input" (fn this.searchTask.perform (pick "target.value"))}} />

    {{#if this.searchTask.isRunning}}
      <div class="loading">Loading...</div>
    {{/if}}

    {{#if this.searchTask.last.isSuccessful}}
      <ul>
        {{#each this.searchTask.last.value as |result|}}
          <li>{{result.name}}</li>
        {{/each}}
      </ul>
    {{/if}}

    {{#if this.searchTask.last.isError}}
      <div class="error">{{this.searchTask.last.error.message}}</div>
    {{/if}}
  </template>
}
```

**With debouncing for user typing:**

```glimmer-js
// app/components/autocomplete.gjs
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';

class Autocomplete extends Component {
  searchTask = restartableTask(async (query) => {
    // Debounce user typing - wait 300ms
    await timeout(300);

    const response = await fetch(`/api/autocomplete?q=${query}`);
    return response.json(); // Return value, don't set tracked state
  });

  <template>
    <input
      type="search"
      {{on "input" (fn this.searchTask.perform (pick "target.value"))}}
      placeholder="Search..."
    />

    {{#if this.searchTask.isRunning}}
      <div class="spinner"></div>
    {{/if}}

    {{#if this.searchTask.lastSuccessful}}
      <ul class="suggestions">
        {{#each this.searchTask.lastSuccessful.value as |item|}}
          <li>{{item.title}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}
```

**Task modifiers for different user concurrency patterns:**

```glimmer-js
import Component from '@glimmer/component';
import { dropTask, enqueueTask, restartableTask } from 'ember-concurrency';

class FormActions extends Component {
  // dropTask: Prevents double-click - ignores new while running
  saveTask = dropTask(async (data) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  });

  // enqueueTask: Queues user actions sequentially
  processTask = enqueueTask(async (item) => {
    const response = await fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify(item)
    });
    return response.json();
  });

  // restartableTask: Cancels previous, starts new (for search)
  searchTask = restartableTask(async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  });

  <template>
    <button
      {{on "click" (fn this.saveTask.perform @data)}}
      disabled={{this.saveTask.isRunning}}
    >
      Save
    </button>
  </template>
}
```

**Key Principles for ember-concurrency:**

1. **User-initiated only** - Use for handling user actions, not component initialization
2. **Return values** - Use `task.last.value`, never set `@tracked` state inside tasks
3. **Avoid side effects** - Don't modify component state that's read during render inside tasks
4. **Choose right modifier**:
   - `restartableTask` - User typing/search (cancel previous)
   - `dropTask` - Form submit/save (prevent double-click)
   - `enqueueTask` - Sequential processing (queue user actions)

**When NOT to use ember-concurrency:**

- ❌ Component initialization data loading (use `getPromiseState` instead)
- ❌ Setting tracked state inside tasks (causes infinite render loops)
- ❌ Route model hooks (return promises directly)
- ❌ Simple async without user concurrency concerns (use async/await)

See **advanced-data-loading-with-ember-concurrency.md** for correct data loading patterns.

ember-concurrency provides automatic cancelation, derived state (isRunning, isIdle), and better patterns for **user-initiated** async operations.

Reference: [ember-concurrency](https://ember-concurrency.com/)
