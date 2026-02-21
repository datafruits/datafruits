---
title: Provide DOM-Abstracted Test Utilities for Library Components
category: testing
impact: MEDIUM
---

# Provide DOM-Abstracted Test Utilities for Library Components

**Impact: Medium** - Critical for library maintainability and consumer testing experience, especially important for team-based projects

## Problem

When building reusable components or libraries, consumers should not need to know implementation details or interact directly with the component's DOM. DOM structure should be considered **private** unless the author of the tests is the **owner** of the code being tested.

Without abstracted test utilities:
- Component refactoring breaks consumer tests
- Tests are tightly coupled to implementation details
- Teams waste time updating tests when internals change
- Testing becomes fragile and maintenance-heavy

## Solution

**Library authors should provide test utilities that fully abstract the DOM.** These utilities expose a public API for testing that remains stable even when internal implementation changes.

**Incorrect (exposing DOM to consumers):**

```glimmer-js
// my-library/src/components/data-grid.gjs
export class DataGrid extends Component {
  <template>
    <div class="data-grid">
      <div class="data-grid__header">
        <button class="sort-button" data-column="name">Name</button>
      </div>
      <div class="data-grid__body">
        {{#each @rows as |row|}}
          <div class="data-grid__row">{{row.name}}</div>
        {{/each}}
      </div>
    </div>
  </template>
}
```

```glimmer-js
// Consumer's test - tightly coupled to DOM
import { render, click } from '@ember/test-helpers';
import { DataGrid } from 'my-library';

test('sorting works', async function(assert) {
  await render(<template>
    <DataGrid @rows={{this.rows}} />
  </template>);

  // Fragile: breaks if class names or structure change
  await click('.data-grid__header .sort-button[data-column="name"]');

  assert.dom('.data-grid__row:first-child').hasText('Alice');
});
```

**Problems:**
- Consumer knows about `.data-grid__header`, `.sort-button`, `[data-column]`
- Refactoring component structure breaks consumer tests
- No clear public API for testing

**Correct (providing DOM-abstracted test utilities):**

```glimmer-js
// my-library/src/test-support/data-grid.js
import { click, findAll } from '@ember/test-helpers';

/**
 * Test utility for DataGrid component
 * Provides stable API regardless of internal DOM structure
 */
export class DataGridTestHelper {
  constructor(containerElement) {
    this.container = containerElement;
  }

  /**
   * Sort by column name
   * @param {string} columnName - Column to sort by
   */
  async sortBy(columnName) {
    // Implementation detail hidden from consumer
    const button = this.container.querySelector(`[data-test-sort="${columnName}"]`);
    if (!button) {
      throw new Error(`Column "${columnName}" not found`);
    }
    await click(button);
  }

  /**
   * Get all row data
   * @returns {Array<string>} Row text content
   */
  getRows() {
    return findAll('[data-test-row]', this.container)
      .map(el => el.textContent.trim());
  }

  /**
   * Get row by index
   * @param {number} index - Zero-based row index
   * @returns {string} Row text content
   */
  getRow(index) {
    const rows = this.getRows();
    return rows[index];
  }
}

// Factory function for easier usage
export function getDataGrid(container = document) {
  const gridElement = container.querySelector('[data-test-data-grid]');
  if (!gridElement) {
    throw new Error('DataGrid component not found');
  }
  return new DataGridTestHelper(gridElement);
}
```

```glimmer-js
// my-library/src/components/data-grid.gjs
// Component updated with test hooks (data-test-*)
export class DataGrid extends Component {
  <template>
    <div data-test-data-grid class="data-grid">
      <div class="data-grid__header">
        {{#each @columns as |column|}}
          <button data-test-sort={{column.name}}>
            {{column.label}}
          </button>
        {{/each}}
      </div>
      <div class="data-grid__body">
        {{#each @rows as |row|}}
          <div data-test-row class="data-grid__row">{{row.name}}</div>
        {{/each}}
      </div>
    </div>
  </template>
}
```

```glimmer-js
// Consumer's test - abstracted from DOM
import { render } from '@ember/test-helpers';
import { DataGrid } from 'my-library';
import { getDataGrid } from 'my-library/test-support';

test('sorting works', async function(assert) {
  await render(<template>
    <DataGrid @rows={{this.rows}} @columns={{this.columns}} />
  </template>);

  const grid = getDataGrid();

  // Clean API: no DOM knowledge required
  await grid.sortBy('name');

  assert.strictEqual(grid.getRow(0), 'Alice');
  assert.deepEqual(grid.getRows(), ['Alice', 'Bob', 'Charlie']);
});
```

**Benefits:**
- Component internals can change without breaking consumer tests
- Clear, documented testing API
- Consumer tests are declarative and readable
- Library maintains API stability contract

## When This Matters Most

### Team-Based Projects (Critical)

On projects with teams, DOM abstraction prevents:
- Merge conflicts from test changes
- Cross-team coordination overhead
- Broken tests from uncoordinated refactoring
- Knowledge silos about component internals

### Solo Projects (Less Critical)

For solo projects, the benefit is smaller but still valuable:
- Easier refactoring without test maintenance
- Better separation of concerns
- Professional API design practice

## Best Practices

### 1. Use `data-test-*` Attributes

```glimmer-js
// Stable test hooks that won't conflict with styling
<button data-test-submit>Submit</button>
<div data-test-error-message>{{@errorMessage}}</div>
```

### 2. Document the Test API

```javascript
/**
 * @class FormTestHelper
 * @description Test utility for Form component
 *
 * @example
 * const form = getForm();
 * await form.fillIn('email', 'user@example.com');
 * await form.submit();
 * assert.strictEqual(form.getError(), 'Invalid email');
 */
```

### 3. Provide Semantic Methods

```javascript
// ✅ Semantic and declarative
await modal.close();
await form.fillIn('email', 'test@example.com');
assert.true(dropdown.isOpen());

// ❌ Exposes implementation
await click('.modal-close-button');
await fillIn('.form-field[name="email"]', 'test@example.com');
assert.dom('.dropdown.is-open').exists();
```

### 4. Handle Edge Cases

```javascript
export class FormTestHelper {
  async fillIn(fieldName, value) {
    const field = this.container.querySelector(`[data-test-field="${fieldName}"]`);
    if (!field) {
      throw new Error(
        `Field "${fieldName}" not found. Available fields: ${this.getFieldNames().join(', ')}`
      );
    }
    await fillIn(field, value);
  }

  getFieldNames() {
    return Array.from(this.container.querySelectorAll('[data-test-field]'))
      .map(el => el.dataset.testField);
  }
}
```

## Example: Complete Test Utility

```javascript
// addon/test-support/modal.js
import { click, find, waitUntil } from '@ember/test-helpers';

export class ModalTestHelper {
  constructor(container = document) {
    this.container = container;
  }

  get element() {
    return find('[data-test-modal]', this.container);
  }

  isOpen() {
    return this.element !== null;
  }

  async waitForOpen() {
    await waitUntil(() => this.isOpen(), { timeout: 1000 });
  }

  async waitForClose() {
    await waitUntil(() => !this.isOpen(), { timeout: 1000 });
  }

  getTitle() {
    const titleEl = find('[data-test-modal-title]', this.element);
    return titleEl ? titleEl.textContent.trim() : null;
  }

  getBody() {
    const bodyEl = find('[data-test-modal-body]', this.element);
    return bodyEl ? bodyEl.textContent.trim() : null;
  }

  async close() {
    if (!this.isOpen()) {
      throw new Error('Cannot close modal: modal is not open');
    }
    await click('[data-test-modal-close]', this.element);
  }

  async clickButton(buttonText) {
    const buttons = findAll('[data-test-modal-button]', this.element);
    const button = buttons.find(btn =>
      btn.textContent.trim() === buttonText
    );
    if (!button) {
      const available = buttons.map(b => b.textContent.trim()).join(', ');
      throw new Error(
        `Button "${buttonText}" not found. Available: ${available}`
      );
    }
    await click(button);
  }
}

export function getModal(container) {
  return new ModalTestHelper(container);
}
```

## Performance Impact

**Before:** ~30-50% of test maintenance time spent updating selectors
**After:** Minimal test maintenance when refactoring components

## Related Patterns

- **component-avoid-classes-in-examples.md** - Avoid exposing implementation details
- **testing-modern-patterns.md** - Modern testing approaches
- **testing-render-patterns.md** - Component testing patterns

## References

- [Testing Best Practices - ember-learn](https://guides.emberjs.com/release/testing/)
- [ember-test-selectors](https://github.com/mainmatter/ember-test-selectors) - Addon for stripping test selectors from production
- [Page Objects Pattern](https://martinfowler.com/bliki/PageObject.html) - Related testing abstraction pattern
