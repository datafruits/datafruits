---
title: Implement Smart Route Model Caching
impact: MEDIUM-HIGH
impactDescription: Reduce redundant API calls and improve UX
tags: routes, caching, performance, model
---

## Implement Smart Route Model Caching

Implement intelligent model caching strategies to reduce redundant API calls and improve user experience.

**Incorrect (always fetches fresh data):**

```glimmer-js
// app/routes/post.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;

  model(params) {
    // Always makes API call, even if we just loaded this post
    return this.store.request({ url: `/posts/${params.post_id}` });
  }

  <template>
    <article>
      <h1>{{@model.title}}</h1>
      <div>{{@model.content}}</div>
    </article>
    {{outlet}}
  </template>
}```

**Correct (with smart caching):**

```glimmer-js
// app/routes/post.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;

  model(params) {
    // Check cache first
    const cached = this.store.cache.peek({
      type: 'post',
      id: params.post_id
    });

    // Return cached if fresh (less than 5 minutes old)
    if (cached && this.isCacheFresh(cached)) {
      return cached;
    }

    // Fetch fresh data
    return this.store.request({
      url: `/posts/${params.post_id}`,
      options: { reload: true }
    });
  }

  isCacheFresh(record) {
    const cacheTime = record.meta?.cachedAt || 0;
    const fiveMinutes = 5 * 60 * 1000;
    return (Date.now() - cacheTime) < fiveMinutes;
  }

  <template>
    <article>
      <h1>{{@model.title}}</h1>
      <div>{{@model.content}}</div>
    </article>
    {{outlet}}
  </template>
}```

**Service-based caching layer:**

```javascript
// app/services/post-cache.js
import Service from '@ember/service';
import { service } from '@ember/service';
import { TrackedMap } from 'tracked-built-ins';

export default class PostCacheService extends Service {
  @service store;

  cache = new TrackedMap();
  cacheTimes = new Map();
  cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getPost(id, { forceRefresh = false } = {}) {
    const now = Date.now();
    const cacheTime = this.cacheTimes.get(id) || 0;
    const isFresh = (now - cacheTime) < this.cacheTimeout;

    if (!forceRefresh && isFresh && this.cache.has(id)) {
      return this.cache.get(id);
    }

    const post = await this.store.request({ url: `/posts/${id}` });

    this.cache.set(id, post);
    this.cacheTimes.set(id, now);

    return post;
  }

  invalidate(id) {
    this.cache.delete(id);
    this.cacheTimes.delete(id);
  }

  invalidateAll() {
    this.cache.clear();
    this.cacheTimes.clear();
  }
}
```

```glimmer-js
// app/routes/post.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service postCache;

  model(params) {
    return this.postCache.getPost(params.post_id);
  }

  // Refresh data when returning to route
  async activate() {
    super.activate(...arguments);
    const params = this.paramsFor('post');
    await this.postCache.getPost(params.post_id, { forceRefresh: true });
  }

  <template>
    <article>
      <h1>{{@model.title}}</h1>
      <div>{{@model.content}}</div>
    </article>
    {{outlet}}
  </template>
}```

**Using query params for cache control:**

```glimmer-js
// app/routes/posts.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostsRoute extends Route {
  @service store;

  queryParams = {
    refresh: { refreshModel: true }
  };

  model(params) {
    const options = params.refresh
      ? { reload: true }
      : { backgroundReload: true };

    return this.store.request({
      url: '/posts',
      options
    });
  }

  <template>
    <div class="posts">
      <button {{on "click" (fn this.refresh)}}>
        Refresh
      </button>

      <ul>
        {{#each @model as |post|}}
          <li>{{post.title}}</li>
        {{/each}}
      </ul>
    </div>
    {{outlet}}
  </template>
}```

**Background refresh pattern:**

```glimmer-js
// app/routes/dashboard.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DashboardRoute extends Route {
  @service store;

  async model() {
    // Return cached data immediately
    const cached = this.store.cache.peek({ type: 'dashboard' });

    // Refresh in background
    this.store.request({
      url: '/dashboard',
      options: { backgroundReload: true }
    });

    return cached || this.store.request({ url: '/dashboard' });
  }

  <template>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div>Stats: {{@model.stats}}</div>
    </div>
    {{outlet}}
  </template>
}```

Smart caching reduces server load, improves perceived performance, and provides better offline support while keeping data fresh.

Reference: [WarpDrive Caching](https://warp-drive.io/)
