---
title: MSW (Mock Service Worker) Setup for Testing
impact: HIGH
impactDescription: Proper API mocking without ORM complexity
tags: testing, msw, api-mocking, mock-service-worker
---

## MSW (Mock Service Worker) Setup for Testing

Use MSW (Mock Service Worker) for API mocking in tests. MSW provides a cleaner approach than Mirage by intercepting requests at the network level without introducing unnecessary ORM patterns or abstractions.

**Incorrect (using Mirage with ORM complexity):**

```javascript
// mirage/config.js
export default function() {
  this.namespace = '/api';

  // Complex schema and factories
  this.get('/users', (schema) => {
    return schema.users.all();
  });

  // Need to maintain schema, factories, serializers
  this.post('/users', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);
    return schema.users.create(attrs);
  });
}
```

**Correct (using MSW with simple network mocking):**

```javascript
// tests/helpers/msw.js
import { http, HttpResponse } from 'msw';

// Simple request/response mocking
export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
  }),

  http.post('/api/users', async ({ request }) => {
    const user = await request.json();
    return HttpResponse.json({ id: 3, ...user }, { status: 201 });
  })
];
```

**Why MSW over Mirage:**

- **Better conventions** - Mock at the network level, not with an ORM
- **Simpler mental model** - Define request handlers, return responses
- **Doesn't lead developers astray** - No schema migrations or factories to maintain
- **Works everywhere** - Same mocks work in tests, Storybook, and development
- **More realistic** - Actually intercepts fetch/XMLHttpRequest

Reference: [Ember.js Community Discussion on MSW](https://discuss.emberjs.com/t/my-cookbook-for-various-emberjs-things/19679)

### Installation

```bash
npm install --save-dev msw
```

### Setup Test Helper

Create a test helper to set up MSW in your tests:

```javascript
// tests/helpers/msw.js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Define default handlers that apply to all tests
const defaultHandlers = [
  // Add default handlers here if needed
];

export function setupMSW(hooks, handlers = []) {
  const server = setupServer(...defaultHandlers, ...handlers);

  hooks.beforeEach(function() {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  hooks.afterEach(function() {
    server.resetHandlers();
  });

  hooks.after(function() {
    server.close();
  });

  return { server };
}

// Re-export for convenience
export { http, HttpResponse };
```

### Basic Usage in Tests

```javascript
// tests/acceptance/users-test.js
import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMSW, http, HttpResponse } from 'my-app/tests/helpers/msw';

module('Acceptance | users', function(hooks) {
  setupApplicationTest(hooks);
  const { server } = setupMSW(hooks);

  test('displays list of users', async function(assert) {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({
          data: [
            {
              id: '1',
              type: 'user',
              attributes: { name: 'Alice', email: 'alice@example.com' }
            },
            {
              id: '2',
              type: 'user',
              attributes: { name: 'Bob', email: 'bob@example.com' }
            }
          ]
        });
      })
    );

    await visit('/users');

    assert.strictEqual(currentURL(), '/users');
    assert.dom('[data-test-user-item]').exists({ count: 2 });
    assert.dom('[data-test-user-name]').hasText('Alice');
  });

  test('handles server errors gracefully', async function(assert) {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json(
          { errors: [{ title: 'Server Error' }] },
          { status: 500 }
        );
      })
    );

    await visit('/users');

    assert.dom('[data-test-error-message]').exists();
    assert.dom('[data-test-error-message]').containsText('Server Error');
  });
});
```

### Mocking POST/PUT/DELETE Requests

```javascript
import { visit, click, fillIn } from '@ember/test-helpers';

test('creates a new user', async function(assert) {
  let capturedRequest = null;

  server.use(
    http.post('/api/users', async ({ request }) => {
      capturedRequest = await request.json();

      return HttpResponse.json({
        data: {
          id: '3',
          type: 'user',
          attributes: capturedRequest.data.attributes
        }
      }, { status: 201 });
    })
  );

  await visit('/users/new');
  await fillIn('[data-test-name-input]', 'Charlie');
  await fillIn('[data-test-email-input]', 'charlie@example.com');
  await click('[data-test-submit-button]');

  assert.strictEqual(currentURL(), '/users/3');
  assert.deepEqual(capturedRequest.data.attributes, {
    name: 'Charlie',
    email: 'charlie@example.com'
  });
});

test('updates an existing user', async function(assert) {
  server.use(
    http.get('/api/users/1', () => {
      return HttpResponse.json({
        data: {
          id: '1',
          type: 'user',
          attributes: { name: 'Alice', email: 'alice@example.com' }
        }
      });
    }),
    http.patch('/api/users/1', async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({
        data: {
          id: '1',
          type: 'user',
          attributes: body.data.attributes
        }
      });
    })
  );

  await visit('/users/1/edit');
  await fillIn('[data-test-name-input]', 'Alice Updated');
  await click('[data-test-submit-button]');

  assert.dom('[data-test-user-name]').hasText('Alice Updated');
});

test('deletes a user', async function(assert) {
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json({
        data: [
          { id: '1', type: 'user', attributes: { name: 'Alice' } }
        ]
      });
    }),
    http.delete('/api/users/1', () => {
      return new HttpResponse(null, { status: 204 });
    })
  );

  await visit('/users');
  await click('[data-test-delete-button]');

  assert.dom('[data-test-user-item]').doesNotExist();
});
```

### Query Parameters and Dynamic Routes

```javascript
test('filters users by query parameter', async function(assert) {
  server.use(
    http.get('/api/users', ({ request }) => {
      const url = new URL(request.url);
      const searchQuery = url.searchParams.get('filter[name]');

      const users = [
        { id: '1', type: 'user', attributes: { name: 'Alice' } },
        { id: '2', type: 'user', attributes: { name: 'Bob' } }
      ];

      const filtered = searchQuery
        ? users.filter(u => u.attributes.name.includes(searchQuery))
        : users;

      return HttpResponse.json({ data: filtered });
    })
  );

  await visit('/users?filter[name]=Alice');

  assert.dom('[data-test-user-item]').exists({ count: 1 });
  assert.dom('[data-test-user-name]').hasText('Alice');
});

test('handles dynamic route segments', async function(assert) {
  server.use(
    http.get('/api/users/:id', ({ params }) => {
      return HttpResponse.json({
        data: {
          id: params.id,
          type: 'user',
          attributes: { name: `User ${params.id}` }
        }
      });
    })
  );

  await visit('/users/42');

  assert.dom('[data-test-user-name]').hasText('User 42');
});
```

### Network Delays and Race Conditions

```javascript
test('handles slow network responses', async function(assert) {
  server.use(
    http.get('/api/users', async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return HttpResponse.json({
        data: [
          { id: '1', type: 'user', attributes: { name: 'Alice' } }
        ]
      });
    })
  );

  const visitPromise = visit('/users');

  // Loading state should be visible
  assert.dom('[data-test-loading-spinner]').exists();

  await visitPromise;

  assert.dom('[data-test-loading-spinner]').doesNotExist();
  assert.dom('[data-test-user-item]').exists();
});
```

### Shared Handlers with Reusable Fixtures

```javascript
// tests/helpers/msw-handlers.js
import { http, HttpResponse } from 'msw';

export const userHandlers = {
  list: (users = []) => {
    return http.get('/api/users', () => {
      return HttpResponse.json({ data: users });
    });
  },

  get: (user) => {
    return http.get(`/api/users/${user.id}`, () => {
      return HttpResponse.json({ data: user });
    });
  },

  create: (attributes) => {
    return http.post('/api/users', () => {
      return HttpResponse.json({
        data: {
          id: String(Math.random()),
          type: 'user',
          attributes
        }
      }, { status: 201 });
    });
  }
};

// Common fixtures
export const fixtures = {
  users: {
    alice: {
      id: '1',
      type: 'user',
      attributes: { name: 'Alice', email: 'alice@example.com' }
    },
    bob: {
      id: '2',
      type: 'user',
      attributes: { name: 'Bob', email: 'bob@example.com' }
    }
  }
};
```

```javascript
// tests/acceptance/users-test.js
import { userHandlers, fixtures } from 'my-app/tests/helpers/msw-handlers';

test('displays list of users', async function(assert) {
  server.use(
    userHandlers.list([fixtures.users.alice, fixtures.users.bob])
  );

  await visit('/users');

  assert.dom('[data-test-user-item]').exists({ count: 2 });
});
```

### Integration Test Setup

MSW works in integration tests too:

```javascript
// tests/integration/components/user-list-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import { setupMSW, http, HttpResponse } from 'my-app/tests/helpers/msw';
import UserList from 'my-app/components/user-list';

module('Integration | Component | user-list', function(hooks) {
  setupRenderingTest(hooks);
  const { server } = setupMSW(hooks);

  test('fetches and displays users', async function(assert) {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({
          data: [
            { id: '1', type: 'user', attributes: { name: 'Alice' } }
          ]
        });
      })
    );

    await render(<template>
      <UserList />
    </template>);

    // Wait for async data to load
    await waitFor('[data-test-user-item]');

    assert.dom('[data-test-user-item]').exists();
    assert.dom('[data-test-user-name]').hasText('Alice');
  });
});
```

### Best Practices

1. **Define handlers per test** - Use `server.use()` in individual tests rather than global handlers
2. **Reset between tests** - The helper automatically resets handlers after each test
3. **Use JSON:API format** - Keep responses consistent with your API format
4. **Test error states** - Mock various HTTP error codes (400, 401, 403, 404, 500)
5. **Capture requests** - Use the request object to verify what your app sent
6. **Use fixtures** - Create reusable test data to keep tests DRY
7. **Simulate delays** - Test loading states with artificial delays
8. **Type-safe responses** - In TypeScript, type your response payloads

### Common Patterns

**Default handlers for all tests:**

```javascript
// tests/helpers/msw.js
const defaultHandlers = [
  // Always return current user
  http.get('/api/current-user', () => {
    return HttpResponse.json({
      data: {
        id: '1',
        type: 'user',
        attributes: { name: 'Test User', role: 'admin' }
      }
    });
  })
];
```

**One-time handlers (don't persist):**

```javascript
// MSW handlers persist until resetHandlers() is called
// The test helper automatically resets after each test
// For a one-time handler within a test, manually reset:
test('one-time response', async function(assert) {
  server.use(
    http.get('/api/special', () => {
      return HttpResponse.json({ data: 'special' });
    })
  );

  // First request gets mocked response
  await visit('/special');
  assert.dom('[data-test-data]').hasText('special');

  // Reset to remove this handler
  server.resetHandlers();

  // Subsequent requests will use default handlers or be unhandled
});
```

**Conditional responses:**

```javascript
http.post('/api/login', async ({ request }) => {
  const { email, password } = await request.json();

  if (email === 'test@example.com' && password === 'password') {
    return HttpResponse.json({
      data: { token: 'abc123' }
    });
  }

  return HttpResponse.json(
    { errors: [{ title: 'Invalid credentials' }] },
    { status: 401 }
  );
})
```

### Migration from Mirage

If migrating from Mirage:

1. Remove `ember-cli-mirage` dependency
2. Delete `mirage/` directory (models, factories, scenarios)
3. Install MSW: `npm install --save-dev msw`
4. Create the MSW test helper (see above)
5. Replace `setupMirage(hooks)` with `setupMSW(hooks)`
6. Convert Mirage handlers:
   - `this.server.get()` → `http.get()`
   - `this.server.create()` → Return inline JSON
   - `this.server.createList()` → Return array of JSON objects

**Before (Mirage):**
```javascript
test('lists posts', async function(assert) {
  this.server.createList('post', 3);
  await visit('/posts');
  assert.dom('[data-test-post]').exists({ count: 3 });
});
```

**After (MSW):**
```javascript
test('lists posts', async function(assert) {
  server.use(
    http.get('/api/posts', () => {
      return HttpResponse.json({
        data: [
          { id: '1', type: 'post', attributes: { title: 'Post 1' } },
          { id: '2', type: 'post', attributes: { title: 'Post 2' } },
          { id: '3', type: 'post', attributes: { title: 'Post 3' } }
        ]
      });
    })
  );
  await visit('/posts');
  assert.dom('[data-test-post]').exists({ count: 3 });
});
```

Reference: [MSW Documentation](https://mswjs.io/docs/)
