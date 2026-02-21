---
title: Use Helper Libraries Effectively
category: template
impact: MEDIUM
---

# Use Helper Libraries Effectively

Leverage community helper libraries to write cleaner templates and avoid creating unnecessary custom helpers for common operations.

## Problem

Reinventing common functionality with custom helpers adds maintenance burden and bundle size when well-maintained helper libraries already provide the needed functionality.

**Incorrect:**
```glimmer-js
// app/utils/is-equal.js - Unnecessary custom helper
export function isEqual(a, b) {
  return a === b;
}

// app/components/user-badge.gjs
import { isEqual } from '../utils/is-equal';

class UserBadge extends Component {
  <template>
    {{#if (isEqual @user.role "admin")}}
      <span class="badge">Admin</span>
    {{/if}}
  </template>
}```

## Solution

**Note:** These helpers will be built into Ember 7 core, but currently require installing the respective addon packages.

**Installation:**
```bash
npm install ember-truth-helpers ember-composable-helpers
```

Use helper libraries like `ember-truth-helpers` and `ember-composable-helpers`:

**Correct:**
```glimmer-js
// app/components/user-badge.gjs
import Component from '@glimmer/component';
import { eq } from 'ember-truth-helpers';

class UserBadge extends Component {
  <template>
    {{! eq helper from ember-truth-helpers }}
    {{#if (eq @user.role "admin")}}
      <span class="badge">Admin</span>
    {{/if}}
  </template>
}```

## Comparison Helpers (ember-truth-helpers)

**Installation:** `npm install ember-truth-helpers`

```glimmer-js
// app/components/comparison-examples.gjs
import Component from '@glimmer/component';
import { eq, not, and, or, lt, lte, gt, gte } from 'ember-truth-helpers';

class ComparisonExamples extends Component {
  <template>
    {{! Equality }}
    {{#if (eq @status "active")}}Active{{/if}}

    {{! Negation }}
    {{#if (not @isDeleted)}}Visible{{/if}}

    {{! Logical AND }}
    {{#if (and @isPremium @hasAccess)}}Premium Content{{/if}}

    {{! Logical OR }}
    {{#if (or @isAdmin @isModerator)}}Moderation Tools{{/if}}

    {{! Comparisons }}
    {{#if (gt @score 100)}}High Score!{{/if}}
    {{#if (lte @attempts 3)}}Try again{{/if}}
  </template>
}```

## Array and Object Helpers (ember-composable-helpers)

**Installation:** `npm install ember-composable-helpers`

```glimmer-js
// app/components/collection-helpers.gjs
import Component from '@glimmer/component';
import { array, hash } from 'ember-composable-helpers/helpers';
import { get } from 'ember-composable-helpers/helpers';

class CollectionHelpers extends Component {
  <template>
    {{! Create array inline }}
    {{#each (array "apple" "banana" "cherry") as |fruit|}}
      <li>{{fruit}}</li>
    {{/each}}

    {{! Create object inline }}
    {{#let (hash name="John" age=30 active=true) as |user|}}
      <p>{{user.name}} is {{user.age}} years old</p>
    {{/let}}

    {{! Dynamic property access }}
    <p>{{get @user @propertyName}}</p>
  </template>
}```

## String Helpers

```glimmer-js
// app/components/string-helpers.gjs
import Component from '@glimmer/component';
import { concat } from '@ember/helper'; // Built-in to Ember

class StringHelpers extends Component {
  <template>
    {{! Concatenate strings }}
    <p class={{concat "user-" @user.id "-card"}}>
      {{concat @user.firstName " " @user.lastName}}
    </p>

    {{! With dynamic values }}
    <img
      src={{concat "/images/" @category "/" @filename ".jpg"}}
      alt={{concat "Image of " @title}}
    />
  </template>
}```

## Action Helpers (fn)

```glimmer-js
// app/components/action-helpers.gjs
import Component from '@glimmer/component';
import { fn } from '@ember/helper'; // Built-in to Ember
import { on } from '@ember/modifier';

class ActionHelpers extends Component {
  updateValue = (field, event) => {
    this.args.onChange(field, event.target.value);
  };

  deleteItem = (id) => {
    this.args.onDelete(id);
  };

  <template>
    {{! Partial application with fn }}
    <input
      {{on "input" (fn this.updateValue "email")}}
    />

    {{#each @items as |item|}}
      <li>
        {{item.name}}
        <button {{on "click" (fn this.deleteItem item.id)}}>
          Delete
        </button>
      </li>
    {{/each}}
  </template>
}```

## Conditional Helpers (if/unless)

```glimmer-js
// app/components/conditional-inline.gjs
import Component from '@glimmer/component';
import { if as ifHelper } from '@ember/helper'; // Built-in to Ember

class ConditionalInline extends Component {
  <template>
    {{! Ternary-like behavior }}
    <span class={{ifHelper @isActive "active" "inactive"}}>
      {{@user.name}}
    </span>

    {{! Conditional attribute }}
    <button disabled={{ifHelper @isProcessing true}}>
      {{ifHelper @isProcessing "Processing..." "Submit"}}
    </button>

    {{! With default value }}
    <p>{{ifHelper @description @description "No description provided"}}</p>
  </template>
}```

## Practical Combinations

**Dynamic Classes:**
```glimmer-js
// app/components/dynamic-classes.gjs
import Component from '@glimmer/component';
import { concat, if as ifHelper } from '@ember/helper'; // Built-in to Ember
import { and, not } from 'ember-truth-helpers';

class DynamicClasses extends Component {
  <template>
    <div class={{concat
      "card "
      (ifHelper @isPremium "premium ")
      (ifHelper (and @isNew (not @isRead)) "unread ")
      @customClass
    }}>
      <h3>{{@title}}</h3>
    </div>
  </template>
}```

**List Filtering:**
```glimmer-js
// app/components/filtered-list.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { cached } from '@glimmer/tracking';
import { fn, concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { eq } from 'ember-truth-helpers';
import { array } from 'ember-composable-helpers/helpers';

class FilteredList extends Component {
  @tracked filter = 'all';

  @cached
  get filteredItems() {
    if (this.filter === 'all') return this.args.items;
    return this.args.items.filter(item => item.status === this.filter);
  }

  <template>
    <select {{on "change" (fn (mut this.filter) target.value)}}>
      {{#each (array "all" "active" "pending" "completed") as |option|}}
        <option
          value={{option}}
          selected={{eq this.filter option}}
        >
          {{option}}
        </option>
      {{/each}}
    </select>

    {{#each this.filteredItems as |item|}}
      <div class={{concat "item " item.status}}>
        {{item.name}}
      </div>
    {{/each}}
  </template>
}```

## Complex Example

```glimmer-js
// app/components/user-profile-card.gjs
import Component from '@glimmer/component';
import { concat, if as ifHelper, fn } from '@ember/helper'; // Built-in to Ember
import { eq, not, and, or } from 'ember-truth-helpers';
import { hash, array, get } from 'ember-composable-helpers/helpers';
import { on } from '@ember/modifier';

class UserProfileCard extends Component {
  updateField = (field, value) => {
    this.args.onUpdate(field, value);
  };

  <template>
    <div class={{concat
      "profile-card "
      (ifHelper @user.isPremium "premium ")
      (ifHelper (and @user.isOnline (not @user.isAway)) "online ")
    }}>
      <h2>{{concat @user.firstName " " @user.lastName}}</h2>

      {{#if (or (eq @user.role "admin") (eq @user.role "moderator"))}}
        <span class="badge">
          {{get (hash
            admin="Administrator"
            moderator="Moderator"
          ) @user.role}}
        </span>
      {{/if}}

      {{#if (and @canEdit (not @user.locked))}}
        <div class="actions">
          {{#each (array "profile" "settings" "privacy") as |section|}}
            <button {{on "click" (fn this.updateField "activeSection" section)}}>
              Edit {{section}}
            </button>
          {{/each}}
        </div>
      {{/if}}

      <p class={{ifHelper @user.verified "verified" "unverified"}}>
        {{ifHelper @user.bio @user.bio "No bio provided"}}
      </p>
    </div>
  </template>
}```

## Performance Impact

- **Library helpers**: ~0% overhead (compiled into efficient bytecode)
- **Custom helpers**: 5-15% overhead per helper call
- **Inline logic**: Cleaner templates, better tree-shaking

## When to Use

- **Library helpers**: For all common operations (equality, logic, arrays, strings)
- **Custom helpers**: Only for domain-specific logic not covered by library helpers
- **Component logic**: For complex operations that need @cached or multiple dependencies

## Complete Helper Reference

**Note:** These helpers will be built into Ember 7 core. Until then:

**Actually Built-in to Ember (from `@ember/helper`):**
- `concat` - Concatenate strings
- `fn` - Partial application / bind arguments
- `if` - Ternary-like conditional value
- `mut` - Create settable binding (use sparingly)

**From `ember-truth-helpers` package:**
- `eq` - Equality (===)
- `not` - Negation (!)
- `and` - Logical AND
- `or` - Logical OR
- `lt`, `lte`, `gt`, `gte` - Numeric comparisons

**From `ember-composable-helpers` package:**
- `array` - Create array inline
- `hash` - Create object inline
- `get` - Dynamic property access

## References

- [Ember Built-in Helpers](https://guides.emberjs.com/release/templates/built-in-helpers/)
- [Template Helpers API](https://api.emberjs.com/ember/release/modules/@ember%2Fhelper)
- [fn Helper Guide](https://guides.emberjs.com/release/components/helper-functions/)
- [ember-truth-helpers](https://github.com/jmurphyau/ember-truth-helpers)
- [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers)
