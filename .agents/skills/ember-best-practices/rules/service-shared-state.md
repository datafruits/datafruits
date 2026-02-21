---
title: Use Services for Shared State
impact: MEDIUM-HIGH
impactDescription: Better state management and reusability
tags: services, state-management, dependency-injection
---

## Use Services for Shared State

Use services to manage shared state across components and routes instead of passing data through multiple layers or duplicating state.

**Incorrect (prop drilling):**

```glimmer-js
// app/routes/dashboard.gjs
export default class DashboardRoute extends Route {
  model() {
    return { currentTheme: 'dark' };
  }

  <template>
    <Header @theme={{@model.currentTheme}} />
    <Sidebar @theme={{@model.currentTheme}} />
    <MainContent @theme={{@model.currentTheme}} />
  </template>
}```

**Correct (using service):**

```javascript
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
```

```javascript
// app/components/header.js
import Component from '@glimmer/component';
import { service } from '@ember/service';

class Header extends Component {
  @service theme;

  // Access theme.currentTheme directly
}
```

```javascript
// app/components/sidebar.js
import Component from '@glimmer/component';
import { service } from '@ember/service';

class Sidebar extends Component {
  @service theme;

  // Access theme.currentTheme directly
}
```

Services provide centralized state management with automatic reactivity through tracked properties.

**For complex state, consider using Ember Data or ember-orbit:**

```javascript
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
```

Reference: [Ember Services](https://guides.emberjs.com/release/services/)
