---
title: Use qunit-dom for Better Test Assertions
impact: MEDIUM
impactDescription: More readable and maintainable tests
tags: testing, qunit-dom, assertions, best-practices
---

## Use qunit-dom for Better Test Assertions

Use `qunit-dom` for DOM assertions in tests. It provides expressive, chainable assertions that make tests more readable and provide better error messages than raw QUnit assertions.

**Why qunit-dom:**
- More expressive and readable test assertions
- Better error messages when tests fail
- Type-safe with TypeScript
- Reduces boilerplate in DOM testing

### Basic DOM Assertions

**Incorrect (verbose QUnit assertions):**

```javascript
// tests/integration/components/greeting-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';


module('Integration | Component | greeting', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(<template><Greeting @name="World" /></template>);

    const element = this.element.querySelector('.greeting');
    assert.ok(element, 'greeting element exists');
    assert.equal(element.textContent.trim(), 'Hello, World!', 'shows greeting');
    assert.ok(element.classList.contains('greeting'), 'has greeting class');
  });
});
```

**Correct (expressive qunit-dom):**

```javascript
// tests/integration/components/greeting-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';


module('Integration | Component | greeting', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(<template><Greeting @name="World" /></template>);

    assert.dom('.greeting').exists('greeting element exists');
    assert.dom('.greeting').hasText('Hello, World!', 'shows greeting');
  });
});
```

### Common Assertions

**Existence and Visibility:**

```javascript
test('element visibility', async function (assert) {
  await render(<template><MyComponent /></template>);

  // Element exists in DOM
  assert.dom('[data-test-output]').exists();

  // Element doesn't exist
  assert.dom('[data-test-deleted]').doesNotExist();

  // Element is visible (not display: none or visibility: hidden)
  assert.dom('[data-test-visible]').isVisible();

  // Element is not visible
  assert.dom('[data-test-hidden]').isNotVisible();

  // Count elements
  assert.dom('[data-test-item]').exists({ count: 3 });
});
```

**Text Content:**

```javascript
test('text assertions', async function (assert) {
  await render(<template><Article @title="Hello World" /></template>);

  // Exact text match
  assert.dom('h1').hasText('Hello World');

  // Contains text (partial match)
  assert.dom('p').containsText('Hello');

  // Any text exists
  assert.dom('h1').hasAnyText();

  // No text
  assert.dom('.empty').hasNoText();
});
```

**Attributes:**

```javascript
test('attribute assertions', async function (assert) {
  await render(<template><Button @disabled={{true}} /></template>);

  // Has attribute (any value)
  assert.dom('button').hasAttribute('disabled');

  // Has specific attribute value
  assert.dom('button').hasAttribute('type', 'submit');

  // Attribute value matches regex
  assert.dom('a').hasAttribute('href', /^https:\/\//);

  // Doesn't have attribute
  assert.dom('button').doesNotHaveAttribute('aria-hidden');

  // Has ARIA attributes
  assert.dom('[role="button"]').hasAttribute('aria-label', 'Close dialog');
});
```

**Classes:**

```javascript
test('class assertions', async function (assert) {
  await render(<template><Card @status="active" /></template>);

  // Has single class
  assert.dom('.card').hasClass('active');

  // Doesn't have class
  assert.dom('.card').doesNotHaveClass('disabled');

  // Has no classes at all
  assert.dom('.plain').hasNoClass();
});
```

**Form Elements:**

```javascript
test('form assertions', async function (assert) {
  await render(<template>
    <form>
      <input type="text" value="hello" />
      <input type="checkbox" checked />
      <input type="radio" disabled />
      <select>
        <option selected>Option 1</option>
      </select>
    </form>
  </template>);

  // Input value
  assert.dom('input[type="text"]').hasValue('hello');

  // Checkbox/radio state
  assert.dom('input[type="checkbox"]').isChecked();
  assert.dom('input[type="checkbox"]').isNotChecked();

  // Disabled state
  assert.dom('input[type="radio"]').isDisabled();
  assert.dom('input[type="text"]').isNotDisabled();

  // Required state
  assert.dom('input').isRequired();
  assert.dom('input').isNotRequired();

  // Focus state
  assert.dom('input').isFocused();
  assert.dom('input').isNotFocused();
});
```

### Chaining Assertions

You can chain multiple assertions on the same element:

```javascript
test('chained assertions', async function (assert) {
  await render(<template><Button @variant="primary" @disabled={{false}} /></template>);

  assert.dom('button')
    .exists()
    .hasClass('btn-primary')
    .hasAttribute('type', 'button')
    .isNotDisabled()
    .hasText('Submit')
    .isVisible();
});
```

### Custom Error Messages

Add custom messages to make failures clearer:

```javascript
test('custom messages', async function (assert) {
  await render(<template><UserProfile @user={{this.user}} /></template>);

  assert.dom('[data-test-username]')
    .hasText(this.user.name, 'username is displayed correctly');

  assert.dom('[data-test-avatar]')
    .exists('user avatar should be visible');
});
```

### Testing Counts

```javascript
test('list items', async function (assert) {
  await render(<template>
    <TodoList @todos={{this.todos}} />
  </template>);

  // Exact count
  assert.dom('[data-test-todo]').exists({ count: 5 });

  // At least one
  assert.dom('[data-test-todo]').exists({ count: 1 });

  // None
  assert.dom('[data-test-todo]').doesNotExist();
});
```

### Accessibility Testing

Use qunit-dom for basic accessibility checks:

```javascript
test('accessibility', async function (assert) {
  await render(<template><Modal @onClose={{this.close}} /></template>);

  // ARIA roles
  assert.dom('[role="dialog"]').exists();
  assert.dom('[role="dialog"]').hasAttribute('aria-modal', 'true');

  // Labels
  assert.dom('[aria-label="Close modal"]').exists();

  // Focus management
  assert.dom('[data-test-close-button]').isFocused();

  // Required fields
  assert.dom('input[name="email"]').hasAttribute('aria-required', 'true');
});
```

### Best Practices

1. **Use data-test attributes** for test selectors instead of classes:
   ```javascript
   // Good
   assert.dom('[data-test-submit-button]').exists();

   // Avoid - classes can change
   assert.dom('.btn.btn-primary').exists();
   ```

2. **Make assertions specific**:
   ```javascript
   // Better - exact match
   assert.dom('h1').hasText('Welcome');

   // Less specific - could miss issues
   assert.dom('h1').containsText('Welc');
   ```

3. **Use meaningful custom messages**:
   ```javascript
   assert.dom('[data-test-error]')
     .hasText('Invalid email', 'shows correct validation error');
   ```

4. **Combine with @ember/test-helpers**:
   ```javascript
   import { click, fillIn } from '@ember/test-helpers';

   await fillIn('[data-test-email]', 'user@example.com');
   await click('[data-test-submit]');

   assert.dom('[data-test-success]').exists();
   ```

5. **Test user-visible behavior**, not implementation:
   ```javascript
   // Good - tests what user sees
   assert.dom('[data-test-greeting]').hasText('Hello, Alice');

   // Avoid - tests implementation details
   assert.ok(this.component.internalState === 'ready');
   ```

qunit-dom makes your tests more maintainable and easier to understand. It comes pre-installed with `ember-qunit`, so you can start using it immediately.

**References:**
- [qunit-dom Documentation](https://github.com/mainmatter/qunit-dom)
- [qunit-dom API](https://github.com/mainmatter/qunit-dom/blob/master/API.md)
- [Ember Testing Guide](https://guides.emberjs.com/release/testing/)
