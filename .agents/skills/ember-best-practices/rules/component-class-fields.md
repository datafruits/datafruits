---
title: Use Class Fields for Component Composition
impact: MEDIUM-HIGH
impactDescription: Better composition and initialization patterns
tags: components, class-fields, composition, initialization
---

## Use Class Fields for Component Composition

Use class fields for clean component composition, initialization, and dependency injection patterns. Tracked class fields should be **roots of state** - representing the minimal independent state that your component owns. In most apps, you should have very few tracked fields.

**Incorrect (imperative initialization, scattered state):**

```glimmer-js
// app/components/data-manager.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

class DataManager extends Component {
  @service store;
  @service router;

  // Scattered state management - hard to track relationships
  @tracked currentUser = null;
  @tracked isLoading = false;
  @tracked error = null;

  loadData = async () => {
    this.isLoading = true;
    try {
      this.currentUser = await this.store.request({ url: '/users/me' });
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  };

  <template>
    <div>{{this.currentUser.name}}</div>
  </template>
}```

**Correct (class fields with proper patterns):**

```glimmer-js
// app/components/data-manager.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { cached } from '@glimmer/tracking';
import { getPromiseState } from '@warp-drive/reactiveweb';

class DataManager extends Component {
  // Service injection as class fields
  @service store;
  @service router;

  // Tracked state as class fields - this is a "root of state"
  // Most components should have very few of these
  @tracked selectedFilter = 'all';

  // Data loading with getPromiseState
  @cached
  get currentUser() {
    const promise = this.store.request({
      url: '/users/me'
    });
    return getPromiseState(promise);
  }

  <template>
    {{#if this.currentUser.isFulfilled}}
      <div>{{this.currentUser.value.name}}</div>
    {{else if this.currentUser.isRejected}}
      <div>Error: {{this.currentUser.error.message}}</div>
    {{/if}}
  </template>
}
```

**Understanding "roots of state":**

Tracked fields should represent **independent state** that your component owns - not derived data or loaded data. Examples of good tracked fields:
- User selections (selected tab, filter option)
- UI state (is modal open, is expanded)
- Form input values (not yet persisted)

In most apps, you'll have very few tracked fields because most data comes from arguments, services, or computed getters.

**Composition through class field assignment:**

```glimmer-js
// app/components/form-container.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { TrackedObject } from 'tracked-built-ins';

class FormContainer extends Component {
  // Compose form state
  @tracked formData = new TrackedObject({
    firstName: '',
    lastName: '',
    email: '',
    preferences: {
      newsletter: false,
      notifications: true
    }
  });

  // Compose validation state
  @tracked errors = new TrackedObject({});

  // Compose UI state
  @tracked ui = new TrackedObject({
    isSubmitting: false,
    isDirty: false,
    showErrors: false
  });

  // Computed field based on composed state
  get isValid() {
    return Object.keys(this.errors).length === 0 &&
           this.formData.email &&
           this.formData.firstName;
  }

  get canSubmit() {
    return this.isValid && !this.ui.isSubmitting && this.ui.isDirty;
  }

  updateField = (field, value) => {
    this.formData[field] = value;
    this.ui.isDirty = true;
    this.validate(field, value);
  };

  validate(field, value) {
    if (field === 'email' && !value.includes('@')) {
      this.errors.email = 'Invalid email';
    } else {
      delete this.errors[field];
    }
  }

  <template>
    <form>
      <input
        value={{this.formData.firstName}}
        {{on "input" (pick "target.value" (fn this.updateField "firstName"))}}
      />

      <button disabled={{not this.canSubmit}}>
        Submit
      </button>
    </form>
  </template>
}```

**Mixin-like composition with class fields:**

```javascript
// app/utils/pagination-mixin.js
import { tracked } from '@glimmer/tracking';

export class PaginationState {
  @tracked page = 1;
  @tracked perPage = 20;

  get offset() {
    return (this.page - 1) * this.perPage;
  }

  nextPage = () => {
    this.page++;
  };

  prevPage = () => {
    if (this.page > 1) this.page--;
  };

  goToPage = (page) => {
    this.page = page;
  };
}
```

```glimmer-js
// app/components/paginated-list.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { PaginationState } from '../utils/pagination-mixin';

class PaginatedList extends Component {
  // Compose pagination functionality
  pagination = new PaginationState();

  @cached
  get paginatedItems() {
    const start = this.pagination.offset;
    const end = start + this.pagination.perPage;
    return this.args.items.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.args.items.length / this.pagination.perPage);
  }

  <template>
    <div class="list">
      {{#each this.paginatedItems as |item|}}
        <div>{{item.name}}</div>
      {{/each}}

      <div class="pagination">
        <button
          {{on "click" this.pagination.prevPage}}
          disabled={{eq this.pagination.page 1}}
        >
          Previous
        </button>

        <span>Page {{this.pagination.page}} of {{this.totalPages}}</span>

        <button
          {{on "click" this.pagination.nextPage}}
          disabled={{eq this.pagination.page this.totalPages}}
        >
          Next
        </button>
      </div>
    </div>
  </template>
}```

**Shareable state objects:**

```javascript
// app/utils/selection-state.js
import { tracked } from '@glimmer/tracking';
import { TrackedSet } from 'tracked-built-ins';

export class SelectionState {
  @tracked selectedIds = new TrackedSet();

  get count() {
    return this.selectedIds.size;
  }

  get hasSelection() {
    return this.selectedIds.size > 0;
  }

  isSelected(id) {
    return this.selectedIds.has(id);
  }

  toggle = (id) => {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  };

  selectAll = (items) => {
    items.forEach(item => this.selectedIds.add(item.id));
  };

  clear = () => {
    this.selectedIds.clear();
  };
}
```

```glimmer-js
// app/components/selectable-list.gjs
import Component from '@glimmer/component';
import { SelectionState } from '../utils/selection-state';

class SelectableList extends Component {
  // Compose selection behavior
  selection = new SelectionState();

  get selectedItems() {
    return this.args.items.filter(item =>
      this.selection.isSelected(item.id)
    );
  }

  <template>
    <div class="toolbar">
      <button {{on "click" (fn this.selection.selectAll @items)}}>
        Select All
      </button>
      <button {{on "click" this.selection.clear}}>
        Clear
      </button>
      <span>{{this.selection.count}} selected</span>
    </div>

    <ul>
      {{#each @items as |item|}}
        <li class={{if (this.selection.isSelected item.id) "selected"}}>
          <input
            type="checkbox"
            checked={{this.selection.isSelected item.id}}
            {{on "change" (fn this.selection.toggle item.id)}}
          />
          {{item.name}}
        </li>
      {{/each}}
    </ul>

    {{#if this.selection.hasSelection}}
      <div class="actions">
        <button>Delete {{this.selection.count}} items</button>
      </div>
    {{/if}}
  </template>
}```

Class fields provide clean composition patterns, better initialization, and shareable state objects that can be tested independently.

Reference: [JavaScript Class Fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)
