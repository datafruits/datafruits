---
title: Avoid CSS Classes in Learning Examples
impact: LOW-MEDIUM
impactDescription: Cleaner, more focused learning materials
tags: documentation, examples, learning, css, classes
---

## Avoid CSS Classes in Learning Examples

Don't add CSS classes to learning content and examples unless they provide actual value above the surrounding context. Classes add visual noise and distract from the concepts being taught.

**Incorrect (unnecessary classes in learning example):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

export class UserCard extends Component {
  <template>
    <div class="user-card">
      <div class="user-card__header">
        <h3 class="user-card__name">{{@user.name}}</h3>
        <p class="user-card__email">{{@user.email}}</p>
      </div>

      {{#if @user.avatarUrl}}
        <img class="user-card__avatar" src={{@user.avatarUrl}} alt={{@user.name}} />
      {{/if}}

      {{#if @onEdit}}
        <button class="user-card__edit-button" {{on "click" (fn @onEdit @user)}}>
          Edit
        </button>
      {{/if}}

      <div class="user-card__content">
        {{yield}}
      </div>
    </div>
  </template>
}
```

**Why This Is Wrong:**
- Classes add visual clutter that obscures the actual concepts
- Learners focus on naming conventions instead of the pattern being taught
- Makes copy-paste more work (need to remove or change class names)
- Implies these specific class names are required or best practice
- Distracts from structural HTML and component logic

**Correct (focused on concepts):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

export class UserCard extends Component {
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

**Benefits:**
- **Clarity**: Easier to understand the component structure
- **Focus**: Reader attention stays on the concepts being taught
- **Simplicity**: Less code to process mentally
- **Flexibility**: Reader can add their own classes without conflict
- **Reusability**: Examples are easier to adapt to real code

**When Classes ARE Appropriate in Examples:**

```glimmer-js
// Example: Teaching about conditional classes
export class StatusBadge extends Component {
  get statusClass() {
    return this.args.status === 'active' ? 'badge-success' : 'badge-error';
  }

  <template>
    <span class={{this.statusClass}}>
      {{@status}}
    </span>
  </template>
}
```

```glimmer-js
// Example: Teaching about ...attributes for styling flexibility
export class Card extends Component {
  <template>
    {{! Caller can add their own classes via ...attributes }}
    <div ...attributes>
      {{yield}}
    </div>
  </template>
}

{{! Usage: <Card class="user-card">...</Card> }}
```

**When to Include Classes:**

1. **Teaching class binding** - Example explicitly about conditional classes or class composition
2. **Demonstrating ...attributes** - Showing how callers add classes
3. **Accessibility** - Using classes for semantic meaning (e.g., `aria-*` helpers)
4. **Critical to example** - Class name is essential to understanding (e.g., `selected`, `active`)

**Examples Where Classes Add Value:**

```glimmer-js
// Good: Teaching about dynamic classes
export class TabButton extends Component {
  <template>
    <button
      class={{if @isActive "active"}}
      {{on "click" @onClick}}
    >
      {{yield}}
    </button>
  </template>
}
```

```glimmer-js
// Good: Teaching about class composition
import { cn } from 'ember-cn';

export class Button extends Component {
  <template>
    <button class={{cn "btn" (if @primary "btn-primary" "btn-secondary")}}>
      {{yield}}
    </button>
  </template>
}
```

**Default Stance:**

When writing learning examples or documentation:
1. **Start without classes** - Add them only if needed
2. **Ask**: Does this class help explain the concept?
3. **Remove** any decorative or structural classes that aren't essential
4. **Use** `...attributes` to show styling flexibility

**Real-World Context:**

In production code, you'll have classes for styling. But in learning materials, strip them away unless they're teaching something specific about classes themselves.

**Common Violations:**

❌ BEM classes in examples (`user-card__header`)
❌ Utility classes unless teaching utilities (`flex`, `mt-4`)
❌ Semantic classes that don't teach anything (`container`, `wrapper`)
❌ Design system classes unless teaching design system integration

**Summary:**

Keep learning examples focused on the concept being taught. CSS classes should appear only when they're essential to understanding the pattern or when demonstrating styling flexibility with `...attributes`.

Reference: [Ember Components Guide](https://guides.emberjs.com/release/components/)
