# Ember Best Practices

**Version 1.0.0**
Ember.js Community
January 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring Ember.js codebases. Humans
> may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization and accessibility guide for Ember.js applications, designed for AI agents and LLMs. Contains 42 rules across 7 categories, prioritized by impact from critical (route loading optimization, build performance) to advanced patterns (Resources, ember-concurrency, modern testing, composition patterns, owner/linkage management). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated refactoring and code generation. Uses WarpDrive for modern data management, includes accessibility best practices leveraging ember-a11y-testing and other OSS tools, and comprehensive coverage of reactive composition, data derivation, controlled forms, conditional rendering, data requesting patterns, built-in helpers, and service architecture patterns.

---

## Table of Contents

0. [Section 0](#0-section-0) — **HIGH**
   - 0.1 [Announce Route Transitions to Screen Readers](#01-announce-route-transitions-to-screen-readers)
   - 0.2 [Avoid Constructors in Components](#02-avoid-constructors-in-components)
   - 0.3 [Avoid CSS Classes in Learning Examples](#03-avoid-css-classes-in-learning-examples)
   - 0.4 [Avoid Heavy Computation in Templates](#04-avoid-heavy-computation-in-templates)
   - 0.5 [Avoid Legacy Lifecycle Hooks (did-insert, will-destroy, did-update)](#05-avoid-legacy-lifecycle-hooks-did-insert-will-destroy-did-update)
   - 0.6 [Avoid Unnecessary Tracking](#06-avoid-unnecessary-tracking)
   - 0.7 [Build Reactive Chains with Dependent Getters](#07-build-reactive-chains-with-dependent-getters)
   - 0.8 [Cache API Responses in Services](#08-cache-api-responses-in-services)
   - 0.9 [Compose Helpers for Reusable Logic](#09-compose-helpers-for-reusable-logic)
   - 0.10 [Form Labels and Error Announcements](#010-form-labels-and-error-announcements)
   - 0.11 [Implement Robust Data Requesting Patterns](#011-implement-robust-data-requesting-patterns)
   - 0.12 [Implement Smart Route Model Caching](#012-implement-smart-route-model-caching)
   - 0.13 [Import Helpers Directly in Templates](#013-import-helpers-directly-in-templates)
   - 0.14 [Keyboard Navigation Support](#014-keyboard-navigation-support)
   - 0.15 [Manage Service Owner and Linkage Patterns](#015-manage-service-owner-and-linkage-patterns)
   - 0.16 [MSW (Mock Service Worker) Setup for Testing](#016-msw-mock-service-worker-setup-for-testing)
   - 0.17 [No Default Exports (Except Route Templates)](#017-no-default-exports-except-route-templates)
   - 0.18 [No helper() Wrapper for Plain Functions](#018-no-helper-wrapper-for-plain-functions)
   - 0.19 [Optimize Conditional Rendering](#019-optimize-conditional-rendering)
   - 0.20 [Optimize WarpDrive Queries](#020-optimize-warpdrive-queries)
   - 0.21 [Parallel Data Loading in Model Hooks](#021-parallel-data-loading-in-model-hooks)
   - 0.22 [Prevent Memory Leaks in Components](#022-prevent-memory-leaks-in-components)
   - 0.23 [Provide DOM-Abstracted Test Utilities for Library Components](#023-provide-dom-abstracted-test-utilities-for-library-components)
   - 0.24 [Rule](#024-rule)
   - 0.25 [Semantic HTML and ARIA Attributes](#025-semantic-html-and-aria-attributes)
   - 0.26 [Template-Only Components with In-Scope Functions](#026-template-only-components-with-in-scope-functions)
   - 0.27 [Use {{#each}} with @key for Lists](#027-use-each-with-key-for-lists)
   - 0.28 [Use {{#let}} to Avoid Recomputation](#028-use-let-to-avoid-recomputation)
   - 0.29 [Use {{fn}} for Partial Application Only](#029-use-fn-for-partial-application-only)
   - 0.30 [Use {{on}} Modifier for Event Handling](#030-use-on-modifier-for-event-handling)
   - 0.31 [Use @cached for Expensive Getters](#031-use-cached-for-expensive-getters)
   - 0.32 [Use Appropriate Render Patterns in Tests](#032-use-appropriate-render-patterns-in-tests)
   - 0.33 [Use Class Fields for Component Composition](#033-use-class-fields-for-component-composition)
   - 0.34 [Use Component Composition Patterns](#034-use-component-composition-patterns)
   - 0.35 [Use ember-a11y-testing for Automated Checks](#035-use-ember-a11y-testing-for-automated-checks)
   - 0.36 [Use Glimmer Components Over Classic Components](#036-use-glimmer-components-over-classic-components)
   - 0.37 [Use Helper Libraries Effectively](#037-use-helper-libraries-effectively)
   - 0.38 [Use Loading Substates for Better UX](#038-use-loading-substates-for-better-ux)
   - 0.39 [Use Modern Testing Patterns](#039-use-modern-testing-patterns)
   - 0.40 [Use Native Forms with Platform Validation](#040-use-native-forms-with-platform-validation)
   - 0.41 [Use Route Templates with Co-located Syntax](#041-use-route-templates-with-co-located-syntax)
   - 0.42 [Use Route-Based Code Splitting](#042-use-route-based-code-splitting)
   - 0.43 [Use Services for Shared State](#043-use-services-for-shared-state)
   - 0.44 [Use Strict Mode and Template-Only Components](#044-use-strict-mode-and-template-only-components)
   - 0.45 [Use Test Waiters for Async Operations](#045-use-test-waiters-for-async-operations)
   - 0.46 [Use Tracked Toolbox for Complex State](#046-use-tracked-toolbox-for-complex-state)
   - 0.47 [Validate Component Arguments](#047-validate-component-arguments)
   - 0.48 [VSCode Extensions and MCP Configuration for Ember Projects](#048-vscode-extensions-and-mcp-configuration-for-ember-projects)
2. [Build and Bundle Optimization](#2-build-and-bundle-optimization) — **CRITICAL**
   - 2.1 [Avoid Importing Entire Addon Namespaces](#21-avoid-importing-entire-addon-namespaces)
   - 2.2 [Lazy Load Heavy Dependencies](#22-lazy-load-heavy-dependencies)
   - 2.3 [Use Embroider Build Pipeline](#23-use-embroider-build-pipeline)
8. [Section 8](#8-section-8) — **HIGH**
   - 8.1 [Use Ember Concurrency Correctly - User Concurrency Not Data Loading](#81-use-ember-concurrency-correctly---user-concurrency-not-data-loading)
   - 8.2 [Use Ember Concurrency for User Input Concurrency](#82-use-ember-concurrency-for-user-input-concurrency)
   - 8.3 [Use Helper Functions for Reusable Logic](#83-use-helper-functions-for-reusable-logic)
   - 8.4 [Use Modifiers for DOM Side Effects](#84-use-modifiers-for-dom-side-effects)

---

## 0. Section 0

**Impact: HIGH**

### 0.1 Announce Route Transitions to Screen Readers

**Impact: HIGH (Critical for screen reader navigation)**

Announce page title changes and route transitions to screen readers so users know when navigation has occurred.

**Incorrect: no announcements**

```javascript
// app/router.js
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}
```

**Correct: using a11y-announcer library - recommended**

Use the [a11y-announcer](https://github.com/ember-a11y/a11y-announcer) library for robust route announcements:

The a11y-announcer library automatically handles route announcements. For custom announcements in your routes:

**Alternative: DIY approach with ARIA live regions:**

If you prefer not to use a library, you can implement route announcements yourself:

/* app/styles/app.css */

.sr-only {

  position: absolute;

  width: 1px;

  height: 1px;

  padding: 0;

  margin: -1px;

  overflow: hidden;

  clip: rect(0, 0, 0, 0);

  white-space: nowrap;

  border-width: 0;

}

ember install ember-page-title

// app/routes/dashboard.gjs

import { pageTitle } from 'ember-page-title';

<template>

  {{pageTitle "Dashboard"}}

  <div class="dashboard">

    {{outlet}}

  </div>

</template>```

Route announcements ensure screen reader users know when navigation occurs, improving the overall accessibility experience.

Reference: [https://guides.emberjs.com/release/accessibility/page-template-considerations/](https://guides.emberjs.com/release/accessibility/page-template-considerations/)

### 0.2 Avoid Constructors in Components

**Impact: HIGH (Prevents infinite render loops and simplifies code)**

**Strongly discourage constructor usage.** Modern Ember components rarely need constructors. Use class fields, @service decorators, and getPromiseState for initialization instead. Constructors with function calls that set tracked state can cause infinite render loops.

- [Ember Octane Guide](https://guides.emberjs.com/release/upgrading/current-edition/)

- [warp-drive/reactiveweb](https://github.com/emberjs/data/tree/main/packages/reactiveweb)

**Incorrect: using constructor**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

class UserProfile extends Component {
  constructor() {
    super(...arguments);

    // Anti-pattern: Manual service lookup
    this.store = this.owner.lookup('service:store');
    this.router = this.owner.lookup('service:router');

    // Anti-pattern: Imperative initialization
    this.data = null;
    this.isLoading = false;
    this.error = null;

    // Anti-pattern: Side effects in constructor
    this.loadUserData();
  }

  async loadUserData() {
    this.isLoading = true;
    try {
      this.data = await this.store.request({
        url: `/users/${this.args.userId}`
      });
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }

  <template>
    {{#if this.isLoading}}
      <div>Loading...</div>
    {{else if this.error}}
      <div>Error: {{this.error.message}}</div>
    {{else if this.data}}
      <h1>{{this.data.name}}</h1>
    {{/if}}
  </template>
}```


**When You Might Need a Constructor (Very Rare):**

Very rarely, you might need a constructor for truly exceptional cases. Even then, use modern patterns:

```

// app/components/complex-setup.gjs

import Component from '@glimmer/component';

import { service } from '@ember/service';

import { tracked } from '@glimmer/tracking';

class ComplexSetup extends Component {

  @service store;

  @tracked state = null;

  constructor(owner, args) {

    super(owner, args);

    // Only if you absolutely must do something that can't be done with class fields

    // Even then, prefer resources or modifiers

    if (this.args.legacyInitMode) {

      this.initializeLegacyMode();

    }

  }

  initializeLegacyMode() {

    // Rare edge case initialization

  }

  <template>

    <!-- template -->

  </template>

}```

**Why Strongly Avoid Constructors:**

1. **Infinite Render Loops**: Setting tracked state in constructor that's read during render causes infinite loops

2. **Service Injection**: Use `@service` decorator instead of `owner.lookup()`

3. **Testability**: Class fields are easier to mock and test

4. **Clarity**: Declarative class fields show state at a glance

5. **Side Effects**: getPromiseState and modifiers handle side effects better

6. **Memory Leaks**: getPromiseState auto-cleanup; constructor code doesn't

7. **Reactivity**: Class fields integrate better with tracking

8. **Initialization Order**: No need to worry about super() call timing

9. **Argument Validation**: Constructor validation runs only once; use getters to catch arg changes

**Modern Alternatives:**

| Old Pattern | Modern Alternative |

|-------------|-------------------|

| `constructor() { this.store = owner.lookup('service:store') }` | `@service store;` |

| `constructor() { this.data = null; }` | `@tracked data = null;` |

| `constructor() { this.loadData(); }` | Use `@cached get` with getPromiseState |

| `constructor() { this.interval = setInterval(...) }` | Use modifier with registerDestructor |

| `constructor() { this.subscription = ... }` | Use modifier or constructor with registerDestructor ONLY |

**Performance Impact:**

- **Before**: Constructor runs on every instantiation, manual cleanup risk, infinite loop danger

- **After**: Class fields initialize efficiently, getPromiseState auto-cleanup, no render loops

**Strongly discourage constructors** - they add complexity and infinite render loop risks. Use declarative class fields and getPromiseState instead.

### 0.3 Avoid CSS Classes in Learning Examples

**Impact: LOW-MEDIUM (Cleaner, more focused learning materials)**

Don't add CSS classes to learning content and examples unless they provide actual value above the surrounding context. Classes add visual noise and distract from the concepts being taught.

**Incorrect: unnecessary classes in learning example**

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

**Correct: focused on concepts**

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

Reference: [https://guides.emberjs.com/release/components/](https://guides.emberjs.com/release/components/)

### 0.4 Avoid Heavy Computation in Templates

**Impact: MEDIUM (40-60% reduction in render time)**

Move expensive computations from templates to cached getters in the component class or in-scope functions for template-only components. Templates should only display data, not compute it. Keep templates easy for humans to read by minimizing nested function invocations.

**Why this matters:**

- Templates should be easy to read and understand

- Nested function calls create cognitive overhead

- Computations should be cached and reused, not recalculated on every render

- Template-only components (without `this`) need alternative patterns

**Incorrect: heavy computation in template**

```glimmer-js
// app/components/stats.gjs
import { sum, map, div, max, multiply, sortBy } from '../helpers/math';

<template>
  <div>
    <p>Total: {{sum (map @items "price")}}</p>
    <p>Average: {{div (sum (map @items "price")) @items.length}}</p>
    <p>Max: {{max (map @items "price")}}</p>

    {{#each (sortBy "name" @items) as |item|}}
      <div>{{item.name}}: {{multiply item.price item.quantity}}</div>
    {{/each}}
  </div>
</template>```

**Correct (computation in component with cached getters):**

```

// app/components/stats.gjs

import Component from '@glimmer/component';

import { cached } from '@glimmer/tracking';

export class Stats extends Component {

  // @cached is useful when getters are accessed multiple times

  // For single access, regular getters are sufficient

  @cached

  get total() {

    return this.args.items.reduce((sum, item) => sum + item.price, 0);

  }

  get average() {

    // No @cached needed if only accessed once in template

    return this.args.items.length > 0

      ? this.total / this.args.items.length

      : 0;

  }

  get maxPrice() {

    return Math.max(...this.args.items.map(item => item.price));

  }

  @cached

  get sortedItems() {

    // @cached useful here as it's used by itemsWithTotal

    return [...this.args.items].sort((a, b) =>

      a.name.localeCompare(b.name)

    );

  }

  @cached

  get itemsWithTotal() {

    // @cached useful as accessed multiple times in {{#each}}

    return this.sortedItems.map(item => ({

      ...item,

      total: item.price * item.quantity

    }));

  }

  <template>

    <div>

      <p>Total: {{this.total}}</p>

      <p>Average: {{this.average}}</p>

      <p>Max: {{this.maxPrice}}</p>

      {{#each this.itemsWithTotal key="id" as |item|}}

        <div>{{item.name}}: {{item.total}}</div>

      {{/each}}

    </div>

  </template>

}

### 0.5 Avoid Legacy Lifecycle Hooks (did-insert, will-destroy, did-update)

**Impact: HIGH (Prevents memory leaks and enforces modern patterns)**

**Never use `{{did-insert}}`, `{{will-destroy}}`, or `{{did-update}}` in new code.** These legacy helpers create coupling between templates and component lifecycle, making code harder to test and maintain. Modern Ember provides better alternatives through derived data and custom modifiers.

1. **Memory Leaks**: Easy to forget cleanup, especially with `did-insert`

2. **Tight Coupling**: Mixes template concerns with JavaScript logic

3. **Poor Testability**: Lifecycle hooks are harder to unit test

4. **Not Composable**: Can't be easily shared across components

5. **Deprecated Pattern**: Not recommended in modern Ember

For computed values or reactive transformations, use getters and `@cached`:

**❌ Incorrect (did-update):**

```glimmer-js
// app/components/user-greeting.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class UserGreeting extends Component {
  @tracked displayName = '';

  @action
  updateDisplayName() {
    // Runs on every render - inefficient and error-prone
    this.displayName = `${this.args.user.firstName} ${this.args.user.lastName}`;
  }

  <template>
    <div {{did-update this.updateDisplayName @user}}>
      Hello, {{this.displayName}}
    </div>
  </template>
}```

**✅ Correct (derived data with getter):**

```

// app/components/user-greeting.gjs

import Component from '@glimmer/component';

class UserGreeting extends Component {

  // Automatically reactive - updates when args change

  get displayName() {

    return `${this.args.user.firstName} ${this.args.user.lastName}`;

  }

  <template>

    <div>

      Hello, {{this.displayName}}

    </div>

  </template>

}```

**✅ Even better (use @cached for expensive computations):**

```glimmer-js
// app/components/user-stats.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class UserStats extends Component {
  @cached
  get sortedPosts() {
    // Expensive computation only runs when @posts changes
    return [...this.args.posts].sort((a, b) =>
      b.createdAt - a.createdAt
    );
  }

  @cached
  get statistics() {
    return {
      total: this.args.posts.length,
      published: this.args.posts.filter(p => p.published).length,
      drafts: this.args.posts.filter(p => !p.published).length
    };
  }

  <template>
    <div>
      <p>Total: {{this.statistics.total}}</p>
      <p>Published: {{this.statistics.published}}</p>
      <p>Drafts: {{this.statistics.drafts}}</p>

      <ul>
        {{#each this.sortedPosts as |post|}}
          <li>{{post.title}}</li>
        {{/each}}
      </ul>
    </div>
  </template>
}```

### Alternative 2: Use Custom Modifiers

For DOM side effects, element setup, or cleanup, use custom modifiers:

**❌ Incorrect (did-insert + will-destroy):**

```

// app/components/chart.gjs

import Component from '@glimmer/component';

import { action } from '@ember/object';

class Chart extends Component {

  chartInstance = null;

  @action

  setupChart(element) {

    this.chartInstance = new Chart(element, this.args.config);

  }

  willDestroy() {

    super.willDestroy(...arguments);

    // Easy to forget cleanup!

    this.chartInstance?.destroy();

  }

  <template>

    <canvas {{did-insert this.setupChart}}></canvas>

  </template>

}```

**✅ Correct (custom modifier with automatic cleanup):**

```glimmer-js
// app/components/chart.gjs
import chart from '../modifiers/chart';

<template>
  <canvas {{chart @config}}></canvas>
</template>```

### Alternative 3: Use Resources for Lifecycle Management

For complex state management with automatic cleanup, use `ember-resources`:

**❌ Incorrect (did-insert for data fetching):**

```

// app/components/user-profile.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

class UserProfile extends Component {

  @tracked userData = null;

  @tracked loading = true;

  controller = new AbortController();

  @action

  async loadUser() {

    this.loading = true;

    try {

      const response = await fetch(`/api/users/${this.args.userId}`, {

        signal: this.controller.signal

      });

      this.userData = await response.json();

    } finally {

      this.loading = false;

    }

  }

  willDestroy() {

    super.willDestroy(...arguments);

    this.controller.abort(); // Easy to forget!

  }

  <template>

    <div {{did-insert this.loadUser}}>

      {{#if this.loading}}

        Loading...

      {{else}}

        {{this.userData.name}}

      {{/if}}

    </div>

  </template>

}```

**✅ Correct (Resource with automatic cleanup):**

```javascript
// app/resources/user-data.js
import { Resource } from 'ember-resources';
import { tracked } from '@glimmer/tracking';

export default class UserDataResource extends Resource {
  @tracked data = null;
  @tracked loading = true;
  controller = new AbortController();

  modify(positional, named) {
    const [userId] = positional;
    this.loadUser(userId);
  }

  async loadUser(userId) {
    this.loading = true;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: this.controller.signal
      });
      this.data = await response.json();
    } finally {
      this.loading = false;
    }
  }

  willDestroy() {
    // Cleanup happens automatically
    this.controller.abort();
  }
}
```

### 0.6 Avoid Unnecessary Tracking

**Impact: HIGH (20-40% fewer invalidations)**

Only mark properties as `@tracked` if they need to trigger re-renders when changed. Overusing `@tracked` causes unnecessary invalidations and re-renders.

**Incorrect: everything tracked**

```javascript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Form extends Component {
  @tracked firstName = ''; // Used in template ✓
  @tracked lastName = '';  // Used in template ✓
  @tracked _formId = Date.now(); // Internal, never rendered ✗
  @tracked _validationCache = new Map(); // Internal state ✗

  @action
  validate() {
    this._validationCache.set('firstName', this.firstName.length > 0);
    // Unnecessary re-render triggered
  }
}
```

**Correct: selective tracking**

```javascript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Form extends Component {
  @tracked firstName = ''; // Rendered in template
  @tracked lastName = '';  // Rendered in template
  @tracked isValid = false; // Rendered status

  _formId = Date.now(); // Not tracked - internal only
  _validationCache = new Map(); // Not tracked - internal state

  @action
  validate() {
    this._validationCache.set('firstName', this.firstName.length > 0);
    this.isValid = this._validationCache.get('firstName');
    // Only re-renders when isValid changes
  }
}
```

Only track properties that directly affect the template or other tracked getters to minimize unnecessary re-renders.

### 0.7 Build Reactive Chains with Dependent Getters

**Impact: HIGH (Clear data flow and automatic reactivity)**

Create reactive chains where getters depend on other getters or tracked properties for clear, maintainable data derivation.

**Incorrect: imperative updates**

```glimmer-js
// app/components/shopping-cart.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class ShoppingCart extends Component {
  @tracked items = [];
  @tracked subtotal = 0;
  @tracked tax = 0;
  @tracked shipping = 0;
  @tracked total = 0;

  @action
  addItem(item) {
    this.items = [...this.items, item];
    this.recalculate();
  }

  @action
  removeItem(index) {
    this.items = this.items.filter((_, i) => i !== index);
    this.recalculate();
  }

  recalculate() {
    this.subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    this.tax = this.subtotal * 0.08;
    this.shipping = this.subtotal > 50 ? 0 : 5.99;
    this.total = this.subtotal + this.tax + this.shipping;
  }

  <template>
    <div class="cart">
      <div>Subtotal: ${{this.subtotal}}</div>
      <div>Tax: ${{this.tax}}</div>
      <div>Shipping: ${{this.shipping}}</div>
      <div>Total: ${{this.total}}</div>
    </div>
  </template>
}```

**Correct (reactive getter chains):**

```

// app/components/shopping-cart.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

import { TrackedArray } from 'tracked-built-ins';

class ShoppingCart extends Component {

  @tracked items = new TrackedArray([]);

  // Base calculation

  get subtotal() {

    return this.items.reduce((sum, item) => sum + item.price, 0);

  }

  // Depends on subtotal

  get tax() {

    return this.subtotal * 0.08;

  }

  // Depends on subtotal

  get shipping() {

    return this.subtotal > 50 ? 0 : 5.99;

  }

  // Depends on subtotal, tax, and shipping

  get total() {

    return this.subtotal + this.tax + this.shipping;

  }

  // Derived from total

  get formattedTotal() {

    return `$${this.total.toFixed(2)}`;

  }

  // Multiple dependencies

  get discount() {

    if (this.items.length >= 5) return this.subtotal * 0.1;

    if (this.subtotal > 100) return this.subtotal * 0.05;

    return 0;

  }

  // Depends on total and discount

  get finalTotal() {

    return this.total - this.discount;

  }

  @action

  addItem(item) {

    this.items.push(item);

    // All getters automatically update!

  }

  @action

  removeItem(index) {

    this.items.splice(index, 1);

    // All getters automatically update!

  }

  <template>

    <div class="cart">

      <div>Items: {{this.items.length}}</div>

      <div>Subtotal: ${{this.subtotal.toFixed 2}}</div>

      <div>Tax: ${{this.tax.toFixed 2}}</div>

      <div>Shipping: ${{this.shipping.toFixed 2}}</div>

      {{#if this.discount}}

        <div class="discount">Discount: -${{this.discount.toFixed 2}}</div>

      {{/if}}

      <div class="total">Total: {{this.formattedTotal}}</div>

    </div>

  </template>

}```

**Complex reactive chains with @cached:**

```glimmer-js
// app/components/data-analysis.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class DataAnalysis extends Component {
  // Base data
  get rawData() {
    return this.args.data || [];
  }

  // Level 1: Filter
  @cached
  get validData() {
    return this.rawData.filter(item => item.value != null);
  }

  // Level 2: Transform (depends on validData)
  @cached
  get normalizedData() {
    const max = Math.max(...this.validData.map(d => d.value));
    return this.validData.map(item => ({
      ...item,
      normalized: item.value / max
    }));
  }

  // Level 2: Statistics (depends on validData)
  @cached
  get statistics() {
    const values = this.validData.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;

    return {
      count: values.length,
      sum,
      mean,
      stdDev: Math.sqrt(variance),
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  // Level 3: Depends on normalizedData and statistics
  @cached
  get outliers() {
    const threshold = this.statistics.mean + (2 * this.statistics.stdDev);
    return this.normalizedData.filter(item => item.value > threshold);
  }

  // Level 3: Depends on statistics
  get qualityScore() {
    const validRatio = this.validData.length / this.rawData.length;
    const outlierRatio = this.outliers.length / this.validData.length;
    return (validRatio * 0.7) + ((1 - outlierRatio) * 0.3);
  }

  <template>
    <div class="analysis">
      <h3>Data Quality: {{this.qualityScore.toFixed 2}}</h3>
      <div>Valid: {{this.validData.length}} / {{this.rawData.length}}</div>
      <div>Mean: {{this.statistics.mean.toFixed 2}}</div>
      <div>Std Dev: {{this.statistics.stdDev.toFixed 2}}</div>
      <div>Outliers: {{this.outliers.length}}</div>
    </div>
  </template>
}```

**Combining multiple tracked sources:**

```

// app/components/filtered-list.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { cached } from '@glimmer/tracking';

class FilteredList extends Component {

  @tracked searchTerm = '';

  @tracked selectedCategory = 'all';

  @tracked sortDirection = 'asc';

  // Depends on args.items and searchTerm

  @cached

  get searchFiltered() {

    if (!this.searchTerm) return this.args.items;

    const term = this.searchTerm.toLowerCase();

    return this.args.items.filter(item =>

      item.name.toLowerCase().includes(term) ||

      item.description?.toLowerCase().includes(term)

    );

  }

  // Depends on searchFiltered and selectedCategory

  @cached

  get categoryFiltered() {

    if (this.selectedCategory === 'all') return this.searchFiltered;

    return this.searchFiltered.filter(item =>

      item.category === this.selectedCategory

    );

  }

  // Depends on categoryFiltered and sortDirection

  @cached

  get sorted() {

    const items = [...this.categoryFiltered];

    const direction = this.sortDirection === 'asc' ? 1 : -1;

    return items.sort((a, b) =>

      direction * a.name.localeCompare(b.name)

    );

  }

  // Final result

  get items() {

    return this.sorted;

  }

  // Metadata derived from chain

  get resultsCount() {

    return this.items.length;

  }

  get hasFilters() {

    return this.searchTerm || this.selectedCategory !== 'all';

  }

  <template>

    <div class="filtered-list">

      <input

        type="search"

        value={{this.searchTerm}}

        {{on "input" (pick "target.value" (set this "searchTerm"))}}

      />

      <select

        value={{this.selectedCategory}}

        {{on "change" (pick "target.value" (set this "selectedCategory"))}}

      >

        <option value="all">All Categories</option>

        {{#each @categories as |cat|}}

          <option value={{cat}}>{{cat}}</option>

        {{/each}}

      </select>

      <p>Showing {{this.resultsCount}} results</p>

      {{#each this.items as |item|}}

        <div>{{item.name}}</div>

      {{/each}}

    </div>

  </template>

}```

Reactive getter chains provide automatic updates, clear data dependencies, and better performance through intelligent caching with @cached.

Reference: [https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)

### 0.8 Cache API Responses in Services

**Impact: MEDIUM-HIGH (50-90% reduction in duplicate requests)**

Cache API responses in services to avoid duplicate network requests. Use tracked properties to make the cache reactive.

**Incorrect: no caching**

```javascript
// app/services/user.js
import Service from '@ember/service';
import { service } from '@ember/service';

export default class UserService extends Service {
  @service store;

  async getCurrentUser() {
    // Fetches from API every time
    return this.store.request({ url: '/users/me' });
  }
}
```

**Correct: with caching**

```javascript
// app/services/user.js
import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackedMap } from 'tracked-built-ins';

export default class UserService extends Service {
  @service store;

  @tracked currentUser = null;
  cache = new TrackedMap();

  async getCurrentUser() {
    if (!this.currentUser) {
      const response = await this.store.request({ url: '/users/me' });
      this.currentUser = response.content.data;
    }
    return this.currentUser;
  }

  async getUser(id) {
    if (!this.cache.has(id)) {
      const response = await this.store.request({ url: `/users/${id}` });
      this.cache.set(id, response.content.data);
    }
    return this.cache.get(id);
  }

  clearCache() {
    this.currentUser = null;
    this.cache.clear();
  }
}
```

**For time-based cache invalidation:**

```javascript
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DataService extends Service {
  @tracked _cache = null;
  _cacheTimestamp = null;
  _cacheDuration = 5 * 60 * 1000; // 5 minutes

  async getData() {
    const now = Date.now();
    const isCacheValid = this._cache &&
      this._cacheTimestamp &&
      (now - this._cacheTimestamp) < this._cacheDuration;

    if (!isCacheValid) {
      this._cache = await this.fetchData();
      this._cacheTimestamp = now;
    }

    return this._cache;
  }

  async fetchData() {
    const response = await fetch('/api/data');
    return response.json();
  }
}
```

Caching in services prevents duplicate API requests and improves performance significantly.

### 0.9 Compose Helpers for Reusable Logic

**Impact: MEDIUM-HIGH (Better code reuse and testability)**

Compose helpers to create reusable, testable logic that can be combined in templates and components.

**Incorrect: logic duplicated in templates**

```glimmer-js
// app/components/user-profile.gjs
<template>
  <div class="profile">
    <h1>{{uppercase (truncate @user.name 20)}}</h1>

    {{#if (and @user.isActive (not @user.isDeleted))}}
      <span class="status">Active</span>
    {{/if}}

    <p>{{lowercase @user.email}}</p>

    {{#if (gt @user.posts.length 0)}}
      <span>Posts: {{@user.posts.length}}</span>
    {{/if}}
  </div>
</template>
```

**Correct: composed helpers**

```glimmer-js
// app/components/user-profile.gjs
import { displayName } from '../helpers/display-name';
import { isVisibleUser } from '../helpers/is-visible-user';
import { formatEmail } from '../helpers/format-email';

<template>
  <div class="profile">
    <h1>{{displayName @user.name}}</h1>

    {{#if (isVisibleUser @user)}}
      <span class="status">Active</span>
    {{/if}}

    <p>{{formatEmail @user.email}}</p>

    {{#if (gt @user.posts.length 0)}}
      <span>Posts: {{@user.posts.length}}</span>
    {{/if}}
  </div>
</template>
```

**Functional composition with pipe helper:**

```javascript
// app/helpers/pipe.js
export function pipe(...fns) {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}
```

**Or use a compose helper:**

```javascript
// app/helpers/compose.js
export function compose(...helperFns) {
  return (value) => helperFns.reduceRight((acc, fn) => fn(acc), value);
}
```

**Usage:**

```glimmer-js
// app/components/text-processor.gjs
import { fn } from '@ember/helper';

// Individual helpers
const uppercase = (str) => str?.toUpperCase() || '';
const trim = (str) => str?.trim() || '';
const truncate = (str, length = 20) => str?.slice(0, length) || '';

<template>
  {{! Compose multiple transformations }}
  <div>
    {{pipe @text (fn trim) (fn uppercase) (fn truncate 50)}}
  </div>
</template>
```

**Higher-order helpers:**

```glimmer-js
// Usage in template
import { mapBy } from '../helpers/map-by';
import { partialApply } from '../helpers/partial-apply';

<template>
  {{! Extract property from array }}
  <ul>
    {{#each (mapBy @users "name") as |name|}}
      <li>{{name}}</li>
    {{/each}}
  </ul>

  {{! Partial application }}
  {{#let (partialApply @formatNumber 2) as |formatTwoDecimals|}}
    <span>Price: {{formatTwoDecimals @price}}</span>
  {{/let}}
</template>
```

**Chainable transformation helpers:**

```glimmer-js
// Usage
import { transform } from '../helpers/transform';

<template>
  {{#let (transform @items) as |t|}}
    {{#each t.filter((i) => i.active).sort((a, b) => a.name.localeCompare(b.name)).take(10).result as |item|}}
      <div>{{item.name}}</div>
    {{/each}}
  {{/let}}
</template>
```

**Conditional composition:**

```javascript
// app/helpers/unless.js
export function unless(condition, falseFn, trueFn) {
  return !condition ? falseFn() : (trueFn ? trueFn() : null);
}
```

**Testing composed helpers:**

```javascript
// tests/helpers/display-name-test.js
import { module, test } from 'qunit';
import { displayName } from 'my-app/helpers/display-name';

module('Unit | Helper | display-name', function() {
  test('it formats name correctly', function(assert) {
    assert.strictEqual(
      displayName('John Doe'),
      'JOHN DOE'
    );
  });

  test('it truncates long names', function(assert) {
    assert.strictEqual(
      displayName('A Very Long Name That Should Be Truncated', { maxLength: 10 }),
      'A VERY LON...'
    );
  });

  test('it handles null', function(assert) {
    assert.strictEqual(displayName(null), '');
  });
});
```

Composed helpers provide testable, reusable logic that keeps templates clean and components focused on behavior rather than data transformation.

Reference: [https://guides.emberjs.com/release/components/helper-functions/](https://guides.emberjs.com/release/components/helper-functions/)

### 0.10 Form Labels and Error Announcements

**Impact: HIGH (Essential for screen reader users)**

All form inputs must have associated labels, and validation errors should be announced to screen readers using ARIA live regions.

**Incorrect: missing labels and announcements**

```glimmer-js
// app/components/form.gjs
<template>
  <form {{on "submit" this.handleSubmit}}>
    <input
      type="email"
      value={{this.email}}
      {{on "input" this.updateEmail}}
      placeholder="Email"
    />

    {{#if this.emailError}}
      <span>{{this.emailError}}</span>
    {{/if}}

    <button type="submit">Submit</button>
  </form>
</template>```

**Correct (with labels and announcements):**

```

// app/components/form.gjs

<template>

  <form {{on "submit" this.handleSubmit}}>

    <div>

      <label for="email-input">

        Email Address

        {{#if this.isEmailRequired}}

          <span aria-label="required">*</span>

        {{/if}}

      </label>

      <input

        id="email-input"

        type="email"

        value={{this.email}}

        {{on "input" this.updateEmail}}

        aria-describedby={{if this.emailError "email-error"}}

        aria-invalid={{if this.emailError "true"}}

        required={{this.isEmailRequired}}

      />

      {{#if this.emailError}}

        <span

          id="email-error"

          role="alert"

          aria-live="polite"

        >

          {{this.emailError}}

        </span>

      {{/if}}

    </div>

    <button type="submit" disabled={{this.isSubmitting}}>

      {{#if this.isSubmitting}}

        <span aria-live="polite">Submitting...</span>

      {{else}}

        Submit

      {{/if}}

    </button>

  </form>

</template>```

**For complex forms, use platform-native validation with custom logic:**

### 0.11 Implement Robust Data Requesting Patterns

**Impact: HIGH**

Naive data fetching creates waterfall requests, doesn't handle errors properly, and can cause race conditions or memory leaks from uncanceled requests.

**Incorrect:**

```typescript

## Batch Requests

Optimize multiple similar requests:

```

Use `RSVP.hash` or `Promise.all` for parallel loading:

Handle errors gracefully with fallbacks:

Prevent race conditions by canceling stale requests:

// app/services/data-fetcher.js

import Service, { service } from '@ember/service';

import { tracked } from '@glimmer/tracking';

import { registerDestructor } from '@ember/destroyable';

export default class DataFetcherService extends Service {

  @service store;

  @tracked data = null;

  @tracked isLoading = false;

  abortController = null;

  constructor() {

    super(...arguments);

    registerDestructor(this, () => {

      this.abortController?.abort();

    });

  }

  async fetch(url) {

    // Cancel previous request

    this.abortController?.abort();

    this.abortController = new AbortController();

    this.isLoading = true;

    try {

      // Note: WarpDrive handles AbortSignal internally

      const response = await this.store.request({

        url,

        signal: this.abortController.signal

      });

      this.data = response.content;

    } catch (error) {

      if (error.name !== 'AbortError') {

        throw error;

      }

    } finally {

      this.isLoading = false;

    }

  }

}

// app/routes/post.js

import Route from '@ember/routing/route';

import { hash } from 'rsvp';

export default class PostRoute extends Route {

  async model({ post_id }) {

    // First fetch the post

    const post = await this.store.request({

      url: `/posts/${post_id}`

    });

    // Then fetch related data in parallel

    return hash({

      post,

      author: this.store.request({

        url: `/users/${post.content.authorId}`

      }),

      comments: this.store.request({

        url: `/posts/${post_id}/comments`

      }),

      relatedPosts: this.store.request({

        url: `/posts/${post_id}/related`

      })

    });

  }

}

// app/services/live-data.js

import Service, { service } from '@ember/service';

import { tracked } from '@glimmer/tracking';

import { registerDestructor } from '@ember/destroyable';

export default class LiveDataService extends Service {

  @service store;

  @tracked data = null;

  intervalId = null;

  constructor() {

    super(...arguments);

    registerDestructor(this, () => {

      this.stopPolling();

    });

  }

  startPolling(url, interval = 5000) {

    this.stopPolling();

    this.poll(url); // Initial fetch

    this.intervalId = setInterval(() => this.poll(url), interval);

  }

  async poll(url) {

    try {

      const response = await this.store.request({ url });

      this.data = response.content;

    } catch (error) {

      console.error('Polling error:', error);

    }

  }

  stopPolling() {

    if (this.intervalId) {

      clearInterval(this.intervalId);

      this.intervalId = null;

    }

  }

}

// app/services/batch-loader.js

import Service, { service } from '@ember/service';

export default class BatchLoaderService extends Service {

  @service store;

  pendingIds = new Set();

  batchTimeout = null;

  async loadUser(id) {

    this.pendingIds.add(id);

    if (!this.batchTimeout) {

      this.batchTimeout = setTimeout(() => this.executeBatch(), 50);

    }

    // Return a promise that resolves when batch completes

    return new Promise((resolve) => {

      this.registerCallback(id, resolve);

    });

  }

  async executeBatch() {

    const ids = Array.from(this.pendingIds);

    this.pendingIds.clear();

    this.batchTimeout = null;

    const response = await this.store.request({

      url: `/users?ids=${ids.join(',')}`

    });

    // Resolve all pending promises

    response.content.forEach(user => {

      this.resolveCallback(user.id, user);

    });

  }

}

### 0.12 Implement Smart Route Model Caching

**Impact: MEDIUM-HIGH (Reduce redundant API calls and improve UX)**

Implement intelligent model caching strategies to reduce redundant API calls and improve user experience.

**Incorrect: always fetches fresh data**

```glimmer-js
// app/routes/post.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;

  model(params) {
    // Always makes API call, even if we just loaded this post
    return this.store.request({ url: `/posts/${params.post_id}` });
  }

  <template>
    <article>
      <h1>{{@model.title}}</h1>
      <div>{{@model.content}}</div>
    </article>
    {{outlet}}
  </template>
}```

**Correct (with smart caching):**

```

// app/routes/post.gjs

import Route from '@ember/routing/route';

import { service } from '@ember/service';

export default class PostRoute extends Route {

  @service store;

  model(params) {

    // Check cache first

    const cached = this.store.cache.peek({

      type: 'post',

      id: params.post_id

    });

    // Return cached if fresh (less than 5 minutes old)

    if (cached && this.isCacheFresh(cached)) {

      return cached;

    }

    // Fetch fresh data

    return this.store.request({

      url: `/posts/${params.post_id}`,

      options: { reload: true }

    });

  }

  isCacheFresh(record) {

    const cacheTime = record.meta?.cachedAt || 0;

    const fiveMinutes = 5 * 60 * 1000;

    return (Date.now() - cacheTime) < fiveMinutes;

  }

  <template>

    <article>

      <h1>{{@model.title}}</h1>

      <div>{{@model.content}}</div>

    </article>

    {{outlet}}

  </template>

}```

**Service-based caching layer:**

```glimmer-js
// app/routes/post.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service postCache;

  model(params) {
    return this.postCache.getPost(params.post_id);
  }

  // Refresh data when returning to route
  async activate() {
    super.activate(...arguments);
    const params = this.paramsFor('post');
    await this.postCache.getPost(params.post_id, { forceRefresh: true });
  }

  <template>
    <article>
      <h1>{{@model.title}}</h1>
      <div>{{@model.content}}</div>
    </article>
    {{outlet}}
  </template>
}```

**Using query params for cache control:**

```

// app/routes/posts.gjs

import Route from '@ember/routing/route';

import { service } from '@ember/service';

export default class PostsRoute extends Route {

  @service store;

  queryParams = {

    refresh: { refreshModel: true }

  };

  model(params) {

    const options = params.refresh

      ? { reload: true }

      : { backgroundReload: true };

    return this.store.request({

      url: '/posts',

      options

    });

  }

  <template>

    <div class="posts">

      <button {{on "click" (fn this.refresh)}}>

        Refresh

      </button>

      <ul>

        {{#each @model as |post|}}

          <li>{{post.title}}</li>

        {{/each}}

      </ul>

    </div>

    {{outlet}}

  </template>

}```

**Background refresh pattern:**

### 0.13 Import Helpers Directly in Templates

**Impact: MEDIUM (Better tree-shaking and clarity)**

Import helpers directly in gjs/gts files for better tree-shaking, clearer dependencies, and improved type safety.

**Incorrect: global helper resolution**

```glimmer-js
// app/components/user-profile.gjs
<template>
  <div class="profile">
    <h1>{{capitalize @user.name}}</h1>
    <p>Joined: {{format-date @user.createdAt}}</p>
    <p>Posts: {{pluralize @user.postCount "post"}}</p>
  </div>
</template>```

**Correct (explicit helper imports):**

```

// app/components/user-profile.gjs

import { capitalize } from 'ember-string-helpers';

import { formatDate } from 'ember-intl';

import { pluralize } from 'ember-inflector';

<template>

  <div class="profile">

    <h1>{{capitalize @user.name}}</h1>

    <p>Joined: {{formatDate @user.createdAt}}</p>

    <p>Posts: {{pluralize @user.postCount "post"}}</p>

  </div>

</template>```

**Built-in and library helpers:**

// app/utils/format-currency.js

export function formatCurrency(amount, { currency = 'USD' } = {}) {

  return new Intl.NumberFormat('en-US', {

    style: 'currency',

    currency

  }).format(amount);

}

// app/components/price-display.gjs

import { formatCurrency } from '../utils/format-currency';

<template>

  <div class="price">

    {{formatCurrency @amount currency="EUR"}}

  </div>

</template>```

**Type-safe helpers with TypeScript:**

```glimmer-ts
// app/components/typed-component.gts
import { fn } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

interface Signature {
  Args: {
    items: Array<{ id: string; name: string }>;
    onSelect: (id: string) => void;
  };
}

const TypedComponent: TOC<Signature> = <template>
  <ul>
    {{#each @items as |item|}}
      <li {{on "click" (fn @onSelect item.id)}}>
        {{item.name}}
      </li>
    {{/each}}
  </ul>
</template>;

export default TypedComponent;
```

Explicit helper imports enable better tree-shaking, make dependencies clear, and improve IDE support with proper type checking.

Reference: [https://github.com/ember-template-imports/ember-template-imports](https://github.com/ember-template-imports/ember-template-imports)

### 0.14 Keyboard Navigation Support

**Impact: HIGH (Critical for keyboard-only users)**

Ensure all interactive elements are keyboard accessible and focus management is handled properly, especially in modals and dynamic content.

**Incorrect: no keyboard support**

```glimmer-js
// app/components/dropdown.gjs
<template>
  <div class="dropdown" {{on "click" this.toggleMenu}}>
    Menu
    {{#if this.isOpen}}
      <div class="dropdown-menu">
        <div {{on "click" this.selectOption}}>Option 1</div>
        <div {{on "click" this.selectOption}}>Option 2</div>
      </div>
    {{/if}}
  </div>
</template>
```

**Correct: full keyboard support with custom modifier**

```glimmer-js
// app/components/dropdown.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import focusFirst from '../modifiers/focus-first';

class Dropdown extends Component {
  @tracked isOpen = false;

  @action
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  @action
  handleButtonKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isOpen = true;
    }
  }

  @action
  handleMenuKeyDown(event) {
    if (event.key === 'Escape') {
      this.isOpen = false;
      // Return focus to button
      event.target.closest('.dropdown').querySelector('button').focus();
    }
    // Handle arrow key navigation between menu items
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveFocus(event.key === 'ArrowDown' ? 1 : -1);
    }
  }

  moveFocus(direction) {
    const items = Array.from(
      document.querySelectorAll('[role="menuitem"] button')
    );
    const currentIndex = items.indexOf(document.activeElement);
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  @action
  selectOption(value) {
    this.args.onSelect?.(value);
    this.isOpen = false;
  }

  <template>
    <div class="dropdown">
      <button
        type="button"
        {{on "click" this.toggleMenu}}
        {{on "keydown" this.handleButtonKeyDown}}
        aria-haspopup="true"
        aria-expanded="{{this.isOpen}}"
      >
        Menu
      </button>

      {{#if this.isOpen}}
        <ul
          class="dropdown-menu"
          role="menu"
          {{focusFirst '[role="menuitem"] button'}}
          {{on "keydown" this.handleMenuKeyDown}}
        >
          <li role="menuitem">
            <button type="button" {{on "click" (fn this.selectOption "1")}}>
              Option 1
            </button>
          </li>
          <li role="menuitem">
            <button type="button" {{on "click" (fn this.selectOption "2")}}>
              Option 2
            </button>
          </li>
        </ul>
      {{/if}}
    </div>
  </template>
}
```

**For focus trapping in modals, use ember-focus-trap:**

```bash
npm install @fluentui/keyboard-keys
```

**Alternative: Use libraries for keyboard support:**

For complex keyboard interactions, consider using libraries that abstract keyboard support patterns:

Or use [tabster](https://tabster.io/) for comprehensive keyboard navigation management including focus trapping, arrow key navigation, and modalizers.

Proper keyboard navigation ensures all users can interact with your application effectively.

Reference: [https://guides.emberjs.com/release/accessibility/keyboard/](https://guides.emberjs.com/release/accessibility/keyboard/)

### 0.15 Manage Service Owner and Linkage Patterns

**Impact: MEDIUM-HIGH (Better service organization and dependency management)**

Understand how to manage service linkage, owner passing, and alternative service organization patterns beyond the traditional app/services directory.

**Incorrect: manual service instantiation**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import ApiService from '../services/api';

class UserProfile extends Component {
  // ❌ Creates orphaned instance without owner
  api = new ApiService();

  async loadUser() {
    // Won't have access to other services or owner features
    return this.api.fetch('/user/me');
  }

  <template>
    <div>{{@user.name}}</div>
  </template>
}```

**Correct (proper service injection with owner):**

```

// app/components/user-profile.gjs

import Component from '@glimmer/component';

import { service } from '@ember/service';

class UserProfile extends Component {

  // ✅ Proper injection with owner linkage

  @service api;

  async loadUser() {

    // Has full owner context and can inject other services

    return this.api.fetch('/user/me');

  }

  <template>

    <div>{{@user.name}}</div>

  </template>

}```

**Creating instances with owner:**

// app/utils/logger-factory.js

import { getOwner } from '@ember/application';

class Logger {

  constructor(owner, context) {

    this.owner = owner;

    this.context = context;

  }

  get config() {

    // Access configuration service via owner

    return getOwner(this).lookup('service:config');

  }

  log(message) {

    if (this.config.enableLogging) {

      console.log(`[${this.context}]`, message);

    }

  }

}

export function createLogger(owner, context) {

  return new Logger(owner, context);

}

// Usage in component

import Component from '@glimmer/component';

import { getOwner } from '@ember/application';

import { createLogger } from '../utils/logger-factory';

class My extends Component {

  logger = createLogger(getOwner(this), 'MyComponent');

  performAction() {

    this.logger.log('Action performed');

  }

  <template>

    <button {{on "click" this.performAction}}>Do Something</button>

  </template>

}```

**Using reactiveweb's link() for ownership and destruction:**

```glimmer-js
// app/components/advanced-form.gjs
import Component from '@glimmer/component';
import { link } from 'reactiveweb/link';

class ValidationService {
  validate(data) {
    // Validation logic
    return data.email && data.email.includes('@');
  }
}

class FormStateManager {
  data = { email: '' };

  updateEmail(value) {
    this.data.email = value;
  }
}

export class AdvancedForm extends Component {
  // link() handles both owner and destruction automatically
  validation = link(this, () => new ValidationService());
  formState = link(this, () => new FormStateManager());

  get isValid() {
    return this.validation.validate(this.formState.data);
  }

  <template>
    <form>
      <input value={{this.formState.data.email}} />
      {{#if (not this.isValid)}}
        <span>Invalid form</span>
      {{/if}}
    </form>
  </template>
}
```

The `link()` function from `reactiveweb` provides both ownership transfer and automatic destruction linkage.

**Why use link():**

- Automatically transfers owner from parent to child instance

- Registers destructor so child is cleaned up when parent is destroyed

- No manual `setOwner` or `registerDestructor` calls needed

- See [RFC #1067](https://github.com/emberjs/rfcs/pull/1067) for the proposal and reasoning

- Documentation: https://reactive.nullvoxpopuli.com/functions/link.link.html

**Using createService from ember-primitives:**

```glimmer-js
// app/components/analytics-tracker.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { createService } from 'ember-primitives/utils';

// Define service logic as a plain function
function AnalyticsService() {
  let events = [];

  return {
    get events() {
      return events;
    },

    track(event) {
      events.push({ ...event, timestamp: Date.now() });

      // Send to analytics endpoint
      fetch('/analytics', {
        method: 'POST',
        body: JSON.stringify(event)
      });
    }
  };
}

export class AnalyticsTracker extends Component {
  // createService handles owner linkage and cleanup automatically
  analytics = createService(this, AnalyticsService);

  <template>
    <div>Tracking {{this.analytics.events.length}} events</div>
  </template>
}
```

**Why createService:**

- No need to extend Service class

- Automatic owner linkage and cleanup

- Simpler than manual setOwner/registerDestructor

- Documentation: https://ce1d7e18.ember-primitives.pages.dev/6-utils/createService.md

**Co-located services with components:**

// app/utils/notification-manager.js

import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

import { TrackedArray } from 'tracked-built-ins';

import { setOwner } from '@ember/application';

export class NotificationManager {

  @tracked notifications = new TrackedArray([]);

  constructor(owner) {

    setOwner(this, owner);

  }

  @action

  add(message, type = 'info') {

    const notification = {

      id: Math.random().toString(36),

      message,

      type,

      timestamp: Date.now()

    };

    this.notifications.push(notification);

    // Auto-dismiss after 5 seconds

    setTimeout(() => this.dismiss(notification.id), 5000);

  }

  @action

  dismiss(id) {

    const index = this.notifications.findIndex(n => n.id === id);

    if (index > -1) this.notifications.splice(index, 1);

  }

}

// app/components/notification-container.gjs

import Component from '@glimmer/component';

import { getOwner } from '@ember/application';

import { NotificationManager } from '../utils/notification-manager';

class NotificationContainer extends Component {

  notifications = new NotificationManager(getOwner(this));

  <template>

    <div class="notifications">

      {{#each this.notifications.notifications as |notif|}}

        <div class="notification notification-{{notif.type}}">

          {{notif.message}}

          <button {{on "click" (fn this.notifications.dismiss notif.id)}}>

            ×

          </button>

        </div>

      {{/each}}

    </div>

    {{! Example usage }}

    <button {{on "click" (fn this.notifications.add "Success!" "success")}}>

      Show Notification

    </button>

  </template>

}```

**Runtime service registration:**

```javascript
// app/instance-initializers/dynamic-services.js
export function initialize(appInstance) {
  // Register service dynamically without app/services file
  appInstance.register('service:feature-flags', class FeatureFlagsService {
    flags = {
      newDashboard: true,
      betaFeatures: false
    };

    isEnabled(flag) {
      return this.flags[flag] || false;
    }
  });

  // Make it a singleton
  appInstance.inject('route', 'featureFlags', 'service:feature-flags');
  appInstance.inject('component', 'featureFlags', 'service:feature-flags');
}

export default {
  initialize
};
```

**Using registered services:**

### 0.16 MSW (Mock Service Worker) Setup for Testing

**Impact: HIGH (Proper API mocking without ORM complexity)**

Use MSW (Mock Service Worker) for API mocking in tests. MSW provides a cleaner approach than Mirage by intercepting requests at the network level without introducing unnecessary ORM patterns or abstractions.

Create a test helper to set up MSW in your tests:

MSW works in integration tests too:

1. **Define handlers per test** - Use `server.use()` in individual tests rather than global handlers

2. **Reset between tests** - The helper automatically resets handlers after each test

3. **Use JSON:API format** - Keep responses consistent with your API format

4. **Test error states** - Mock various HTTP error codes (400, 401, 403, 404, 500)

5. **Capture requests** - Use the request object to verify what your app sent

6. **Use fixtures** - Create reusable test data to keep tests DRY

7. **Simulate delays** - Test loading states with artificial delays

8. **Type-safe responses** - In TypeScript, type your response payloads

**Incorrect: using Mirage with ORM complexity**

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

**Correct: using MSW with simple network mocking**

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

**Before: Mirage**

```javascript
test('lists posts', async function(assert) {
  this.server.createList('post', 3);
  await visit('/posts');
  assert.dom('[data-test-post]').exists({ count: 3 });
});
```

**After: MSW**

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

Reference: [https://discuss.emberjs.com/t/my-cookbook-for-various-emberjs-things/19679](https://discuss.emberjs.com/t/my-cookbook-for-various-emberjs-things/19679), [https://mswjs.io/docs/](https://mswjs.io/docs/)

### 0.17 No Default Exports (Except Route Templates)

**Impact: LOW (Better tree-shaking and consistency)**

Use named exports instead of default exports for better tree-shaking, explicit imports, and easier refactoring. The only exception is route template files.

**Incorrect: default exports**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

export default class UserCard extends Component {
  <template>
    <div>{{@user.name}}</div>
  </template>
}```

**Correct (named exports):**

```

// app/components/user-card.gjs

import Component from '@glimmer/component';

export class UserCard extends Component {

  <template>

    <div>{{@user.name}}</div>

  </template>

}```

**Why Named Exports:**

1. **Explicit Imports**: Clear what you're importing

2. **Better Tree-shaking**: Bundlers can remove unused exports

3. **Easier Refactoring**: Rename refactoring works better

4. **No Name Confusion**: Import name must match export name

5. **Multiple Exports**: Can export multiple items from one file

**For Helpers:**

```javascript
// ❌ Wrong - default export
// app/utils/format-date.js
export default function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// ✅ Correct - named export
// app/utils/format-date.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
```

**For Services:**

```javascript
// ❌ Wrong - default export
// app/services/auth.js
import Service from '@ember/service';

export default class AuthService extends Service {
  // ...
}

// ✅ Correct - named export
// app/services/auth.js
import Service from '@ember/service';

export class AuthService extends Service {
  // ...
}
```

**For Modifiers:**

```typescript

**Benefits for Tree-shaking:**

```

**Exception: Route Templates**

Route templates are the ONLY place where default exports are used in modern Ember:

// app/utils/validators.js

export function isEmail(value) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

}

export function isPhoneNumber(value) {

  return /^\d{3}-\d{3}-\d{4}$/.test(value);

}

export function isZipCode(value) {

  return /^\d{5}(-\d{4})?$/.test(value);

}

// Import specific validators

import { isEmail, isPhoneNumber } from '../utils/validators';

// Default export - can rename arbitrarily

import MyComponent from './my-component'; // Can name it anything

import WhateverIWant from './my-component'; // Still works!

// Named export - explicit and consistent

import { MyComponent } from './my-component'; // Must use exact name

import { MyComponent as MyComp } from './my-component'; // Rename explicitly if needed

// app/utils/string-utils.js

export function capitalize(text) { /* ... */ }

export function lowercase(text) { /* ... */ }

export function uppercase(text) { /* ... */ }

// Only imports what's used - unused exports can be removed

import { capitalize } from './utils/string-utils';

// capitalize is bundled, lowercase and uppercase are tree-shaken

### 0.18 No helper() Wrapper for Plain Functions

**Impact: LOW-MEDIUM (Simpler code, better performance)**

In modern Ember, plain functions can be used directly as helpers without wrapping them with `helper()`. The `helper()` wrapper is legacy and adds unnecessary complexity.

**Incorrect (using helper() wrapper):**

```javascript
// app/utils/format-date.js
import { helper } from '@ember/component/helper';

function formatDate([date]) {
  return new Date(date).toLocaleDateString();
}

export default helper(formatDate);
```

**Correct: plain function**

```javascript
// app/utils/format-date.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
```

**Usage in templates:**

// app/utils/format-currency.js

export function formatCurrency(amount, currency = 'USD') {

  return new Intl.NumberFormat('en-US', {

    style: 'currency',

    currency

  }).format(amount);

}

// app/components/price.gjs

import { formatCurrency } from '../utils/format-currency';

<template>

  <span class="price">

    {{formatCurrency @amount @currency}}

  </span>

</template>```

**For Helpers that Need Services: use class-based**

```javascript
// app/utils/format-relative-time.js
export class FormatRelativeTime {
  constructor(owner) {
    this.intl = owner.lookup('service:intl');
  }

  compute(date) {
    return this.intl.formatRelative(date);
  }
}
```

When you need dependency injection, use a class instead of `helper()`:

**Why Avoid helper():**

1. **Simpler**: Plain functions are easier to understand

2. **Standard JavaScript**: No Ember-specific wrapper needed

3. **Better Testing**: Plain functions are easier to test

4. **Performance**: No wrapper overhead

5. **Modern Pattern**: Aligns with modern Ember conventions

**Migration from helper():**

```javascript
// Before
import { helper } from '@ember/component/helper';

function capitalize([text]) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default helper(capitalize);

// After
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
```

**Common Helper Patterns:**

```javascript
// app/utils/string-helpers.js
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text, length = 50) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}
```

### 0.19 Optimize Conditional Rendering

**Impact: HIGH**

Inefficient conditional logic causes excessive re-renders, creates complex template code, and can lead to poor performance in lists and dynamic UIs.

**Incorrect:**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class UserCard extends Component {
  @cached
  get isActive() {
    return this.args.user.status === 'active' &&
           this.args.user.lastLoginDays < 30;
  }

  @cached
  get showActions() {
    return this.args.canEdit &&
           !this.args.user.locked &&
           this.isActive;
  }

  <template>
    <div class="user-card">
      <h3>{{@user.name}}</h3>

      {{#if this.isActive}}
        <span class="status active">Active</span>
      {{else}}
        <span class="status inactive">Inactive</span>
      {{/if}}

      {{#if this.showActions}}
        <div class="actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      {{/if}}
    </div>
  </template>
}```

## Conditional Lists

Use `{{#if}}` to guard `{{#each}}` and avoid rendering empty states:

```

// app/components/user-list.gjs

import Component from '@glimmer/component';

class UserList extends Component {

  <template>

    {{#each @users as |user|}}

      <div class="user">

        {{#if (eq user.role "admin")}}

          <span class="badge admin">{{user.name}} (Admin)</span>

        {{else if (eq user.role "moderator")}}

          <span class="badge mod">{{user.name}} (Mod)</span>

        {{else}}

          <span>{{user.name}}</span>

        {{/if}}

      </div>

    {{/each}}

  </template>

}```

For complex conditions, use getters:

// app/components/task-list.gjs

import Component from '@glimmer/component';

class TaskList extends Component {

  get hasTasks() {

    return this.args.tasks?.length > 0;

  }

  <template>

    {{#if this.hasTasks}}

      <ul class="task-list">

        {{#each @tasks as |task|}}

          <li>

            {{task.title}}

            {{#if task.completed}}

              <span class="done">✓</span>

            {{/if}}

          </li>

        {{/each}}

      </ul>

    {{else}}

      <p class="empty-state">No tasks yet</p>

    {{/if}}

  </template>

}```

**Bad:**

```gjs
{{#if @user}}
  {{#if @user.isPremium}}
    {{#if @user.hasAccess}}
      <PremiumContent />
    {{/if}}
  {{/if}}
{{/if}}
```

**Good:**

```glimmer-js
// app/components/content-gate.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class ContentGate extends Component {
  @cached
  get canViewPremium() {
    return this.args.user?.isPremium && this.args.user?.hasAccess;
  }

  <template>
    {{#if this.canViewPremium}}
      <PremiumContent />
    {{else}}
      <UpgradeCTA />
    {{/if}}
  </template>
}```

## Component Switching Pattern

Use conditional rendering for component selection:

```

// app/components/media-viewer.gjs

import Component from '@glimmer/component';

import ImageViewer from './image-viewer';

import VideoPlayer from './video-player';

import AudioPlayer from './audio-player';

import { cached } from '@glimmer/tracking';

class MediaViewer extends Component {

  @cached

  get mediaType() {

    return this.args.media?.type;

  }

  <template>

    {{#if (eq this.mediaType "image")}}

      <ImageViewer @src={{@media.url}} />

    {{else if (eq this.mediaType "video")}}

      <VideoPlayer @src={{@media.url}} />

    {{else if (eq this.mediaType "audio")}}

      <AudioPlayer @src={{@media.url}} />

    {{else}}

      <p>Unsupported media type</p>

    {{/if}}

  </template>

}```

Pattern for async data with loading/error states:

### 0.20 Optimize WarpDrive Queries

**Impact: MEDIUM-HIGH (40-70% reduction in API calls)**

Use WarpDrive's request features effectively to reduce API calls and load only the data you need.

**Incorrect: multiple queries, overfetching**

```javascript
// app/routes/posts.js
export default class PostsRoute extends Route {
  @service store;

  async model() {
    // Loads all posts (could be thousands)
    const response = await this.store.request({ url: '/posts' });
    const posts = response.content.data;

    // Then filters in memory
    return posts.filter(post => post.attributes.status === 'published');
  }
}
```

**Correct: filtered query with pagination**

```javascript
// app/routes/posts.js
export default class PostsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    filter: { refreshModel: true }
  };

  model(params) {
    // Server-side filtering and pagination
    return this.store.request({
      url: '/posts',
      data: {
        filter: {
          status: 'published'
        },
        page: {
          number: params.page || 1,
          size: 20
        },
        include: 'author', // Sideload related data
        fields: { // Sparse fieldsets
          posts: 'title,excerpt,publishedAt,author',
          users: 'name,avatar'
        }
      }
    });
  }
}
```

**Use request with includes for single records:**

```javascript
// app/routes/post.js
export default class PostRoute extends Route {
  @service store;

  model(params) {
    return this.store.request({
      url: `/posts/${params.post_id}`,
      data: {
        include: 'author,comments.user' // Nested relationships
      }
    });
  }
}
```

**For frequently accessed data, use cache lookups:**

```javascript
// app/components/user-badge.js
class UserBadge extends Component {
  @service store;

  get user() {
    // Check cache first, avoiding API call if already loaded
    const cached = this.store.cache.peek({
      type: 'user',
      id: this.args.userId
    });

    if (cached) {
      return cached;
    }

    // Only fetch if not in cache
    return this.store.request({
      url: `/users/${this.args.userId}`
    });
  }
}
```

**Use request options for custom queries:**

```javascript
model() {
  return this.store.request({
    url: '/posts',
    data: {
      include: 'author,tags',
      customParam: 'value'
    },
    options: {
      reload: true // Bypass cache
    }
  });
}
```

Efficient WarpDrive usage reduces network overhead and improves application performance significantly.

Reference: [https://warp-drive.io/](https://warp-drive.io/)

### 0.21 Parallel Data Loading in Model Hooks

**Impact: CRITICAL (2-10× improvement)**

When fetching multiple independent data sources in a route's model hook, use `Promise.all()` or RSVP.hash() to load them in parallel instead of sequentially.

**Incorrect: sequential loading, 3 round trips**

```javascript
// app/routes/dashboard.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DashboardRoute extends Route {
  @service store;

  async model() {
    const user = await this.store.request({ url: '/users/me' });
    const posts = await this.store.request({ url: '/posts?recent=true' });
    const notifications = await this.store.request({ url: '/notifications?unread=true' });

    return { user, posts, notifications };
  }
}
```

**Correct: parallel loading, 1 round trip**

```javascript
// app/routes/dashboard.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class DashboardRoute extends Route {
  @service store;

  model() {
    return hash({
      user: this.store.request({ url: '/users/me' }),
      posts: this.store.request({ url: '/posts?recent=true' }),
      notifications: this.store.request({ url: '/notifications?unread=true' })
    });
  }
}
```

Using `hash()` from RSVP allows Ember to resolve all promises concurrently, significantly reducing load time.

### 0.22 Prevent Memory Leaks in Components

**Impact: HIGH (Avoid memory leaks and resource exhaustion)**

Properly clean up event listeners, timers, and subscriptions to prevent memory leaks.

**Incorrect: no cleanup**

```glimmer-js
// app/components/live-clock.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class LiveClock extends Component {
  @tracked time = new Date();

  constructor() {
    super(...arguments);

    // Memory leak: interval never cleared
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  <template>
    <div>{{this.time}}</div>
  </template>
}```

**Correct (proper cleanup with registerDestructor):**

```

// app/components/live-clock.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { registerDestructor } from '@ember/destroyable';

class LiveClock extends Component {

  @tracked time = new Date();

  constructor() {

    super(...arguments);

    const intervalId = setInterval(() => {

      this.time = new Date();

    }, 1000);

    // Proper cleanup

    registerDestructor(this, () => {

      clearInterval(intervalId);

    });

  }

  <template>

    <div>{{this.time}}</div>

  </template>

}```

**Event listener cleanup:**

// app/modifiers/window-listener.js

import { modifier } from 'ember-modifier';

export default modifier((element, [eventName, handler]) => {

  window.addEventListener(eventName, handler);

  // Automatic cleanup when element is removed

  return () => {

    window.removeEventListener(eventName, handler);

  };

});

// app/components/resize-aware.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import windowListener from '../modifiers/window-listener';

class ResizeAware extends Component {

  @tracked size = { width: 0, height: 0 };

  handleResize = () => {

    this.size = {

      width: window.innerWidth,

      height: window.innerHeight

    };

  }

  <template>

    <div {{windowListener "resize" this.handleResize}}>

      {{this.size.width}} x {{this.size.height}}

    </div>

  </template>

}```

**Abort controller for fetch requests:**

```glimmer-js
// app/components/data-loader.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

class DataLoader extends Component {
  @tracked data = null;
  abortController = new AbortController();

  constructor() {
    super(...arguments);

    this.loadData();

    registerDestructor(this, () => {
      this.abortController.abort();
    });
  }

  async loadData() {
    try {
      const response = await fetch('/api/data', {
        signal: this.abortController.signal
      });
      this.data = await response.json();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to load data:', error);
      }
    }
  }

  <template>
    {{#if this.data}}
      <div>{{this.data.content}}</div>
    {{/if}}
  </template>
}```

**Using ember-resources for automatic cleanup:**

```

// app/components/websocket-data.gjs

import Component from '@glimmer/component';

import { resource } from 'ember-resources';

class WebsocketData extends Component {

  messages = resource(({ on }) => {

    const messages = [];

    const ws = new WebSocket('wss://example.com/socket');

    ws.onmessage = (event) => {

      messages.push(event.data);

    };

    // Automatic cleanup

    on.cleanup(() => {

      ws.close();

    });

    return messages;

  });

  <template>

    {{#each this.messages.value as |message|}}

      <div>{{message}}</div>

    {{/each}}

  </template>

}```

Always clean up timers, event listeners, subscriptions, and pending requests to prevent memory leaks and performance degradation.

Reference: [https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable)

### 0.23 Provide DOM-Abstracted Test Utilities for Library Components

**Impact: MEDIUM**

When building reusable components or libraries, consumers should not need to know implementation details or interact directly with the component's DOM. DOM structure should be considered **private** unless the author of the tests is the **owner** of the code being tested.

Without abstracted test utilities:

- Component refactoring breaks consumer tests

- Tests are tightly coupled to implementation details

- Teams waste time updating tests when internals change

- Testing becomes fragile and maintenance-heavy

**Library authors should provide test utilities that fully abstract the DOM.** These utilities expose a public API for testing that remains stable even when internal implementation changes.

**Incorrect: exposing DOM to consumers**

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

**Correct: providing DOM-abstracted test utilities**

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

- Component internals can change without breaking consumer tests

- Clear, documented testing API

- Consumer tests are declarative and readable

- Library maintains API stability contract

On projects with teams, DOM abstraction prevents:

- Merge conflicts from test changes

- Cross-team coordination overhead

- Broken tests from uncoordinated refactoring

- Knowledge silos about component internals

For solo projects, the benefit is smaller but still valuable:

- Easier refactoring without test maintenance

- Better separation of concerns

- Professional API design practice

**Before:** ~30-50% of test maintenance time spent updating selectors

**After:** Minimal test maintenance when refactoring components

- **component-avoid-classes-in-examples.md** - Avoid exposing implementation details

- **testing-modern-patterns.md** - Modern testing approaches

- **testing-render-patterns.md** - Component testing patterns

- [Testing Best Practices - ember-learn](https://guides.emberjs.com/release/testing/)

- [ember-test-selectors](https://github.com/mainmatter/ember-test-selectors) - Addon for stripping test selectors from production

- [Page Objects Pattern](https://martinfowler.com/bliki/PageObject.html) - Related testing abstraction pattern

### 0.24 Rule

**Impact: MEDIUM**

Follow modern Ember component file conventions: use kebab-case filenames, match class names to file names (in PascalCase), and avoid `export default` in .gjs/.gts files.

**Incorrect:**

```typescript

## Why

**Filename conventions:**
- Kebab-case filenames (`user-card.gjs`, not `UserCard.gjs`) follow web component standards and Ember conventions
- Predictable: component name maps directly to filename (UserCard → user-card.gjs)
- Avoids filesystem case-sensitivity issues across platforms

**Class naming:**
- No "Component" suffix - it's redundant (extends Component already declares the type)
- PascalCase class name matches the capitalized component invocation: `<UserCard />`
- Cleaner code: `UserCard` vs `UserCardComponent`

**No default export:**
- Modern .gjs/.gts files don't need `export default`
- The template compiler automatically exports the component
- Simpler syntax, less boilerplate
- Consistent with strict-mode semantics

## Naming Pattern Reference

| Filename | Class Name | Template Invocation |
|----------|-----------|---------------------|
| `user-card.gjs` | `class UserCard` | `<UserCard />` |
| `loading-spinner.gjs` | `class LoadingSpinner` | `<LoadingSpinner />` |
| `nav-bar.gjs` | `class NavBar` | `<NavBar />` |
| `todo-list.gjs` | `class TodoList` | `<TodoList />` |
| `search-input.gjs` | `class SearchInput` | `<SearchInput />` |

**Conversion rule:**
- Filename: all lowercase, words separated by hyphens
- Class: PascalCase, same words, no hyphens
- `user-card.gjs` → `class UserCard`

## Special Cases

**Template-only components:**

```

// app/components/UserProfile.gjs - WRONG: PascalCase filename

import Component from '@glimmer/component';

export default class UserProfile extends Component {

  <template>

    <div class="profile">

      {{@name}}

    </div>

  </template>

}

// app/components/user-card.gjs - CORRECT: kebab-case filename, no Component suffix, no default export

import Component from '@glimmer/component';

export class UserCard extends Component {

  <template>

    <div class="user-card">

      {{@name}}

    </div>

  </template>

}

// app/components/user-profile.gjs - CORRECT: All conventions followed

import Component from '@glimmer/component';

import { service } from '@ember/service';

export class UserProfile extends Component {

  @service session;

  <template>

    <div class="profile">

      <h1>{{@name}}</h1>

      {{#if this.session.isAuthenticated}}

        <button>Edit Profile</button>

      {{/if}}

    </div>

  </template>

}

// app/components/simple-card.gjs - Template-only, no class needed

<template>

  <div class="card">

    {{yield}}

  </div>

</template>```

**Components in subdirectories:**

```glimmer-js
// app/components/ui/button.gjs
import Component from '@glimmer/component';

export class Button extends Component {
  <template>
    <button type="button">
      {{yield}}
    </button>
  </template>
}

// Usage: <Ui::Button />
```

**Nested namespaces:**

```glimmer-js
// app/components/admin/user/profile-card.gjs
import Component from '@glimmer/component';

export class ProfileCard extends Component {
  <template>
    <div class="admin-profile">
      {{@user.name}}
    </div>
  </template>
}

// Usage: <Admin::User::ProfileCard />
```

**Positive:**

- ⚡️ Cleaner, more maintainable code

- 🎯 Predictable mapping between files and classes

- 🌐 Follows web standards (kebab-case)

- 📦 Smaller bundle size (less export overhead)

- 🚀 Better alignment with modern Ember/Glimmer

**Negative:**

- None - this is the modern standard

- **Code clarity**: +30% (shorter, clearer names)

- **Bundle size**: -5-10 bytes per component (no export overhead)

- **Developer experience**: Improved (predictable naming)

- [Ember Components Guide](https://guides.emberjs.com/release/components/)

- [Glimmer Components](https://github.com/glimmerjs/glimmer.js)

- [Template Tag Format RFC](https://github.com/emberjs/rfcs/pull/779)

- [Strict Mode Semantics](https://github.com/emberjs/rfcs/blob/master/text/0496-handlebars-strict-mode.md)

- component-use-glimmer.md - Modern Glimmer component patterns

- component-strict-mode.md - Template-only components and strict mode

- route-templates.md - Route file naming conventions

### 0.25 Semantic HTML and ARIA Attributes

**Impact: HIGH (Essential for screen reader users)**

Use semantic HTML elements and proper ARIA attributes to make your application accessible to screen reader users. **The first rule of ARIA is to not use ARIA** - prefer native semantic HTML elements whenever possible.

**Key principle:** Native HTML elements have built-in keyboard support, roles, and behaviors. Only add ARIA when semantic HTML can't provide the needed functionality.

**Incorrect: divs with insufficient semantics**

```glimmer-js
// app/components/example.gjs
<template>
  <div class="button" {{on "click" this.submit}}>
    Submit
  </div>

  <div class="nav">
    <div class="nav-item">Home</div>
    <div class="nav-item">About</div>
  </div>

  <div class="alert">
    {{this.message}}
  </div>
</template>```

**Correct (semantic HTML with proper ARIA):**

```

// app/components/example.gjs

import { LinkTo } from '@ember/routing';

<template>

  <button type="submit" {{on "click" this.submit}}>

    Submit

  </button>

  <nav aria-label="Main navigation">

    <ul>

      <li><LinkTo @route="index">Home</LinkTo></li>

      <li><LinkTo @route="about">About</LinkTo></li>

    </ul>

  </nav>

  <div role="alert" aria-live="polite" aria-atomic="true">

    {{this.message}}

  </div>

</template>```

**For interactive custom elements:**

### 0.26 Template-Only Components with In-Scope Functions

**Impact: MEDIUM (Clean, performant patterns for template-only components)**

For template-only components (components without a class and `this`), use in-scope functions to keep logic close to the template while avoiding unnecessary caching overhead.

**Incorrect: using class-based component for simple logic**

```glimmer-js
// app/components/product-card.gjs
import Component from '@glimmer/component';

export class ProductCard extends Component {
  // Unnecessary class and overhead for simple formatting
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  <template>
    <div class="product-card">
      <h3>{{@product.name}}</h3>
      <div class="price">{{this.formatPrice @product.price}}</div>
    </div>
  </template>
}
```

**Correct: template-only component with in-scope functions**

```glimmer-js
// app/components/product-card.gjs
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function calculateDiscount(price, discountPercent) {
  return price * (1 - discountPercent / 100);
}

function isOnSale(product) {
  return product.discountPercent > 0;
}

<template>
  <div class="product-card">
    <h3>{{@product.name}}</h3>

    {{#if (isOnSale @product)}}
      <div class="price">
        <span class="original">{{formatPrice @product.price}}</span>
        <span class="sale">
          {{formatPrice (calculateDiscount @product.price @product.discountPercent)}}
        </span>
      </div>
    {{else}}
      <div class="price">{{formatPrice @product.price}}</div>
    {{/if}}

    <p>{{@product.description}}</p>
  </div>
</template>
```

**When to use class-based vs template-only:**

```glimmer-js
// Use template-only when:
// - Simple transformations
// - Functions accessed once
// - No state or services needed

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

<template>
  <div class="timestamp">
    Last updated: {{formatDate @lastUpdate}}
  </div>
</template>
```

**Combining in-scope functions for readability:**

```glimmer-js
// app/components/user-badge.gjs
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

function getBadgeColor(status) {
  const colors = {
    active: 'green',
    pending: 'yellow',
    inactive: 'gray'
  };
  return colors[status] || 'gray';
}

<template>
  <div class="user-badge" style="background-color: {{getBadgeColor @user.status}}">
    <span class="initials">{{getInitials @user.name}}</span>
    <span class="name">{{@user.name}}</span>
  </div>
</template>
```

**Anti-pattern - Complex nested calls:**

```glimmer-js
// ❌ Hard to read, lots of nesting
<template>
  <div>
    {{formatCurrency (multiply (add @basePrice @taxAmount) @quantity)}}
  </div>
</template>

// ✅ Better - use intermediate function
function calculateTotal(basePrice, taxAmount, quantity) {
  return (basePrice + taxAmount) * quantity;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

<template>
  <div>
    {{formatCurrency (calculateTotal @basePrice @taxAmount @quantity)}}
  </div>
</template>
```

**Key differences from class-based components:**

| Aspect | Template-Only | Class-Based |

|--------|--------------|-------------|

| `this` context | ❌ No `this` | ✅ Has `this` |

| Function caching | ❌ Recreated each render | ✅ `@cached` available |

| Services | ❌ Cannot inject | ✅ `@service` decorator |

| Tracked state | ❌ No instance state | ✅ `@tracked` properties |

| Best for | Simple, stateless | Complex, stateful |

**Best practices:**

```glimmer-js
// app/components/stats-display.gjs
export function average(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

export function round(number, decimals = 2) {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

<template>
  <div class="stats">
    Average: {{round (average @scores)}}
  </div>
</template>
```

1. **Keep functions simple** - If computation is complex, consider a class with `@cached`

2. **One responsibility per function** - Makes them reusable and testable

3. **Minimize nesting** - Use intermediate functions for readability

4. **No side effects** - Functions should be pure transformations

5. **Export for testing** - Export functions so they can be tested independently

Reference: [https://guides.emberjs.com/release/components/component-types/](https://guides.emberjs.com/release/components/component-types/), [https://guides.emberjs.com/release/components/conditional-content/](https://guides.emberjs.com/release/components/conditional-content/)

### 0.27 Use {{#each}} with @key for Lists

**Impact: MEDIUM (50-70% faster list updates)**

Always use the `@key` parameter with `{{#each}}` for lists of objects to help Ember efficiently track and update items.

**Incorrect: no key**

```glimmer-js
// app/components/user-list.gjs
import UserCard from './user-card';

<template>
  <ul>
    {{#each this.users as |user|}}
      <li>
        <UserCard @user={{user}} />
      </li>
    {{/each}}
  </ul>
</template>```

**Correct (with key):**

```

// app/components/user-list.gjs

import UserCard from './user-card';

<template>

  <ul>

    {{#each this.users key="id" as |user|}}

      <li>

        <UserCard @user={{user}} />

      </li>

    {{/each}}

  </ul>

</template>```

**For arrays without stable IDs, use @identity:**

```glimmer-js
// app/components/tag-list.gjs
<template>
  {{#each this.tags key="@identity" as |tag|}}
    <span class="tag">{{tag}}</span>
  {{/each}}
</template>```

**For complex scenarios with @index:**

```

// app/components/item-list.gjs

<template>

  {{#each this.items key="@index" as |item index|}}

    <div data-index={{index}}>

      {{item.name}}

    </div>

  {{/each}}

</template>```

Using proper keys allows Ember's rendering engine to efficiently update, reorder, and remove items without re-rendering the entire list.

**Performance comparison:**

- Without key: Re-renders entire list on changes

- With key by id: Only updates changed items (50-70% faster)

- With @identity: Good for primitive arrays (strings, numbers)

- With @index: Only use when items never reorder

Reference: [https://guides.emberjs.com/release/components/looping-through-lists/](https://guides.emberjs.com/release/components/looping-through-lists/)

### 0.28 Use {{#let}} to Avoid Recomputation

**Impact: MEDIUM (30-50% reduction in duplicate work)**

Use `{{#let}}` to compute expensive values once and reuse them in the template instead of calling getters or helpers multiple times.

**Incorrect: recomputes on every reference**

```glimmer-js
// app/components/user-card.gjs
<template>
  <div class="user-card">
    {{#if (and this.user.isActive (not this.user.isDeleted))}}
      <h3>{{this.user.fullName}}</h3>
      <p>Status: Active</p>
    {{/if}}

    {{#if (and this.user.isActive (not this.user.isDeleted))}}
      <button {{on "click" this.editUser}}>Edit</button>
    {{/if}}

    {{#if (and this.user.isActive (not this.user.isDeleted))}}
      <button {{on "click" this.deleteUser}}>Delete</button>
    {{/if}}
  </div>
</template>```

**Correct (compute once, reuse):**

```

// app/components/user-card.gjs

<template>

  {{#let (and this.user.isActive (not this.user.isDeleted)) as |isEditable|}}

    <div class="user-card">

      {{#if isEditable}}

        <h3>{{this.user.fullName}}</h3>

        <p>Status: Active</p>

      {{/if}}

      {{#if isEditable}}

        <button {{on "click" this.editUser}}>Edit</button>

      {{/if}}

      {{#if isEditable}}

        <button {{on "click" this.deleteUser}}>Delete</button>

      {{/if}}

    </div>

  {{/let}}

</template>```

**Multiple values:**

### 0.29 Use {{fn}} for Partial Application Only

**Impact: LOW-MEDIUM (Clearer code, avoid unnecessary wrapping)**

The `{{fn}}` helper is used for partial application (binding arguments), similar to JavaScript's `.bind()`. Only use it when you need to pre-bind arguments to a function. Don't use it to simply pass a function reference.

**Incorrect: unnecessary use of {{fn}}**

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

```

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

```

Use `{{fn}}` when you need to pre-bind arguments to a function, similar to JavaScript's `.bind()`:

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

Reference: [https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_passing-arguments-to-functions](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_passing-arguments-to-functions)

### 0.30 Use {{on}} Modifier for Event Handling

**Impact: MEDIUM (Better memory management and clarity)**

Use the `{{on}}` modifier for event handling instead of traditional action handlers for better memory management and clearer code.

**Incorrect: traditional action attribute**

```glimmer-js
// app/components/button.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';

class Button extends Component {
  @action
  handleClick() {
    this.args.onClick?.();
  }

  <template>
    <button onclick={{this.handleClick}}>
      {{@label}}
    </button>
  </template>
}```

**Correct (using {{on}} modifier):**

```

// app/components/button.gjs

import Component from '@glimmer/component';

import { on } from '@ember/modifier';

class Button extends Component {

  handleClick = () => {

    this.args.onClick?.();

  }

  <template>

    <button {{on "click" this.handleClick}}>

      {{@label}}

    </button>

  </template>

}```

**With event options:**

```glimmer-js
// app/components/scroll-tracker.gjs
import Component from '@glimmer/component';
import { on } from '@ember/modifier';

class ScrollTracker extends Component {
  handleScroll = (event) => {
    console.log('Scroll position:', event.target.scrollTop);
  }

  <template>
    <div
      class="scrollable"
      {{on "scroll" this.handleScroll passive=true}}
    >
      {{yield}}
    </div>
  </template>
}```

**Multiple event handlers:**

```

// app/components/input-field.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { on } from '@ember/modifier';

class InputField extends Component {

  @tracked isFocused = false;

  handleFocus = () => {

    this.isFocused = true;

  }

  handleBlur = () => {

    this.isFocused = false;

  }

  handleInput = (event) => {

    this.args.onInput?.(event.target.value);

  }

  <template>

    <input

      type="text"

      class={{if this.isFocused "focused"}}

      {{on "focus" this.handleFocus}}

      {{on "blur" this.handleBlur}}

      {{on "input" this.handleInput}}

      value={{@value}}

    />

  </template>

}```

**Using fn helper for arguments:**

### 0.31 Use @cached for Expensive Getters

**Impact: HIGH (50-90% reduction in recomputation)**

Use `@cached` from `@glimmer/tracking` to memoize expensive computations that depend on tracked properties. The cached value is automatically invalidated when dependencies change.

**Incorrect: recomputes on every access**

```javascript
import Component from '@glimmer/component';

class DataTable extends Component {
  get filteredAndSortedData() {
    // Expensive: runs on every access, even if nothing changed
    return this.args.data
      .filter(item => item.status === this.args.filter)
      .sort((a, b) => a[this.args.sortBy] - b[this.args.sortBy])
      .map(item => this.transformItem(item));
  }
}
```

**Correct: cached computation**

```javascript
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class DataTable extends Component {
  @cached
  get filteredAndSortedData() {
    // Computed once per unique combination of dependencies
    return this.args.data
      .filter(item => item.status === this.args.filter)
      .sort((a, b) => a[this.args.sortBy] - b[this.args.sortBy])
      .map(item => this.transformItem(item));
  }

  transformItem(item) {
    // Expensive transformation
    return { ...item, computed: this.expensiveCalculation(item) };
  }
}
```

`@cached` memoizes the getter result and only recomputes when tracked dependencies change, providing 50-90% reduction in unnecessary work.

Reference: [https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/#toc_caching](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/#toc_caching)

### 0.32 Use Appropriate Render Patterns in Tests

**Impact: MEDIUM (Simpler test code and better readability)**

Choose the right rendering pattern based on whether your component needs arguments, blocks, or attributes in the test.

**Incorrect: using template tag unnecessarily**

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

**Correct: direct component render when no args needed**

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

```

**Pattern 1: Direct component render (no args/blocks/attributes):**

**Pattern 2: Template tag render (with args/blocks/attributes):**

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

```

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

Reference: [https://guides.emberjs.com/release/testing/](https://guides.emberjs.com/release/testing/)

### 0.33 Use Class Fields for Component Composition

**Impact: MEDIUM-HIGH (Better composition and initialization patterns)**

Use class fields for clean component composition, initialization, and dependency injection patterns. Tracked class fields should be **roots of state** - representing the minimal independent state that your component owns. In most apps, you should have very few tracked fields.

**Incorrect: imperative initialization, scattered state**

```typescript

**Understanding "roots of state":**

Tracked fields should represent **independent state** that your component owns - not derived data or loaded data. Examples of good tracked fields:
- User selections (selected tab, filter option)
- UI state (is modal open, is expanded)
- Form input values (not yet persisted)

In most apps, you'll have very few tracked fields because most data comes from arguments, services, or computed getters.

**Composition through class field assignment:**

```

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

Reference: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)

### 0.34 Use Component Composition Patterns

**Impact: HIGH (Better code reuse and maintainability)**

Use component composition with yield blocks, named blocks, and contextual components for flexible, reusable UI patterns.

**Named blocks** are for invocation consistency in design systems where you **don't want the caller to have full markup control**. They provide structured extension points while maintaining design system constraints - the same concept as named slots in other frameworks.

**Incorrect: monolithic component**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

class UserCard extends Component {
  <template>
    <div class="user-card">
      <div class="header">
        <img src={{@user.avatar}} alt={{@user.name}} />
        <h3>{{@user.name}}</h3>
        <p>{{@user.email}}</p>
      </div>

      {{#if @showActions}}
        <div class="actions">
          <button {{on "click" @onEdit}}>Edit</button>
          <button {{on "click" @onDelete}}>Delete</button>
        </div>
      {{/if}}

      {{#if @showStats}}
        <div class="stats">
          <span>Posts: {{@user.postCount}}</span>
          <span>Followers: {{@user.followers}}</span>
        </div>
      {{/if}}
    </div>
  </template>
}```

**Correct (composable with named blocks):**

```

// app/components/user-card.gjs

import Component from '@glimmer/component';

class UserCard extends Component {

  <template>

    <div class="user-card" ...attributes>

      {{#if (has-block "header")}}

        {{yield to="header"}}

      {{else}}

        <div class="header">

          <img src={{@user.avatar}} alt={{@user.name}} />

          <h3>{{@user.name}}</h3>

        </div>

      {{/if}}

      {{yield @user to="default"}}

      {{#if (has-block "actions")}}

        <div class="actions">

          {{yield @user to="actions"}}

        </div>

      {{/if}}

      {{#if (has-block "footer")}}

        <div class="footer">

          {{yield @user to="footer"}}

        </div>

      {{/if}}

    </div>

  </template>

}```

**Usage with flexible composition:**

```glimmer-js
// app/components/user-list.gjs
import UserCard from './user-card';

<template>
  {{#each @users as |user|}}
    <UserCard @user={{user}}>
      <:header>
        <div class="custom-header">
          <span class="badge">{{user.role}}</span>
          <h3>{{user.name}}</h3>
        </div>
      </:header>

      <:default as |u|>
        <p class="bio">{{u.bio}}</p>
        <p class="email">{{u.email}}</p>
      </:default>

      <:actions as |u|>
        <button {{on "click" (fn @onEdit u)}}>Edit</button>
        <button {{on "click" (fn @onDelete u)}}>Delete</button>
      </:actions>

      <:footer as |u|>
        <div class="stats">
          Posts: {{u.postCount}} | Followers: {{u.followers}}
        </div>
      </:footer>
    </UserCard>
  {{/each}}
</template>```

**Contextual components pattern:**

```

// app/components/data-table.gjs

import Component from '@glimmer/component';

import { hash } from '@ember/helper';

class HeaderCell extends Component {

  <template>

    <th class="sortable" {{on "click" @onSort}}>

      {{yield}}

      {{#if @sorted}}

        <span class="sort-icon">{{if @ascending "↑" "↓"}}</span>

      {{/if}}

    </th>

  </template>

}

class Row extends Component {

  <template>

    <tr class={{if @selected "selected"}}>

      {{yield}}

    </tr>

  </template>

}

class Cell extends Component {

  <template>

    <td>{{yield}}</td>

  </template>

}

class DataTable extends Component {

  <template>

    <table class="data-table">

      {{yield (hash

        Header=HeaderCell

        Row=Row

        Cell=Cell

      )}}

    </table>

  </template>

}```

**Using contextual components:**

```glimmer-js
// app/components/users-table.gjs
import DataTable from './data-table';

<template>
  <DataTable as |Table|>
    <thead>
      <tr>
        <Table.Header @onSort={{fn @onSort "name"}}>Name</Table.Header>
        <Table.Header @onSort={{fn @onSort "email"}}>Email</Table.Header>
        <Table.Header @onSort={{fn @onSort "role"}}>Role</Table.Header>
      </tr>
    </thead>
    <tbody>
      {{#each @users as |user|}}
        <Table.Row @selected={{eq @selectedId user.id}}>
          <Table.Cell>{{user.name}}</Table.Cell>
          <Table.Cell>{{user.email}}</Table.Cell>
          <Table.Cell>{{user.role}}</Table.Cell>
        </Table.Row>
      {{/each}}
    </tbody>
  </DataTable>
</template>```

**Renderless component pattern:**

```

// app/components/dropdown.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

import { hash } from '@ember/helper';

class Dropdown extends Component {

  @tracked isOpen = false;

  @action

  toggle() {

    this.isOpen = !this.isOpen;

  }

  @action

  close() {

    this.isOpen = false;

  }

  <template>

    {{yield (hash

      isOpen=this.isOpen

      toggle=this.toggle

      close=this.close

    )}}

  </template>

}```

### 0.35 Use ember-a11y-testing for Automated Checks

**Impact: HIGH (Catch 30-50% of a11y issues automatically)**

Integrate ember-a11y-testing into your test suite to automatically catch common accessibility violations during development. This addon uses axe-core to identify issues before they reach production.

**Incorrect: no accessibility testing**

```glimmer-js
// tests/integration/components/user-form-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
import UserForm from 'my-app/components/user-form';

module('Integration | Component | user-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it submits the form', async function(assert) {
    await render(<template><UserForm /></template>);
    await fillIn('input', 'John');
    await click('button');
    assert.ok(true);
  });
});```

**Correct (with a11y testing):**

```

// tests/integration/components/user-form-test.js

import { module, test } from 'qunit';

import { setupRenderingTest } from 'ember-qunit';

import { render, fillIn, click } from '@ember/test-helpers';

import a11yAudit from 'ember-a11y-testing/test-support/audit';

import UserForm from 'my-app/components/user-form';

module('Integration | Component | user-form', function(hooks) {

  setupRenderingTest(hooks);

  test('it submits the form', async function(assert) {

    await render(<template><UserForm /></template>);

    // Automatically checks for a11y violations

    await a11yAudit();

    await fillIn('input', 'John');

    await click('button');

    assert.ok(true);

  });

});```

**Setup: install and configure**

```javascript
// tests/test-helper.js
import { setupGlobalA11yHooks } from 'ember-a11y-testing/test-support';

setupGlobalA11yHooks(); // Runs on every test automatically
```

ember-a11y-testing catches issues like missing labels, insufficient color contrast, invalid ARIA, and keyboard navigation problems automatically.

Reference: [https://github.com/ember-a11y/ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing)

### 0.36 Use Glimmer Components Over Classic Components

**Impact: HIGH (30-50% faster rendering)**

Glimmer components are lighter, faster, and have a simpler lifecycle than classic Ember components. They don't have two-way bindings or element lifecycle hooks, making them more predictable and performant.

**Incorrect: classic component**

```javascript
// app/components/user-card.js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'div',
  classNames: ['user-card'],

  fullName: computed('user.{firstName,lastName}', function() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }),

  didInsertElement() {
    this._super(...arguments);
    // Complex lifecycle management
  }
});
```

**Correct: Glimmer component**

### 0.37 Use Helper Libraries Effectively

**Impact: MEDIUM**

Reinventing common functionality with custom helpers adds maintenance burden and bundle size when well-maintained helper libraries already provide the needed functionality.

**Incorrect:**

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
```

npm install ember-truth-helpers ember-composable-helpers

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

**Installation:** `npm install ember-truth-helpers`

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

```

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

- **Library helpers**: ~0% overhead (compiled into efficient bytecode)

- **Custom helpers**: 5-15% overhead per helper call

- **Inline logic**: Cleaner templates, better tree-shaking

- **Library helpers**: For all common operations (equality, logic, arrays, strings)

- **Custom helpers**: Only for domain-specific logic not covered by library helpers

- **Component logic**: For complex operations that need @cached or multiple dependencies

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

- [Ember Built-in Helpers](https://guides.emberjs.com/release/templates/built-in-helpers/)

- [Template Helpers API](https://api.emberjs.com/ember/release/modules/@ember%2Fhelper)

- [fn Helper Guide](https://guides.emberjs.com/release/components/helper-functions/)

- [ember-truth-helpers](https://github.com/jmurphyau/ember-truth-helpers)

- [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers)

### 0.38 Use Loading Substates for Better UX

**Impact: CRITICAL (Perceived performance improvement)**

Implement loading substates to show immediate feedback while data loads, preventing blank screens and improving perceived performance.

**Incorrect: no loading state**

```javascript
// app/routes/posts.js
export default class PostsRoute extends Route {
  async model() {
    return this.store.request({ url: '/posts' });
  }
}
```

**Correct: with loading substate**

```glimmer-js
// app/routes/posts-loading.gjs
import { LoadingSpinner } from './loading-spinner';

<template>
  <div class="loading-spinner" role="status" aria-live="polite">
    <span class="sr-only">Loading posts...</span>
    <LoadingSpinner />
  </div>
</template>```

```

// app/routes/posts.js

export default class PostsRoute extends Route {

  model() {

    // Return promise directly - Ember will show posts-loading template

    return this.store.request({ url: '/posts' });

  }

}

### 0.39 Use Modern Testing Patterns

**Impact: HIGH (Better test coverage and maintainability)**

Use modern Ember testing patterns with `@ember/test-helpers` and `qunit-dom` for better test coverage and maintainability.

**Incorrect: old testing patterns**

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

```

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

**Route testing with MSW: Mock Service Worker**

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

```

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

Reference: [https://guides.emberjs.com/release/testing/](https://guides.emberjs.com/release/testing/)

### 0.40 Use Native Forms with Platform Validation

**Impact: HIGH**

Over-engineering forms with JavaScript when native browser features provide validation, accessibility, and UX patterns for free.

**Incorrect: Too much JavaScript**

```typescript

## Custom Validation with setCustomValidity

For business logic validation beyond HTML5 constraints:

```

// app/components/signup-form.gjs

import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { on } from '@ember/modifier';

class SignupForm extends Component {

  @tracked validationErrors = null;

  handleSubmit = (event) => {

    event.preventDefault();

    const form = event.target;

    // ✅ Use native checkValidity()

    if (!form.checkValidity()) {

      // Show native validation messages

      form.reportValidity();

      return;

    }

    // ✅ Use FormData API - no tracked state needed!

    const formData = new FormData(form);

    const data = Object.fromEntries(formData);

    this.args.onSubmit(data);

  };

  <template>

    <form {{on "submit" this.handleSubmit}}>

      {{! ✅ Browser handles validation automatically }}

      <input

        type="email"

        name="email"

        required

        placeholder="email@example.com"

      />

      <input

        type="password"

        name="password"

        required

        minlength="8"

        placeholder="Min 8 characters"

      />

      <button type="submit">Sign Up</button>

    </form>

  </template>

}```

**Performance: -15KB** (no validation libraries needed)

**Accessibility: +100%** (native form semantics and error announcements)

**Code: -50%** (let the platform handle it)

Access and display native validation state in your component:

handleInput = (event) => {

  const input = event.target;

  const validity = input.validity;

  // Check specific validation states:

  if (validity.valueMissing) {

    // required field is empty

  }

  if (validity.typeMismatch) {

    // type="email" but value isn't email format

  }

  if (validity.tooShort || validity.tooLong) {

    // minlength/maxlength violated

  }

  if (validity.rangeUnderflow || validity.rangeOverflow) {

    // min/max violated

  }

  if (validity.patternMismatch) {

    // pattern attribute not matched

  }

  // Or use the aggregated validationMessage:

  if (!validity.valid) {

    this.showError(input.name, input.validationMessage);

  }

};

// app/components/password-match-form.gjs

import Component from '@glimmer/component';

import { on } from '@ember/modifier';

class PasswordMatchForm extends Component {

  validatePasswordMatch = (event) => {

    const form = event.target.form;

    const password = form.querySelector('[name="password"]');

    const confirm = form.querySelector('[name="confirm"]');

    // ✅ Use setCustomValidity for custom validation

    if (password.value !== confirm.value) {

      confirm.setCustomValidity('Passwords must match');

    } else {

      confirm.setCustomValidity(''); // Clear custom error

    }

  };

  handleSubmit = (event) => {

    event.preventDefault();

    const form = event.target;

    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }

    const formData = new FormData(form);

    this.args.onSubmit(Object.fromEntries(formData));

  };

  <template>

    <form {{on "submit" this.handleSubmit}}>

      <input

        type="password"

        name="password"

        required

        minlength="8"

        placeholder="Password"

      />

      <input

        type="password"

        name="confirm"

        required

        placeholder="Confirm password"

        {{on "input" this.validatePasswordMatch}}

      />

      <button type="submit">Create Account</button>

    </form>

  </template>

}```

Use controlled patterns when you need real-time interactivity that isn't form submission:

### 0.41 Use Route Templates with Co-located Syntax

**Impact: MEDIUM-HIGH (Better code organization and maintainability)**

Use co-located route templates with modern gjs syntax for better organization and maintainability.

**Incorrect: separate template file - old pattern**

```glimmer-js
// app/routes/posts.js (separate file)
import Route from '@ember/routing/route';

export default class PostsRoute extends Route {
  model() {
    return this.store.request({ url: '/posts' });
  }
}

// app/templates/posts.gjs (separate template file)
<template>
  <h1>Posts</h1>
  <ul>
    {{#each @model as |post|}}
      <li>{{post.title}}</li>
    {{/each}}
  </ul>
</template>```

**Correct (co-located route template):**

```

// app/routes/posts.gjs

import Route from '@ember/routing/route';

export default class PostsRoute extends Route {

  model() {

    return this.store.request({ url: '/posts' });

  }

  <template>

    <h1>Posts</h1>

    <ul>

      {{#each @model as |post|}}

        <li>{{post.title}}</li>

      {{/each}}

    </ul>

    {{outlet}}

  </template>

}```

**With loading and error states:**

```glimmer-js
// app/routes/posts.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostsRoute extends Route {
  @service store;

  model() {
    return this.store.request({ url: '/posts' });
  }

  <template>
    <div class="posts-page">
      <h1>Posts</h1>

      {{#if @model}}
        <ul>
          {{#each @model as |post|}}
            <li>{{post.title}}</li>
          {{/each}}
        </ul>
      {{/if}}

      {{outlet}}
    </div>
  </template>
}```

**Template-only routes:**

```

// app/routes/about.gjs

<template>

  <div class="about-page">

    <h1>About Us</h1>

    <p>Welcome to our application!</p>

  </div>

</template>```

Co-located route templates keep route logic and presentation together, making the codebase easier to navigate and maintain.

Reference: [https://guides.emberjs.com/release/routing/](https://guides.emberjs.com/release/routing/)

### 0.42 Use Route-Based Code Splitting

**Impact: CRITICAL (30-70% initial bundle reduction)**

With Embroider's route-based code splitting, routes and their components are automatically split into separate chunks, loaded only when needed.

**Incorrect: everything in main bundle**

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // No optimization
  });

  return app.toTree();
};
```

**Correct: Embroider with Vite and route splitting**

```javascript
// ember-cli-build.js
const { Vite } = require('@embroider/vite');

module.exports = require('@embroider/compat').compatBuild(app, Vite, {
  staticAddonTestSupportTrees: true,
  staticAddonTrees: true,
  staticHelpers: true,
  staticModifiers: true,
  staticComponents: true,
  splitAtRoutes: ['admin', 'reports', 'settings'] // Routes to split
});
```

Embroider with `splitAtRoutes` creates separate bundles for specified routes, reducing initial load time by 30-70%.

Reference: [https://github.com/embroider-build/embroider](https://github.com/embroider-build/embroider)

### 0.43 Use Services for Shared State

**Impact: MEDIUM-HIGH (Better state management and reusability)**

Use services to manage shared state across components and routes instead of passing data through multiple layers or duplicating state.

**Incorrect: prop drilling**

```typescript

Services provide centralized state management with automatic reactivity through tracked properties.

**For complex state, consider using Ember Data or ember-orbit:**

```

// app/services/theme.js

import Service from '@ember/service';

import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

export default class ThemeService extends Service {

  @tracked currentTheme = 'dark';

  @action

  setTheme(theme) {

    this.currentTheme = theme;

    localStorage.setItem('theme', theme);

  }

  @action

  loadTheme() {

    this.currentTheme = localStorage.getItem('theme') || 'dark';

  }

}

// app/components/header.js

import Component from '@glimmer/component';

import { service } from '@ember/service';

class Header extends Component {

  @service theme;

  // Access theme.currentTheme directly

}

// app/components/sidebar.js

import Component from '@glimmer/component';

import { service } from '@ember/service';

class Sidebar extends Component {

  @service theme;

  // Access theme.currentTheme directly

}

// app/services/cart.js

import Service from '@ember/service';

import { service } from '@ember/service';

import { TrackedArray } from 'tracked-built-ins';

import { cached } from '@glimmer/tracking';

import { action } from '@ember/object';

export default class CartService extends Service {

  @service store;

  items = new TrackedArray([]);

  @cached

  get total() {

    return this.items.reduce((sum, item) => sum + item.price, 0);

  }

  @cached

  get itemCount() {

    return this.items.length;

  }

  @action

  addItem(item) {

    this.items.push(item);

  }

  @action

  removeItem(item) {

    const index = this.items.indexOf(item);

    if (index > -1) {

      this.items.splice(index, 1);

    }

  }

}

### 0.44 Use Strict Mode and Template-Only Components

**Impact: HIGH (Better type safety and simpler components)**

Use strict mode and template-only components for simpler, safer code with better tooling support.

**Incorrect: JavaScript component for simple templates**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

class UserCard extends Component {
  <template>
    <div class="user-card">
      <h3>{{@user.name}}</h3>
      <p>{{@user.email}}</p>
    </div>
  </template>
}```

**Correct (template-only component):**

```

// app/components/user-card.gjs

<template>

  <div class="user-card">

    <h3>{{@user.name}}</h3>

    <p>{{@user.email}}</p>

  </div>

</template>```

**With TypeScript for better type safety:**

```glimmer-ts
// app/components/user-card.gts
import type { TOC } from '@ember/component/template-only';

interface UserCardSignature {
  Args: {
    user: {
      name: string;
      email: string;
    };
  };
}

const UserCard: TOC<UserCardSignature> = <template>
  <div class="user-card">
    <h3>{{@user.name}}</h3>
    <p>{{@user.email}}</p>
  </div>
</template>;

export default UserCard;
```

**Enable strict mode in your app:**

```javascript
// ember-cli-build.js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });

  return app.toTree();
};
```

Template-only components are lighter, more performant, and easier to understand. Strict mode provides better error messages and prevents common mistakes.

Reference: [https://guides.emberjs.com/release/upgrading/current-edition/templates/](https://guides.emberjs.com/release/upgrading/current-edition/templates/)

### 0.45 Use Test Waiters for Async Operations

**Impact: HIGH (Reliable tests that don't depend on implementation details)**

Instrument async code with test waiters instead of using `waitFor()` or `waitUntil()` in tests. Test waiters abstract async implementation details so tests focus on user behavior rather than timing.

**Why Test Waiters Matter:**

Test waiters allow `settled()` and other test helpers to automatically wait for your async operations. This means:

- Tests don't need to know about implementation details (timeouts, polling intervals, etc.)

- Tests are written from a user's perspective ("click button, see result")

- Code refactoring doesn't break tests

- Tests are more reliable and less flaky

**Incorrect: testing implementation details**

```glimmer-js
// tests/integration/components/data-loader-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor } from '@ember/test-helpers';
import DataLoader from 'my-app/components/data-loader';

module('Integration | Component | data-loader', function(hooks) {
  setupRenderingTest(hooks);

  test('it loads data', async function(assert) {
    await render(<template><DataLoader /></template>);

    await click('[data-test-load-button]');

    // BAD: Test knows about implementation details
    // If the component changes from polling every 100ms to 200ms, test breaks
    await waitFor('[data-test-data]', { timeout: 5000 });

    assert.dom('[data-test-data]').hasText('Loaded data');
  });
});
```

**Correct: using test waiters**

```glimmer-js
// tests/integration/components/data-loader-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import DataLoader from 'my-app/components/data-loader';

module('Integration | Component | data-loader', function(hooks) {
  setupRenderingTest(hooks);

  test('it loads data', async function(assert) {
    await render(<template><DataLoader /></template>);

    await click('[data-test-load-button]');

    // GOOD: settled() automatically waits for test waiters
    // No knowledge of timing needed - tests from user's perspective
    await settled();

    assert.dom('[data-test-data]').hasText('Loaded data');
  });
});
```

**Test waiter with cleanup:**

```glimmer-js
// app/components/polling-widget.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('polling-widget');

export class PollingWidget extends Component {
  @tracked status = 'idle';
  intervalId = null;
  token = null;

  constructor(owner, args) {
    super(owner, args);

    registerDestructor(this, () => {
      this.stopPolling();
    });
  }

  startPolling = () => {
    // Register async operation
    this.token = waiter.beginAsync();

    this.intervalId = setInterval(() => {
      this.checkStatus();
    }, 1000);
  };

  stopPolling = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // End async operation on cleanup
    if (this.token) {
      waiter.endAsync(this.token);
      this.token = null;
    }
  };

  checkStatus = async () => {
    const response = await fetch('/api/status');
    this.status = await response.text();

    if (this.status === 'complete') {
      this.stopPolling();
    }
  };

  <template>
    <div>
      <button {{on "click" this.startPolling}} data-test-start>
        Start Polling
      </button>
      <div data-test-status>{{this.status}}</div>
    </div>
  </template>
}
```

**Test waiter with Services:**

```glimmer-js
// tests/unit/services/data-sync-test.js
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

module('Unit | Service | data-sync', function(hooks) {
  setupTest(hooks);

  test('it syncs data', async function(assert) {
    const service = this.owner.lookup('service:data-sync');

    // Start async operation
    const syncPromise = service.sync();

    // No need for manual waiting - settled() handles it
    await settled();

    const result = await syncPromise;
    assert.ok(result, 'Sync completed successfully');
  });
});
```

**Multiple concurrent operations:**

```glimmer-js
// app/components/parallel-loader.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('parallel-loader');

export class ParallelLoader extends Component {
  @tracked results = [];

  loadAll = async () => {
    const urls = ['/api/data1', '/api/data2', '/api/data3'];

    // Each request gets its own token
    const requests = urls.map(async (url) => {
      const token = waiter.beginAsync();

      try {
        const response = await fetch(url);
        return await response.json();
      } finally {
        waiter.endAsync(token);
      }
    });

    this.results = await Promise.all(requests);
  };

  <template>
    <button {{on "click" this.loadAll}} data-test-load-all>
      Load All
    </button>

    {{#each this.results as |result|}}
      <div data-test-result>{{result}}</div>
    {{/each}}
  </template>
}
```

**Benefits:**

1. **User-focused tests**: Tests describe user actions, not implementation

2. **Resilient to refactoring**: Change timing/polling without breaking tests

3. **No arbitrary timeouts**: Tests complete as soon as operations finish

4. **Automatic waiting**: `settled()`, `click()`, etc. wait for all registered operations

5. **Better debugging**: Test waiters show pending operations when tests hang

**When to use test waiters:**

- Network requests (fetch, XHR)

- Timers and intervals (setTimeout, setInterval)

- Animations and transitions

- Polling operations

- Any async operation that affects rendered output

**When NOT needed:**

- ember-concurrency already registers test waiters automatically

- Promises that complete before render (data preparation in constructors)

- Operations that don't affect the DOM or component state

**Key principle:** If your code does something async that users care about, register it with a test waiter. Tests should never use `waitFor()` or `waitUntil()` - those are code smells indicating missing test waiters.

Reference: [https://github.com/emberjs/ember-test-waiters](https://github.com/emberjs/ember-test-waiters)

### 0.46 Use Tracked Toolbox for Complex State

**Impact: HIGH (Cleaner state management)**

For complex state patterns like maps, sets, and arrays that need fine-grained reactivity, use tracked-toolbox utilities instead of marking entire structures as @tracked.

**Incorrect: tracking entire structures**

```javascript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class TodoList extends Component {
  @tracked items = []; // Entire array replaced on every change

  addItem = (item) => {
    // Creates new array, invalidates all consumers
    this.items = [...this.items, item];
  };

  removeItem = (index) => {
    // Creates new array again
    this.items = this.items.filter((_, i) => i !== index);
  };
}
```

**Correct: using tracked-toolbox**

```javascript
import Component from '@glimmer/component';
import { TrackedArray } from 'tracked-built-ins';

class TodoList extends Component {
  items = new TrackedArray([]);

  // Use arrow functions for methods used in templates (no @action needed)
  addItem = (item) => {
    // Efficiently adds to tracked array
    this.items.push(item);
  };

  removeItem = (index) => {
    // Efficiently removes from tracked array
    this.items.splice(index, 1);
  };
}
```

**Also useful for Maps and Sets:**

```javascript
import { TrackedMap, TrackedSet } from 'tracked-built-ins';

class Cache extends Component {
  cache = new TrackedMap(); // Fine-grained reactivity per key
  selected = new TrackedSet(); // Fine-grained reactivity per item
}
```

tracked-built-ins provides fine-grained reactivity and better performance than replacing entire structures.

Reference: [https://github.com/tracked-tools/tracked-built-ins](https://github.com/tracked-tools/tracked-built-ins)

### 0.47 Validate Component Arguments

**Impact: MEDIUM (Better error messages and type safety)**

Validate component arguments for better error messages, documentation, and type safety.

**Incorrect: no argument validation**

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

**Correct: with TypeScript signature**

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

**Runtime validation with assertions: using getters**

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

Reference: [https://guides.emberjs.com/release/typescript/](https://guides.emberjs.com/release/typescript/)

### 0.48 VSCode Extensions and MCP Configuration for Ember Projects

**Impact: HIGH**

Set up recommended VSCode extensions and Model Context Protocol (MCP) servers for optimal Ember development experience.

**Incorrect: no extension recommendations**

```json
{
  "recommendations": []
}
```

**Correct: recommended extensions for Ember**

```json
{
  "recommendations": [
    "emberjs.vscode-ember",
    "vunguyentuan.vscode-glint",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

Create a `.vscode/extensions.json` file in your project root to recommend extensions to all team members:

**ember-extension-pack** (or individual extensions):**

- `emberjs.vscode-ember` - Ember.js language support

- Syntax highlighting for `.hbs`, `.gjs`, `.gts` files

- IntelliSense for Ember-specific patterns

- Code snippets for common Ember patterns

**Glint 2 Extension** (for TypeScript projects):**

```json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": false,
    "markdown": false
  },
  "mcp.servers": {
    "ember-mcp": {
      "command": "npx",
      "args": ["@ember/mcp-server"],
      "description": "Ember.js MCP Server - Provides Ember-specific context"
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-chrome-devtools"],
      "description": "Chrome DevTools MCP Server - Browser debugging integration"
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp-server"],
      "description": "Playwright MCP Server - Browser automation and testing"
    }
  }
}
```

- `vunguyentuan.vscode-glint` - Type checking for Glimmer templates

- Real-time type errors in `.gts`/`.gjs` files

- Template-aware autocomplete

- Hover information for template helpers and components

Install instructions:

Configure MCP servers in `.vscode/settings.json` to integrate AI coding assistants with Ember-specific context:

**Ember MCP Server** (`@ember/mcp-server`):**

- Ember API documentation lookup

- Component and helper discovery

- Addon documentation integration

- Routing and data layer context

**Chrome DevTools MCP** (`@modelcontextprotocol/server-chrome-devtools`):**

- Live browser inspection

- Console debugging assistance

- Network request analysis

- Performance profiling integration

**Playwright MCP** (optional, `@playwright/mcp-server`):**

```json
{
  "compilerOptions": {
    // ... standard TS options
  },
  "glint": {
    "environment": [
      "ember-loose",
      "ember-template-imports"
    ]
  }
}
```

- Test generation assistance

- Browser automation context

- E2E testing patterns

- Debugging test failures

Ensure your `tsconfig.json` has Glint configuration:

1. **Install extensions** (prompted automatically when opening project with `.vscode/extensions.json`)

2. **Install Glint** (if using TypeScript):

   ```bash

   npm install --save-dev @glint/core @glint/environment-ember-loose @glint/environment-ember-template-imports

   ```

3. **Configure MCP servers** in `.vscode/settings.json`

4. **Reload VSCode** to activate all extensions and MCP integrations

- **Consistent team setup**: All developers get same extensions

- **Type safety**: Glint provides template type checking

- **AI assistance**: MCP servers give AI tools Ember-specific context

- **Better DX**: Autocomplete, debugging, and testing integration

- **Reduced onboarding**: New team members get productive faster

- [VSCode Ember Extension](https://marketplace.visualstudio.com/items?itemName=emberjs.vscode-ember)

- [Glint Documentation](https://typed-ember.gitbook.io/glint/)

- [MCP Protocol Specification](https://modelcontextprotocol.io/)

- [Ember Primitives VSCode Setup Example](https://github.com/universal-ember/ember-primitives/tree/main/.vscode)

---

## 2. Build and Bundle Optimization

**Impact: CRITICAL**

Using Embroider with static build optimizations, route-based code splitting, and proper imports reduces bundle size and improves Time to Interactive.

### 2.1 Avoid Importing Entire Addon Namespaces

**Impact: CRITICAL (200-500ms import cost reduction)**

Import specific utilities and components directly rather than entire addon namespaces to enable better tree-shaking and reduce bundle size.

**Incorrect: imports entire namespace**

```javascript
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
// OK - these are already optimized

// But avoid this pattern with utility libraries:
import * as lodash from 'lodash';
import * as moment from 'moment';

class My extends Component {
  someMethod() {
    return lodash.debounce(this.handler, 300);
  }
}
```

**Correct: direct imports**

```javascript
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs'; // moment alternative, smaller

class My extends Component {
  someMethod() {
    return debounce(this.handler, 300);
  }
}
```

**Even better: use Ember utilities when available**

```javascript
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

class My extends Component {
  someMethod() {
    return debounce(this, this.handler, 300);
  }
}
```

Direct imports and using built-in Ember utilities reduce bundle size by avoiding unused code.

### 2.2 Lazy Load Heavy Dependencies

**Impact: CRITICAL (30-50% initial bundle reduction)**

Use dynamic imports to load heavy libraries only when needed, reducing initial bundle size.

**Incorrect: loaded upfront**

```javascript
import Component from '@glimmer/component';
import Chart from 'chart.js/auto'; // 300KB library loaded immediately
import hljs from 'highlight.js'; // 500KB library loaded immediately

class Dashboard extends Component {
  get showChart() {
    return this.args.hasData;
  }
}
```

**Correct: lazy loaded with error/loading state handling**

### 2.3 Use Embroider Build Pipeline

**Impact: CRITICAL (Modern build system with better performance)**

Use Embroider, Ember's modern build pipeline, with Vite for faster builds, better tree-shaking, and smaller bundles.

**Incorrect: classic build pipeline**

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {});
  return app.toTree();
};
```

**Correct: Embroider with Vite**

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

  let app = new EmberApp(defaults, {
    // Add options here
  });

  return compatBuild(app, buildOnce);
};
```

**For stricter static analysis: optimized mode**

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

  let app = new EmberApp(defaults, {
    // Add options here
  });

  return compatBuild(app, buildOnce, {
    // Enable static analysis for better tree-shaking
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
  });
};
```

Embroider provides a modern build pipeline with Vite that offers faster builds and better optimization compared to the classic Ember CLI build system.

Reference: [https://github.com/embroider-build/embroider](https://github.com/embroider-build/embroider)

---

## 8. Section 8

**Impact: HIGH**

### 8.1 Use Ember Concurrency Correctly - User Concurrency Not Data Loading

**Impact: HIGH (Prevents infinite render loops and improves performance)**

ember-concurrency is designed for **user-initiated concurrency patterns** (debouncing, throttling, preventing double-clicks), not data loading. Use task return values, don't set tracked state inside tasks.

- [TaskInstance API](https://ember-concurrency.com/api/TaskInstance.html)

- [Task API](https://ember-concurrency.com/api/Task.html)

- [ember-concurrency](https://ember-concurrency.com/)

- [warp-drive/reactiveweb](https://github.com/emberjs/data/tree/main/packages/reactiveweb)

**Incorrect: using ember-concurrency for data loading with tracked state**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

class UserProfile extends Component {
  @tracked userData = null;
  @tracked error = null;

  // WRONG: Setting tracked state inside task
  loadUserTask = task(async () => {
    try {
      const response = await fetch(`/api/users/${this.args.userId}`);
      this.userData = await response.json(); // Anti-pattern!
    } catch (e) {
      this.error = e; // Anti-pattern!
    }
  });

  <template>
    {{#if this.loadUserTask.isRunning}}
      Loading...
    {{else if this.userData}}
      <h1>{{this.userData.name}}</h1>
    {{/if}}
  </template>
}
```

**Why This Is Wrong:**

- Setting tracked state during render can cause infinite render loops

- ember-concurrency adds overhead unnecessary for simple data loading

- Makes component state harder to reason about

- Can trigger multiple re-renders

**Correct: use getPromiseState from warp-drive/reactiveweb for data loading**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { getPromiseState } from '@warp-drive/reactiveweb';

class UserProfile extends Component {
  @cached
  get userData() {
    const promise = fetch(`/api/users/${this.args.userId}`)
      .then(r => r.json());
    return getPromiseState(promise);
  }

  <template>
    {{#if this.userData.isPending}}
      <div>Loading...</div>
    {{else if this.userData.isRejected}}
      <div>Error: {{this.userData.error.message}}</div>
    {{else if this.userData.isFulfilled}}
      <h1>{{this.userData.value.name}}</h1>
    {{/if}}
  </template>
}
```

**Correct: use ember-concurrency for USER input with derived data patterns**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';
import { on } from '@ember/modifier';
import { pick } from 'ember-composable-helpers';

class Search extends Component {
  // CORRECT: For user-initiated search with debouncing
  // Use derived data from TaskInstance API - lastSuccessful
  searchTask = restartableTask(async (query) => {
    await timeout(300); // Debounce user typing
    const response = await fetch(`/api/search?q=${query}`);
    return response.json(); // Return value, don't set tracked state
  });

  <template>
    <input
      type="search"
      {{on "input" (fn this.searchTask.perform (pick "target.value"))}}
    />

    {{! Use derived data from task state - no tracked properties needed }}
    {{#if this.searchTask.isRunning}}
      <div>Searching...</div>
    {{/if}}

    {{! lastSuccessful persists previous results while new search runs }}
    {{#if this.searchTask.lastSuccessful}}
      <ul>
        {{#each this.searchTask.lastSuccessful.value as |result|}}
          <li>{{result.name}}</li>
        {{/each}}
      </ul>
    {{/if}}

    {{! Show error from most recent failed attempt }}
    {{#if this.searchTask.last.isError}}
      <div>Error: {{this.searchTask.last.error.message}}</div>
    {{/if}}
  </template>
}
```

**Good Use Cases for ember-concurrency:**

```glimmer-js
// app/components/form-submit.gjs
import Component from '@glimmer/component';
import { dropTask } from 'ember-concurrency';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

class FormSubmit extends Component {
  // dropTask prevents double-submit - perfect for user actions
  submitTask = dropTask(async (formData) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return response.json();
  });

  <template>
    <button
      {{on "click" (fn this.submitTask.perform @formData)}}
      disabled={{this.submitTask.isRunning}}
    >
      {{#if this.submitTask.isRunning}}
        Saving...
      {{else}}
        Save
      {{/if}}
    </button>

    {{! Use lastSuccessful for success message - derived data }}
    {{#if this.submitTask.lastSuccessful}}
      <div>Saved successfully!</div>
    {{/if}}

    {{#if this.submitTask.last.isError}}
      <div>Error: {{this.submitTask.last.error.message}}</div>
    {{/if}}
  </template>
}
```

1. **User input debouncing** - prevent API spam from typing

2. **Form submission** - prevent double-click submits with `dropTask`

3. **Autocomplete** - restart previous searches as user types

4. **Polling** - user-controlled refresh intervals

5. **Multi-step wizards** - sequential async operations

**Bad Use Cases for ember-concurrency:**

1. ❌ **Loading data on component init** - use `getPromiseState` instead

2. ❌ **Route model hooks** - just return promises directly

3. ❌ **Simple API calls** - async/await is sufficient

4. ❌ **Setting tracked state inside tasks** - causes render loops

**Key Principles:**

- **Derive data, don't set it** - Use `task.lastSuccessful`, `task.last`, `task.isRunning` (derived from TaskInstance API)

- **Use task return values** - Read from `task.lastSuccessful.value` or `task.last.value`, never set tracked state

- **User-initiated only** - ember-concurrency is for handling user concurrency patterns

- **Data loading** - Use `getPromiseState` from warp-drive/reactiveweb for non-user-initiated loading

- **Avoid side effects** - Don't modify component state inside tasks that's read during render

**TaskInstance API for Derived Data:**

ember-concurrency provides a powerful derived data API through Task and TaskInstance:

- `task.last` - The most recent TaskInstance (successful or failed)

- `task.lastSuccessful` - The most recent successful TaskInstance (persists during new attempts)

- `task.isRunning` - Derived boolean if any instance is running

- `taskInstance.value` - The returned value from the task

- `taskInstance.isError` - Derived boolean if this instance failed

- `taskInstance.error` - The error if this instance failed

This follows the **derived data pattern** - all state comes from the task itself, no tracked properties needed!

**Migration from tracked state pattern:**

```glimmer-js
// BEFORE (anti-pattern - setting tracked state)
class Bad extends Component {
  @tracked data = null;

  fetchTask = task(async () => {
    this.data = await fetch('/api/data').then(r => r.json());
  });

  // template reads: {{this.data}}
}

// AFTER (correct - using derived data from TaskInstance API)
class Good extends Component {
  fetchTask = restartableTask(async () => {
    return fetch('/api/data').then(r => r.json());
  });

  // template reads: {{this.fetchTask.lastSuccessful.value}}
  // All state derived from task - no tracked properties!
}

// Or better yet, for non-user-initiated loading:
class Better extends Component {
  @cached
  get data() {
    return getPromiseState(fetch('/api/data').then(r => r.json()));
  }

  // template reads: {{#if this.data.isFulfilled}}{{this.data.value}}{{/if}}
}
```

ember-concurrency is a powerful tool for **user concurrency patterns**. For data loading, use `getPromiseState` instead.

### 8.2 Use Ember Concurrency for User Input Concurrency

**Impact: HIGH (Better control of user-initiated async operations)**

Use ember-concurrency for managing **user-initiated** async operations like search, form submission, and autocomplete. It provides automatic cancelation, debouncing, and prevents race conditions from user actions.

**Incorrect: manual async handling with race conditions**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Search extends Component {
  @tracked results = [];
  @tracked isSearching = false;
  @tracked error = null;
  currentRequest = null;

  @action
  async search(event) {
    const query = event.target.value;

    // Manual cancelation - easy to get wrong
    if (this.currentRequest) {
      this.currentRequest.abort();
    }

    this.isSearching = true;
    this.error = null;

    const controller = new AbortController();
    this.currentRequest = controller;

    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal
      });
      this.results = await response.json();
    } catch (e) {
      if (e.name !== 'AbortError') {
        this.error = e.message;
      }
    } finally {
      this.isSearching = false;
    }
  }

  <template>
    <input {{on "input" this.search}} />
    {{#if this.isSearching}}Loading...{{/if}}
    {{#if this.error}}Error: {{this.error}}{{/if}}
  </template>
}
```

**Correct: using ember-concurrency with task return values**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { restartableTask } from 'ember-concurrency';

class Search extends Component {
  // restartableTask automatically cancels previous searches
  // IMPORTANT: Return the value, don't set tracked state inside tasks
  searchTask = restartableTask(async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json(); // Return, don't set @tracked
  });

  <template>
    <input {{on "input" (fn this.searchTask.perform (pick "target.value"))}} />

    {{#if this.searchTask.isRunning}}
      <div class="loading">Loading...</div>
    {{/if}}

    {{#if this.searchTask.last.isSuccessful}}
      <ul>
        {{#each this.searchTask.last.value as |result|}}
          <li>{{result.name}}</li>
        {{/each}}
      </ul>
    {{/if}}

    {{#if this.searchTask.last.isError}}
      <div class="error">{{this.searchTask.last.error.message}}</div>
    {{/if}}
  </template>
}
```

**With debouncing for user typing:**

```glimmer-js
// app/components/autocomplete.gjs
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';

class Autocomplete extends Component {
  searchTask = restartableTask(async (query) => {
    // Debounce user typing - wait 300ms
    await timeout(300);

    const response = await fetch(`/api/autocomplete?q=${query}`);
    return response.json(); // Return value, don't set tracked state
  });

  <template>
    <input
      type="search"
      {{on "input" (fn this.searchTask.perform (pick "target.value"))}}
      placeholder="Search..."
    />

    {{#if this.searchTask.isRunning}}
      <div class="spinner"></div>
    {{/if}}

    {{#if this.searchTask.lastSuccessful}}
      <ul class="suggestions">
        {{#each this.searchTask.lastSuccessful.value as |item|}}
          <li>{{item.title}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}
```

**Task modifiers for different user concurrency patterns:**

```glimmer-js
import Component from '@glimmer/component';
import { dropTask, enqueueTask, restartableTask } from 'ember-concurrency';

class FormActions extends Component {
  // dropTask: Prevents double-click - ignores new while running
  saveTask = dropTask(async (data) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  });

  // enqueueTask: Queues user actions sequentially
  processTask = enqueueTask(async (item) => {
    const response = await fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify(item)
    });
    return response.json();
  });

  // restartableTask: Cancels previous, starts new (for search)
  searchTask = restartableTask(async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  });

  <template>
    <button
      {{on "click" (fn this.saveTask.perform @data)}}
      disabled={{this.saveTask.isRunning}}
    >
      Save
    </button>
  </template>
}
```

**Key Principles for ember-concurrency:**

1. **User-initiated only** - Use for handling user actions, not component initialization

2. **Return values** - Use `task.last.value`, never set `@tracked` state inside tasks

3. **Avoid side effects** - Don't modify component state that's read during render inside tasks

4. **Choose right modifier**:

   - `restartableTask` - User typing/search (cancel previous)

   - `dropTask` - Form submit/save (prevent double-click)

   - `enqueueTask` - Sequential processing (queue user actions)

**When NOT to use ember-concurrency:**

- ❌ Component initialization data loading (use `getPromiseState` instead)

- ❌ Setting tracked state inside tasks (causes infinite render loops)

- ❌ Route model hooks (return promises directly)

- ❌ Simple async without user concurrency concerns (use async/await)

See **advanced-data-loading-with-ember-concurrency.md** for correct data loading patterns.

ember-concurrency provides automatic cancelation, derived state (isRunning, isIdle), and better patterns for **user-initiated** async operations.

Reference: [https://ember-concurrency.com/](https://ember-concurrency.com/)

### 8.3 Use Helper Functions for Reusable Logic

**Impact: LOW-MEDIUM (Better code reuse and testability)**

Extract reusable template logic into helper functions that can be tested independently and used across templates.

**Incorrect: logic duplicated in components**

```javascript
// app/components/user-card.js
class UserCard extends Component {
  get formattedDate() {
    const date = new Date(this.args.user.createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
}

// app/components/post-card.js - same logic duplicated!
class PostCard extends Component {
  get formattedDate() {
    // Same implementation...
  }
}
```

**Correct: reusable helper**

```javascript
// app/components/blog/format-relative-date.js
export function formatRelativeDate(date) {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return dateObj.toLocaleDateString();
}
```

For single-use helpers, keep them in the same file as the component:

For helpers shared across multiple components in a feature, use a subdirectory:

**Alternative: shared helper in utils**

```glimmer-js
// app/components/post-card.gjs
import { formatRelativeDate } from '../utils/format-relative-date';

<template>
  <p>Posted: {{formatRelativeDate @post.createdAt}}</p>
</template>
```

For truly shared helpers used across the whole app, use `app/utils/`:

**Note**: Keep utils flat (`app/utils/format-relative-date.js`), not nested (`app/utils/date/format-relative-date.js`). If you need cleaner top-level imports, configure subpath-imports in package.json instead of nesting files.

**For helpers with state, use class-based helpers:**

```javascript
// app/utils/helpers/format-currency.js
export class FormatCurrencyHelper {
  constructor(owner) {
    this.intl = owner.lookup('service:intl');
  }

  compute(amount, { currency = 'USD' } = {}) {
    return this.intl.formatNumber(amount, {
      style: 'currency',
      currency
    });
  }
}
```

**Common helpers to create:**

- Date/time formatting

- Number formatting

- String manipulation

- Array operations

- Conditional logic

Helpers promote code reuse, are easier to test, and keep components focused on behavior.

Reference: [https://guides.emberjs.com/release/components/helper-functions/](https://guides.emberjs.com/release/components/helper-functions/)

### 8.4 Use Modifiers for DOM Side Effects

**Impact: LOW-MEDIUM (Better separation of concerns)**

Use modifiers (element modifiers) to handle DOM side effects and lifecycle events in a reusable, composable way.

**Incorrect: manual DOM manipulation in component**

```glimmer-js
// app/components/chart.gjs
import Component from '@glimmer/component';

class Chart extends Component {
  chartInstance = null;

  constructor() {
    super(...arguments);
    // Can't access element here - element doesn't exist yet!
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.chartInstance?.destroy();
  }

  <template>
    <canvas id="chart-canvas"></canvas>
    {{! Manual setup is error-prone and not reusable }}
  </template>
}
```

**Correct: function modifier - preferred for simple side effects**

```javascript
// app/modifiers/chart.js
import { modifier } from 'ember-modifier';

export default modifier((element, [config]) => {
  // Initialize chart
  const chartInstance = new Chart(element, config);

  // Return cleanup function
  return () => {
    chartInstance.destroy();
  };
});
```

**Also correct: class-based modifier for complex state**

// app/modifiers/autofocus.js

import { modifier } from 'ember-modifier';

export default modifier((element) => {

  element.focus();

});

// app/components/input-field.gjs

import autofocus from '../modifiers/autofocus';

<template>

  <input {{autofocus}} type="text" />

</template>```

**Use ember-resize-observer-modifier for resize handling:**

```bash
ember install ember-resize-observer-modifier
```

---

## References

1. [https://emberjs.com](https://emberjs.com)
2. [https://guides.emberjs.com](https://guides.emberjs.com)
3. [https://guides.emberjs.com/release/accessibility/](https://guides.emberjs.com/release/accessibility/)
4. [https://warp-drive.io/](https://warp-drive.io/)
5. [https://github.com/ember-a11y/ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing)
6. [https://github.com/embroider-build/embroider](https://github.com/embroider-build/embroider)
7. [https://github.com/tracked-tools/tracked-toolbox](https://github.com/tracked-tools/tracked-toolbox)
8. [https://github.com/NullVoxPopuli/ember-resources](https://github.com/NullVoxPopuli/ember-resources)
9. [https://ember-concurrency.com/](https://ember-concurrency.com/)
10. [https://octane-guides.emberjs.com](https://octane-guides.emberjs.com)
