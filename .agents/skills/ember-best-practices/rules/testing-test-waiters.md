---
title: Use Test Waiters for Async Operations
impact: HIGH
impactDescription: Reliable tests that don't depend on implementation details
tags: testing, async, test-waiters, waitFor, settled
---

## Use Test Waiters for Async Operations

Instrument async code with test waiters instead of using `waitFor()` or `waitUntil()` in tests. Test waiters abstract async implementation details so tests focus on user behavior rather than timing.

**Why Test Waiters Matter:**

Test waiters allow `settled()` and other test helpers to automatically wait for your async operations. This means:
- Tests don't need to know about implementation details (timeouts, polling intervals, etc.)
- Tests are written from a user's perspective ("click button, see result")
- Code refactoring doesn't break tests
- Tests are more reliable and less flaky

**Incorrect (testing implementation details):**

```glimmer-js
// tests/integration/components/data-loader-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor } from '@ember/test-helpers';
import DataLoader from 'my-app/components/data-loader';

module('Integration | Component | data-loader', function(hooks) {
  setupRenderingTest(hooks);

  test('it loads data', async function(assert) {
    await render(<template><DataLoader /></template>);

    await click('[data-test-load-button]');

    // BAD: Test knows about implementation details
    // If the component changes from polling every 100ms to 200ms, test breaks
    await waitFor('[data-test-data]', { timeout: 5000 });

    assert.dom('[data-test-data]').hasText('Loaded data');
  });
});
```

**Correct (using test waiters):**

```glimmer-js
// app/components/data-loader.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('data-loader');

export class DataLoader extends Component {
  @tracked data = null;
  @tracked isLoading = false;

  loadData = async () => {
    // Register the async operation with test waiter
    const token = waiter.beginAsync();

    try {
      this.isLoading = true;

      // Simulate async data loading
      const response = await fetch('/api/data');
      this.data = await response.json();
    } finally {
      this.isLoading = false;
      // Always end the async operation, even on error
      waiter.endAsync(token);
    }
  };

  <template>
    <div>
      <button {{on "click" this.loadData}} data-test-load-button>
        Load Data
      </button>

      {{#if this.isLoading}}
        <div data-test-loading>Loading...</div>
      {{/if}}

      {{#if this.data}}
        <div data-test-data>{{this.data}}</div>
      {{/if}}
    </div>
  </template>
}
```

```glimmer-js
// tests/integration/components/data-loader-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import DataLoader from 'my-app/components/data-loader';

module('Integration | Component | data-loader', function(hooks) {
  setupRenderingTest(hooks);

  test('it loads data', async function(assert) {
    await render(<template><DataLoader /></template>);

    await click('[data-test-load-button]');

    // GOOD: settled() automatically waits for test waiters
    // No knowledge of timing needed - tests from user's perspective
    await settled();

    assert.dom('[data-test-data]').hasText('Loaded data');
  });
});
```

**Test waiter with cleanup:**

```glimmer-js
// app/components/polling-widget.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('polling-widget');

export class PollingWidget extends Component {
  @tracked status = 'idle';
  intervalId = null;
  token = null;

  constructor(owner, args) {
    super(owner, args);

    registerDestructor(this, () => {
      this.stopPolling();
    });
  }

  startPolling = () => {
    // Register async operation
    this.token = waiter.beginAsync();

    this.intervalId = setInterval(() => {
      this.checkStatus();
    }, 1000);
  };

  stopPolling = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // End async operation on cleanup
    if (this.token) {
      waiter.endAsync(this.token);
      this.token = null;
    }
  };

  checkStatus = async () => {
    const response = await fetch('/api/status');
    this.status = await response.text();

    if (this.status === 'complete') {
      this.stopPolling();
    }
  };

  <template>
    <div>
      <button {{on "click" this.startPolling}} data-test-start>
        Start Polling
      </button>
      <div data-test-status>{{this.status}}</div>
    </div>
  </template>
}
```

**Test waiter with Services:**

```glimmer-js
// app/services/data-sync.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('data-sync-service');

export class DataSyncService extends Service {
  @tracked isSyncing = false;

  async sync() {
    const token = waiter.beginAsync();

    try {
      this.isSyncing = true;

      const response = await fetch('/api/sync', { method: 'POST' });
      const result = await response.json();

      return result;
    } finally {
      this.isSyncing = false;
      waiter.endAsync(token);
    }
  }
}
```

```glimmer-js
// tests/unit/services/data-sync-test.js
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

module('Unit | Service | data-sync', function(hooks) {
  setupTest(hooks);

  test('it syncs data', async function(assert) {
    const service = this.owner.lookup('service:data-sync');

    // Start async operation
    const syncPromise = service.sync();

    // No need for manual waiting - settled() handles it
    await settled();

    const result = await syncPromise;
    assert.ok(result, 'Sync completed successfully');
  });
});
```

**Multiple concurrent operations:**

```glimmer-js
// app/components/parallel-loader.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('parallel-loader');

export class ParallelLoader extends Component {
  @tracked results = [];

  loadAll = async () => {
    const urls = ['/api/data1', '/api/data2', '/api/data3'];

    // Each request gets its own token
    const requests = urls.map(async (url) => {
      const token = waiter.beginAsync();

      try {
        const response = await fetch(url);
        return await response.json();
      } finally {
        waiter.endAsync(token);
      }
    });

    this.results = await Promise.all(requests);
  };

  <template>
    <button {{on "click" this.loadAll}} data-test-load-all>
      Load All
    </button>

    {{#each this.results as |result|}}
      <div data-test-result>{{result}}</div>
    {{/each}}
  </template>
}
```

**Benefits:**

1. **User-focused tests**: Tests describe user actions, not implementation
2. **Resilient to refactoring**: Change timing/polling without breaking tests
3. **No arbitrary timeouts**: Tests complete as soon as operations finish
4. **Automatic waiting**: `settled()`, `click()`, etc. wait for all registered operations
5. **Better debugging**: Test waiters show pending operations when tests hang

**When to use test waiters:**

- Network requests (fetch, XHR)
- Timers and intervals (setTimeout, setInterval)
- Animations and transitions
- Polling operations
- Any async operation that affects rendered output

**When NOT needed:**

- ember-concurrency already registers test waiters automatically
- Promises that complete before render (data preparation in constructors)
- Operations that don't affect the DOM or component state

**Key principle:** If your code does something async that users care about, register it with a test waiter. Tests should never use `waitFor()` or `waitUntil()` - those are code smells indicating missing test waiters.

Reference: [@ember/test-waiters](https://github.com/emberjs/ember-test-waiters)
