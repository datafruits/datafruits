---
title: Validate Component Arguments
impact: MEDIUM
impactDescription: Better error messages and type safety
tags: components, validation, arguments, typescript
---

## Validate Component Arguments

Validate component arguments for better error messages, documentation, and type safety.

**Incorrect (no argument validation):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

class UserCard extends Component {
  <template>
    <div>
      <h3>{{@user.name}}</h3>
      <p>{{@user.email}}</p>
    </div>
  </template>
}
```

**Correct (with TypeScript signature):**

```glimmer-ts
// app/components/user-card.gts
import Component from '@glimmer/component';

interface UserCardSignature {
  Args: {
    user: {
      name: string;
      email: string;
      avatarUrl?: string;
    };
    onEdit?: (user: UserCardSignature['Args']['user']) => void;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

class UserCard extends Component<UserCardSignature> {
  <template>
    <div ...attributes>
      <h3>{{@user.name}}</h3>
      <p>{{@user.email}}</p>

      {{#if @user.avatarUrl}}
        <img src={{@user.avatarUrl}} alt={{@user.name}} />
      {{/if}}

      {{#if @onEdit}}
        <button {{on "click" (fn @onEdit @user)}}>Edit</button>
      {{/if}}

      {{yield}}
    </div>
  </template>
}
```

**Runtime validation with assertions (using getters):**

```glimmer-js
// app/components/data-table.gjs
import Component from '@glimmer/component';
import { assert } from '@ember/debug';

class DataTable extends Component {
  // Use getters so validation runs on each access and catches arg changes
  get columns() {
    assert(
      'DataTable requires @columns argument',
      this.args.columns && Array.isArray(this.args.columns)
    );

    assert(
      '@columns must be an array of objects with "key" and "label" properties',
      this.args.columns.every(col => col.key && col.label)
    );

    return this.args.columns;
  }

  get rows() {
    assert(
      'DataTable requires @rows argument',
      this.args.rows && Array.isArray(this.args.rows)
    );

    return this.args.rows;
  }

  <template>
    <table>
      <thead>
        <tr>
          {{#each this.columns as |column|}}
            <th>{{column.label}}</th>
          {{/each}}
        </tr>
      </thead>
      <tbody>
        {{#each this.rows as |row|}}
          <tr>
            {{#each this.columns as |column|}}
              <td>{{get row column.key}}</td>
            {{/each}}
          </tr>
        {{/each}}
      </tbody>
    </table>
  </template>
}
```

**Template-only component with TypeScript:**

```glimmer-ts
// app/components/icon.gts
import type { TOC } from '@ember/component/template-only';

interface IconSignature {
  Args: {
    name: string;
    size?: 'small' | 'medium' | 'large';
  };
  Element: HTMLSpanElement;
}

const Icon: TOC<IconSignature> = <template>
  <span ...attributes></span>
</template>;

export default Icon;
```

**Documentation with JSDoc:**

```glimmer-js
// app/components/modal.gjs
import Component from '@glimmer/component';

/**
 * Modal dialog component
 *
 * @param {Object} args
 * @param {boolean} args.isOpen - Controls modal visibility
 * @param {() => void} args.onClose - Called when modal should close
 * @param {string} [args.title] - Optional modal title
 * @param {string} [args.size='medium'] - Modal size: 'small', 'medium', 'large'
 */
class Modal extends Component {
  <template>
    {{#if @isOpen}}
      <div>
        {{#if @title}}
          <h2>{{@title}}</h2>
        {{/if}}
        {{yield}}
        <button {{on "click" @onClose}}>Close</button>
      </div>
    {{/if}}
  </template>
}
```

Argument validation provides better error messages during development, serves as documentation, and enables better IDE support.

Reference: [TypeScript in Ember](https://guides.emberjs.com/release/typescript/)
