---
title: Cache API Responses in Services
impact: MEDIUM-HIGH
impactDescription: 50-90% reduction in duplicate requests
tags: services, caching, performance, api
---

## Cache API Responses in Services

Cache API responses in services to avoid duplicate network requests. Use tracked properties to make the cache reactive.

**Incorrect (no caching):**

```javascript
// app/services/user.js
import Service from '@ember/service';
import { service } from '@ember/service';

export default class UserService extends Service {
  @service store;

  async getCurrentUser() {
    // Fetches from API every time
    return this.store.request({ url: '/users/me' });
  }
}
```

**Correct (with caching):**

```javascript
// app/services/user.js
import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackedMap } from 'tracked-built-ins';

export default class UserService extends Service {
  @service store;

  @tracked currentUser = null;
  cache = new TrackedMap();

  async getCurrentUser() {
    if (!this.currentUser) {
      const response = await this.store.request({ url: '/users/me' });
      this.currentUser = response.content.data;
    }
    return this.currentUser;
  }

  async getUser(id) {
    if (!this.cache.has(id)) {
      const response = await this.store.request({ url: `/users/${id}` });
      this.cache.set(id, response.content.data);
    }
    return this.cache.get(id);
  }

  clearCache() {
    this.currentUser = null;
    this.cache.clear();
  }
}
```

**For time-based cache invalidation:**

```javascript
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DataService extends Service {
  @tracked _cache = null;
  _cacheTimestamp = null;
  _cacheDuration = 5 * 60 * 1000; // 5 minutes

  async getData() {
    const now = Date.now();
    const isCacheValid = this._cache &&
      this._cacheTimestamp &&
      (now - this._cacheTimestamp) < this._cacheDuration;

    if (!isCacheValid) {
      this._cache = await this.fetchData();
      this._cacheTimestamp = now;
    }

    return this._cache;
  }

  async fetchData() {
    const response = await fetch('/api/data');
    return response.json();
  }
}
```

Caching in services prevents duplicate API requests and improves performance significantly.
