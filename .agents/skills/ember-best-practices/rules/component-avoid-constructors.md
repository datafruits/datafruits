---
title: Avoid Constructors in Components
impact: HIGH
impactDescription: Prevents infinite render loops and simplifies code
tags: components, constructors, initialization, anti-pattern
---

## Avoid Constructors in Components

**Strongly discourage constructor usage.** Modern Ember components rarely need constructors. Use class fields, @service decorators, and getPromiseState for initialization instead. Constructors with function calls that set tracked state can cause infinite render loops.

**Incorrect (using constructor):**

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

```glimmer-js
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

Reference:
- [Ember Octane Guide](https://guides.emberjs.com/release/upgrading/current-edition/)
- [warp-drive/reactiveweb](https://github.com/emberjs/data/tree/main/packages/reactiveweb)
