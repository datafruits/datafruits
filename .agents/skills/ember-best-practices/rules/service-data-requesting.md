---
title: Implement Robust Data Requesting Patterns
category: service
impact: HIGH
---

# Implement Robust Data Requesting Patterns

Use proper patterns for data fetching including parallel requests, error handling, request cancellation, and retry logic.

## Problem

Naive data fetching creates waterfall requests, doesn't handle errors properly, and can cause race conditions or memory leaks from uncanceled requests.

**Incorrect:**
```javascript
// app/routes/dashboard.js
import Route from '@ember/routing/route';

export default class DashboardRoute extends Route {
  async model() {
    // Sequential waterfall - slow!
    const user = await this.store.request({ url: '/users/me' });
    const posts = await this.store.request({ url: '/posts' });
    const notifications = await this.store.request({ url: '/notifications' });

    // No error handling
    // No cancellation
    return { user, posts, notifications };
  }
}
```

## Solution: Parallel Requests

Use `RSVP.hash` or `Promise.all` for parallel loading:

```javascript
// app/routes/dashboard.js
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class DashboardRoute extends Route {
  async model() {
    return hash({
      user: this.store.request({ url: '/users/me' }),
      posts: this.store.request({ url: '/posts?recent=true' }),
      notifications: this.store.request({ url: '/notifications?unread=true' })
    });
  }
}
```

## Error Handling Pattern

Handle errors gracefully with fallbacks:

```javascript
// app/services/api.js
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApiService extends Service {
  @service store;
  @tracked lastError = null;

  async fetchWithFallback(url, fallback = null) {
    try {
      const response = await this.store.request({ url });
      this.lastError = null;
      return response.content;
    } catch (error) {
      this.lastError = error.message;
      console.error(`API Error fetching ${url}:`, error);
      return fallback;
    }
  }

  async fetchWithRetry(url, { maxRetries = 3, delay = 1000 } = {}) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.store.request({ url });
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
      }
    }
  }
}
```

## Request Cancellation with AbortController

Prevent race conditions by canceling stale requests:

```glimmer-js
// app/components/search-results.gjs
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';

class SearchResults extends Component {
  @service store;
  @tracked results = [];

  // Automatically cancels previous searches
  @restartableTask
  *searchTask(query) {
    yield timeout(300); // Debounce

    try {
      const response = yield this.store.request({
        url: `/search?q=${encodeURIComponent(query)}`
      });
      this.results = response.content;
    } catch (error) {
      if (error.name !== 'TaskCancelation') {
        console.error('Search failed:', error);
      }
    }
  }

  <template>
    <input
      type="search"
      {{on "input" (fn this.searchTask.perform @value)}}
      placeholder="Search..."
    />

    {{#if this.searchTask.isRunning}}
      <div class="loading">Searching...</div>
    {{else}}
      <ul>
        {{#each this.results as |result|}}
          <li>{{result.title}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}```

## Manual AbortController Pattern

For non-ember-concurrency scenarios:

```javascript
// app/services/data-fetcher.js
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

export default class DataFetcherService extends Service {
  @service store;
  @tracked data = null;
  @tracked isLoading = false;

  abortController = null;

  constructor() {
    super(...arguments);
    registerDestructor(this, () => {
      this.abortController?.abort();
    });
  }

  async fetch(url) {
    // Cancel previous request
    this.abortController?.abort();
    this.abortController = new AbortController();

    this.isLoading = true;
    try {
      // Note: WarpDrive handles AbortSignal internally
      const response = await this.store.request({
        url,
        signal: this.abortController.signal
      });
      this.data = response.content;
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    } finally {
      this.isLoading = false;
    }
  }
}
```

## Dependent Requests Pattern

When requests depend on previous results:

```javascript
// app/routes/post.js
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class PostRoute extends Route {
  async model({ post_id }) {
    // First fetch the post
    const post = await this.store.request({
      url: `/posts/${post_id}`
    });

    // Then fetch related data in parallel
    return hash({
      post,
      author: this.store.request({
        url: `/users/${post.content.authorId}`
      }),
      comments: this.store.request({
        url: `/posts/${post_id}/comments`
      }),
      relatedPosts: this.store.request({
        url: `/posts/${post_id}/related`
      })
    });
  }
}
```

## Polling Pattern

For real-time data updates:

```javascript
// app/services/live-data.js
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

export default class LiveDataService extends Service {
  @service store;
  @tracked data = null;

  intervalId = null;

  constructor() {
    super(...arguments);
    registerDestructor(this, () => {
      this.stopPolling();
    });
  }

  startPolling(url, interval = 5000) {
    this.stopPolling();

    this.poll(url); // Initial fetch
    this.intervalId = setInterval(() => this.poll(url), interval);
  }

  async poll(url) {
    try {
      const response = await this.store.request({ url });
      this.data = response.content;
    } catch (error) {
      console.error('Polling error:', error);
    }
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
```

## Batch Requests

Optimize multiple similar requests:

```javascript
// app/services/batch-loader.js
import Service, { service } from '@ember/service';

export default class BatchLoaderService extends Service {
  @service store;

  pendingIds = new Set();
  batchTimeout = null;

  async loadUser(id) {
    this.pendingIds.add(id);

    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => this.executeBatch(), 50);
    }

    // Return a promise that resolves when batch completes
    return new Promise((resolve) => {
      this.registerCallback(id, resolve);
    });
  }

  async executeBatch() {
    const ids = Array.from(this.pendingIds);
    this.pendingIds.clear();
    this.batchTimeout = null;

    const response = await this.store.request({
      url: `/users?ids=${ids.join(',')}`
    });

    // Resolve all pending promises
    response.content.forEach(user => {
      this.resolveCallback(user.id, user);
    });
  }
}
```

## Performance Impact

- **Parallel requests (RSVP.hash)**: 60-80% faster than sequential
- **Request cancellation**: Prevents memory leaks and race conditions
- **Retry logic**: Improves reliability with < 5% overhead
- **Batch loading**: 40-70% reduction in requests

## When to Use

- **RSVP.hash**: Independent data that can load in parallel
- **ember-concurrency**: Search, autocomplete, or user-driven requests
- **AbortController**: Long-running requests that may become stale
- **Retry logic**: Critical data with transient network issues
- **Batch loading**: Loading many similar items (N+1 scenarios)

## References

- [WarpDrive Documentation](https://warp-drive.io/)
- [ember-concurrency](https://ember-concurrency.com/)
- [RSVP.js](https://github.com/tildeio/rsvp.js)
- [AbortController MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
