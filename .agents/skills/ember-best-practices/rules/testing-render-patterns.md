---
title: Use Appropriate Render Patterns in Tests
impact: MEDIUM
impactDescription: Simpler test code and better readability
tags: testing, render, component-testing, test-helpers
---

## Use Appropriate Render Patterns in Tests

Choose the right rendering pattern based on whether your component needs arguments, blocks, or attributes in the test.

**Incorrect (using template tag unnecessarily):**

```javascript
// tests/integration/components/loading-spinner-test.js
import { render } from '@ember/test-helpers';
import LoadingSpinner from 'my-app/components/loading-spinner';

test('it renders', async function(assert) {
  // ❌ Unnecessary template wrapper for component with no args
  await render(<template>
    <LoadingSpinner />
  </template>);

  assert.dom('[data-test-spinner]').exists();
});
```

**Correct (direct component render when no args needed):**

```javascript
// tests/integration/components/loading-spinner-test.js
import { render } from '@ember/test-helpers';
import LoadingSpinner from 'my-app/components/loading-spinner';

test('it renders', async function(assert) {
  // ✅ Simple: pass component directly when no args needed
  await render(LoadingSpinner);

  assert.dom('[data-test-spinner]').exists();
});
```

**Pattern 1: Direct component render (no args/blocks/attributes):**

```javascript
// tests/integration/components/loading-spinner-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import LoadingSpinner from 'my-app/components/loading-spinner';

module('Integration | Component | loading-spinner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders without arguments', async function(assert) {
    // ✅ Simple: pass component directly when no args needed
    await render(LoadingSpinner);

    assert.dom('[data-test-spinner]').exists();
    assert.dom('[data-test-spinner]').hasClass('loading');
  });
});
```

**Pattern 2: Template tag render (with args/blocks/attributes):**

```glimmer-js
// tests/integration/components/user-card-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import UserCard from 'my-app/components/user-card';

module('Integration | Component | user-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders with arguments', async function(assert) {
    const user = { name: 'John Doe', email: 'john@example.com' };

    // ✅ Use template tag when passing arguments
    await render(<template>
      <UserCard @user={{user}} />
    </template>);

    assert.dom('[data-test-user-name]').hasText('John Doe');
  });

  test('it renders with block content', async function(assert) {
    // ✅ Use template tag when providing blocks
    await render(<template>
      <UserCard>
        <:header>Custom Header</:header>
        <:body>Custom Content</:body>
      </UserCard>
    </template>);

    assert.dom('[data-test-header]').hasText('Custom Header');
    assert.dom('[data-test-body]').hasText('Custom Content');
  });

  test('it renders with HTML attributes', async function(assert) {
    // ✅ Use template tag when passing HTML attributes
    await render(<template>
      <UserCard class="featured" data-test-featured />
    </template>);

    assert.dom('[data-test-featured]').exists();
    assert.dom('[data-test-featured]').hasClass('featured');
  });
});```

**Complete example showing both patterns:**

```glimmer-js
// tests/integration/components/button-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import Button from 'my-app/components/button';

module('Integration | Component | button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders default button', async function(assert) {
    // ✅ No args needed - use direct render
    await render(Button);

    assert.dom('button').exists();
    assert.dom('button').hasText('Click me');
  });

  test('it renders with custom text', async function(assert) {
    // ✅ Needs block content - use template tag
    await render(<template>
      <Button>Submit Form</Button>
    </template>);

    assert.dom('button').hasText('Submit Form');
  });

  test('it handles click action', async function(assert) {
    assert.expect(1);

    const handleClick = () => {
      assert.ok(true, 'Click handler called');
    };

    // ✅ Needs argument - use template tag
    await render(<template>
      <Button @onClick={{handleClick}}>Click me</Button>
    </template>);

    await click('button');
  });

  test('it applies variant styling', async function(assert) {
    // ✅ Needs argument - use template tag
    await render(<template>
      <Button @variant="primary">Primary Button</Button>
    </template>);

    assert.dom('button').hasClass('btn-primary');
  });
});```

**Testing template-only components:**

```glimmer-js
// tests/integration/components/icon-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Icon from 'my-app/components/icon';

module('Integration | Component | icon', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders default icon', async function(assert) {
    // ✅ Template-only component with no args - use direct render
    await render(Icon);

    assert.dom('[data-test-icon]').exists();
  });

  test('it renders specific icon', async function(assert) {
    // ✅ Needs @name argument - use template tag
    await render(<template>
      <Icon @name="check" @size="large" />
    </template>);

    assert.dom('[data-test-icon]').hasAttribute('data-icon', 'check');
    assert.dom('[data-test-icon]').hasClass('icon-large');
  });
});```

**Decision guide:**

| Scenario | Pattern | Example |
|----------|---------|---------|
| No arguments, blocks, or attributes | `render(Component)` | `render(LoadingSpinner)` |
| Component needs arguments | `render(<template>...</template>)` | `render(<template><Card @title="Hello" /></template>)` |
| Component receives block content | `render(<template>...</template>)` | `render(<template><Card>Content</Card></template>)` |
| Component needs HTML attributes | `render(<template>...</template>)` | `render(<template><Card class="featured" /></template>)` |
| Multiple test context properties | `render(<template>...</template>)` | `render(<template><Card @data={{this.data}} /></template>)` |

**Why this matters:**

- **Simplicity**: Direct render reduces boilerplate for simple cases
- **Clarity**: Template syntax makes data flow explicit when needed
- **Consistency**: Clear pattern helps teams write maintainable tests
- **Type Safety**: Both patterns work with TypeScript for component types

**Common patterns:**

```glimmer-js
// ✅ Simple component, no setup needed
await render(LoadingSpinner);
await render(Divider);
await render(Logo);

// ✅ Component with arguments from test context
await render(<template>
  <UserList @users={{this.users}} @onSelect={{this.handleSelect}} />
</template>);

// ✅ Component with named blocks
await render(<template>
  <Modal>
    <:header>Title</:header>
    <:body>Content</:body>
    <:footer><button>Close</button></:footer>
  </Modal>
</template>);

// ✅ Component with splattributes
await render(<template>
  <Card class="highlighted" data-test-card role="article">
    Card content
  </Card>
</template>);```

Using the appropriate render pattern keeps tests clean and expressive.

Reference: [Ember Testing Guide](https://guides.emberjs.com/release/testing/)
