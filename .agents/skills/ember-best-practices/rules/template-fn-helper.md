---
title: Use {{fn}} for Partial Application Only
impact: LOW-MEDIUM
impactDescription: Clearer code, avoid unnecessary wrapping
tags: helpers, templates, fn, partial-application
---

## Use {{fn}} for Partial Application Only

The `{{fn}}` helper is used for partial application (binding arguments), similar to JavaScript's `.bind()`. Only use it when you need to pre-bind arguments to a function. Don't use it to simply pass a function reference.

**Incorrect (unnecessary use of {{fn}}):**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';

class Search extends Component {
  @action
  handleSearch(event) {
    console.log('Searching:', event.target.value);
  }

  <template>
    {{! Wrong - no arguments being bound}}
    <input {{on "input" (fn this.handleSearch)}} />
  </template>
}```

**Correct (direct function reference):**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';

class Search extends Component {
  @action
  handleSearch(event) {
    console.log('Searching:', event.target.value);
  }

  <template>
    {{! Correct - pass function directly}}
    <input {{on "input" this.handleSearch}} />
  </template>
}```

**When to Use {{fn}} - Partial Application:**

Use `{{fn}}` when you need to pre-bind arguments to a function, similar to JavaScript's `.bind()`:

```glimmer-js
// app/components/user-list.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';

class UserList extends Component {
  @action
  deleteUser(userId, event) {
    console.log('Deleting user:', userId);
    this.args.onDelete(userId);
  }

  <template>
    <ul>
      {{#each @users as |user|}}
        <li>
          {{user.name}}
          {{! Correct - binding user.id as first argument}}
          <button {{on "click" (fn this.deleteUser user.id)}}>
            Delete
          </button>
        </li>
      {{/each}}
    </ul>
  </template>
}```

**Multiple Arguments:**

```glimmer-js
// app/components/data-grid.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';

class DataGrid extends Component {
  @action
  updateCell(rowId, columnKey, event) {
    const newValue = event.target.value;
    this.args.onUpdate(rowId, columnKey, newValue);
  }

  <template>
    {{#each @rows as |row|}}
      {{#each @columns as |column|}}
        <input
          value={{get row column.key}}
          {{! Pre-binding rowId and columnKey}}
          {{on "input" (fn this.updateCell row.id column.key)}}
        />
      {{/each}}
    {{/each}}
  </template>
}```

**Think of {{fn}} like .bind():**

```javascript
// JavaScript comparison
const boundFn = this.deleteUser.bind(this, userId); // .bind() pre-binds args
// Template equivalent: {{fn this.deleteUser userId}}

// Direct reference
const directFn = this.handleSearch; // No pre-binding
// Template equivalent: {{this.handleSearch}}
```

**Common Patterns:**

```javascript
// ❌ Wrong - no partial application
<button {{on "click" (fn this.save)}}>Save</button>

// ✅ Correct - direct reference
<button {{on "click" this.save}}>Save</button>

// ✅ Correct - partial application with argument
<button {{on "click" (fn this.save "draft")}}>Save Draft</button>

// ❌ Wrong - no partial application
<input {{on "input" (fn this.handleInput)}} />

// ✅ Correct - direct reference
<input {{on "input" this.handleInput}} />

// ✅ Correct - partial application with field name
<input {{on "input" (fn this.updateField "email")}} />
```

Only use `{{fn}}` when you're binding arguments. For simple function references, pass them directly.

Reference: [Ember Templates - fn Helper](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_passing-arguments-to-functions)
