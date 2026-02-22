---
title: Use Modern Testing Patterns
impact: HIGH
impactDescription: Better test coverage and maintainability
tags: testing, qunit, test-helpers, integration-tests
---

## Use Modern Testing Patterns

Use modern Ember testing patterns with `@ember/test-helpers` and `qunit-dom` for better test coverage and maintainability.

**Incorrect (old testing patterns):**

```glimmer-js
// tests/integration/components/user-card-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import UserCard from 'my-app/components/user-card';

module('Integration | Component | user-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(<template><UserCard /></template>);

    // Using find() instead of qunit-dom
    assert.ok(find('.user-card'));
  });
});```

**Correct (modern testing patterns):**

```glimmer-js
// tests/integration/components/user-card-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import UserCard from 'my-app/components/user-card';

module('Integration | Component | user-card', function(hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders user information', async function(assert) {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      avatarUrl: '/avatar.jpg'
    };

    await render(<template>
      <UserCard @user={{user}} />
    </template>);

    // qunit-dom assertions
    assert.dom('[data-test-user-name]').hasText('John Doe');
    assert.dom('[data-test-user-email]').hasText('john@example.com');
    assert.dom('[data-test-user-avatar]')
      .hasAttribute('src', '/avatar.jpg')
      .hasAttribute('alt', 'John Doe');
  });

  test('it handles edit action', async function(assert) {
    assert.expect(1);

    const user = { name: 'John Doe', email: 'john@example.com' };
    const handleEdit = (editedUser) => {
      assert.deepEqual(editedUser, user, 'Edit handler called with user');
    };

    await render(<template>
      <UserCard @user={{user}} @onEdit={{handleEdit}} />
    </template>);

    await click('[data-test-edit-button]');
  });
});```

**Component testing with reactive state:**

```glimmer-ts
// tests/integration/components/search-box-test.ts
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { trackedObject } from '@ember/reactive/collections';
import SearchBox from 'my-app/components/search-box';

module('Integration | Component | search-box', function(hooks) {
  setupRenderingTest(hooks);

  test('it performs search', async function(assert) {
    // Use trackedObject for reactive state in tests
    const state = trackedObject({
      results: [] as string[]
    });

    const handleSearch = (query: string) => {
      state.results = [`Result for ${query}`];
    };

    await render(<template>
      <SearchBox @onSearch={{handleSearch}} />
      <ul data-test-results>
        {{#each state.results as |result|}}
          <li>{{result}}</li>
        {{/each}}
      </ul>
    </template>);

    await fillIn('[data-test-search-input]', 'ember');

    // State updates reactively - no waitFor needed when using test-waiters
    assert.dom('[data-test-results] li').hasText('Result for ember');
  });
});
```

**Testing with ember-concurrency tasks:**

```glimmer-js
// app/components/async-button.js
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class AsyncButtonComponent extends Component {
  @task
  *saveTask() {
    yield this.args.onSave();
  }

  <template>
    <button
      type="button"
      disabled={{this.saveTask.isRunning}}
      {{on "click" (perform this.saveTask)}}
      data-test-button
    >
      {{#if this.saveTask.isRunning}}
        <span data-test-loading-spinner>Saving...</span>
      {{else}}
        {{yield}}
      {{/if}}
    </button>
  </template>
}
```

```glimmer-js
// tests/integration/components/async-button-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import AsyncButton from 'my-app/components/async-button';

module('Integration | Component | async-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it shows loading state during task execution', async function(assert) {
    let resolveTask;
    const onSave = () => {
      return new Promise(resolve => { resolveTask = resolve; });
    };

    await render(<template>
      <AsyncButton @onSave={{onSave}}>
        Save
      </AsyncButton>
    </template>);

    // Trigger the task
    await click('[data-test-button]');

    // ember-concurrency automatically registers test waiters
    // The button will be disabled while the task runs
    assert.dom('[data-test-button]').hasAttribute('disabled');
    assert.dom('[data-test-loading-spinner]').hasText('Saving...');

    // Resolve the task
    resolveTask();
    // No need to call settled() - ember-concurrency's test waiters handle this

    assert.dom('[data-test-button]').doesNotHaveAttribute('disabled');
    assert.dom('[data-test-loading-spinner]').doesNotExist();
    assert.dom('[data-test-button]').hasText('Save');
  });
});
```

**When to use test-waiters with ember-concurrency:**

- **ember-concurrency auto-registers test waiters** - You don't need to manually register test waiters for ember-concurrency tasks. The library automatically waits for tasks to complete before test helpers like `click()`, `fillIn()`, etc. resolve.

- **You still need test-waiters when:**
  - Using raw Promises outside of ember-concurrency tasks
  - Working with third-party async operations that don't integrate with Ember's test waiter system
  - Creating custom async behavior that needs to pause test execution

- **You DON'T need additional test-waiters when:**
  - Using ember-concurrency tasks (already handled)
  - Using Ember Data operations (already handled)
  - Using `settled()` from `@ember/test-helpers` (already coordinates with test waiters)
  - **Note**: `waitFor()` and `waitUntil()` from `@ember/test-helpers` are code smells - if you need them, it indicates missing test-waiters in your code. Instrument your async operations with test-waiters instead.

**Route testing with MSW (Mock Service Worker):**

```javascript
// tests/acceptance/posts-test.js
import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { http, HttpResponse } from 'msw';
import { setupMSW } from 'my-app/tests/helpers/msw';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);
  const { server } = setupMSW(hooks);

  test('visiting /posts', async function(assert) {
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

    assert.strictEqual(currentURL(), '/posts');
    assert.dom('[data-test-post-item]').exists({ count: 3 });
  });

  test('clicking a post navigates to detail', async function(assert) {
    server.use(
      http.get('/api/posts', () => {
        return HttpResponse.json({
          data: [
            { id: '1', type: 'post', attributes: { title: 'Test Post', slug: 'test-post' } }
          ]
        });
      }),
      http.get('/api/posts/test-post', () => {
        return HttpResponse.json({
          data: { id: '1', type: 'post', attributes: { title: 'Test Post', slug: 'test-post' } }
        });
      })
    );

    await visit('/posts');
    await click('[data-test-post-item]:first-child');

    assert.strictEqual(currentURL(), '/posts/test-post');
    assert.dom('[data-test-post-title]').hasText('Test Post');
  });
});
```

**Note:** Use MSW (Mock Service Worker) for API mocking instead of Mirage. MSW provides better conventions and doesn't lead developers astray. See `testing-msw-setup.md` for detailed setup instructions.

**Accessibility testing:**

```glimmer-js
// tests/integration/components/modal-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import Modal from 'my-app/components/modal';

module('Integration | Component | modal', function(hooks) {
  setupRenderingTest(hooks);

  test('it passes accessibility audit', async function(assert) {
    await render(<template>
      <Modal @isOpen={{true}} @title="Test Modal">
        <p>Modal content</p>
      </Modal>
    </template>);

    await a11yAudit();
    assert.ok(true, 'no a11y violations');
  });

  test('it traps focus', async function(assert) {
    await render(<template>
      <Modal @isOpen={{true}}>
        <button data-test-first>First</button>
        <button data-test-last>Last</button>
      </Modal>
    </template>);

    assert.dom('[data-test-first]').isFocused();

    // Tab should stay within modal
    await click('[data-test-last]');
    assert.dom('[data-test-last]').isFocused();
  });
});```

**Testing with data-test attributes:**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';

class UserProfile extends Component {
  <template>
    <div class="user-profile" data-test-user-profile>
      <img
        src={{@user.avatar}}
        alt={{@user.name}}
        data-test-avatar
      />
      <h2 data-test-name>{{@user.name}}</h2>
      <p data-test-email>{{@user.email}}</p>

      {{#if @onEdit}}
        <button
          {{on "click" (fn @onEdit @user)}}
          data-test-edit-button
        >
          Edit
        </button>
      {{/if}}
    </div>
  </template>
}```

Modern testing patterns with `@ember/test-helpers`, `qunit-dom`, and data-test attributes provide better test reliability, readability, and maintainability.

Reference: [Ember Testing](https://guides.emberjs.com/release/testing/)
