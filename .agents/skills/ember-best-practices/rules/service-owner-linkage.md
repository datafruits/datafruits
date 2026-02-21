---
title: Manage Service Owner and Linkage Patterns
impact: MEDIUM-HIGH
impactDescription: Better service organization and dependency management
tags: services, owner, linkage, dependency-injection, architecture
---

## Manage Service Owner and Linkage Patterns

Understand how to manage service linkage, owner passing, and alternative service organization patterns beyond the traditional app/services directory.

### Owner and Linkage Fundamentals

**Incorrect (manual service instantiation):**

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

```glimmer-js
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

### Manual Owner Passing (Without Libraries)

**Creating instances with owner:**

```glimmer-js
// app/components/data-processor.gjs
import Component from '@glimmer/component';
import { getOwner, setOwner } from '@ember/application';
import { service } from '@ember/service';

class DataTransformer {
  @service store;

  transform(data) {
    // Can use injected services because it has an owner
    return this.store.request({ url: '/transform', data });
  }
}

class DataProcessor extends Component {
  @service('store') storeService;

  constructor(owner, args) {
    super(owner, args);

    // Manual instantiation with owner linkage
    this.transformer = new DataTransformer();
    setOwner(this.transformer, getOwner(this));
  }

  processData(data) {
    // transformer can now access services
    return this.transformer.transform(data);
  }

  <template>
    <div>Processing...</div>
  </template>
}```

**Factory pattern with owner:**

```javascript
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
```

```glimmer-js
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

### Owner Passing with Modern Libraries

**Using reactiveweb's link() for ownership and destruction:**

The `link()` function from `reactiveweb` provides both ownership transfer and automatic destruction linkage.

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

**Why use link():**
- Automatically transfers owner from parent to child instance
- Registers destructor so child is cleaned up when parent is destroyed
- No manual `setOwner` or `registerDestructor` calls needed
- See [RFC #1067](https://github.com/emberjs/rfcs/pull/1067) for the proposal and reasoning
- Documentation: https://reactive.nullvoxpopuli.com/functions/link.link.html

### Services Outside app/services Directory

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

```javascript
// app/components/shopping-cart/service.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';
import { action } from '@ember/object';

export class CartService extends Service {
  @tracked items = new TrackedArray([]);

  get total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  @action
  addItem(item) {
    this.items.push(item);
  }

  @action
  removeItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index > -1) this.items.splice(index, 1);
  }

  @action
  clear() {
    this.items.clear();
  }
}
```

```glimmer-js
// app/components/shopping-cart/index.gjs
import Component from '@glimmer/component';
import { getOwner, setOwner } from '@ember/application';
import { CartService } from './service';

class ShoppingCart extends Component {
  cart = (() => {
    const instance = new CartService();
    setOwner(instance, getOwner(this));
    return instance;
  })();

  <template>
    <div class="cart">
      <h3>Cart ({{this.cart.items.length}} items)</h3>
      <div>Total: ${{this.cart.total}}</div>

      {{#each this.cart.items as |item|}}
        <div class="cart-item">
          {{item.name}} - ${{item.price}}
          <button {{on "click" (fn this.cart.removeItem item.id)}}>
            Remove
          </button>
        </div>
      {{/each}}

      <button {{on "click" this.cart.clear}}>Clear Cart</button>
    </div>
  </template>
}```

**Service-like utilities in utils/ directory:**

```javascript
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
```

```glimmer-js
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

### Registering Custom Services Dynamically

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

```glimmer-js
// app/components/feature-gated.gjs
import Component from '@glimmer/component';
import { service } from '@ember/service';

class FeatureGated extends Component {
  @service featureFlags;

  get shouldShow() {
    return this.featureFlags.isEnabled(this.args.feature);
  }

  <template>
    {{#if this.shouldShow}}
      {{yield}}
    {{else}}
      <div class="feature-disabled">This feature is not available</div>
    {{/if}}
  </template>
}```

### Best Practices

1. **Use @service decorator** for app/services - cleanest and most maintainable
2. **Use link() from reactiveweb** for ownership and destruction linkage
3. **Use createService from ember-primitives** for component-scoped services without extending Service class
4. **Manual owner passing** for utilities that need occasional service access
5. **Co-located services** for component-specific state that doesn't need global access
6. **Runtime registration** for dynamic services or testing scenarios
7. **Always use setOwner** when manually instantiating classes that need services

### When to Use Each Pattern

- **app/services**: Global singletons needed across the app
- **link() from reactiveweb**: When you need both owner and destruction linkage
- **createService from ember-primitives**: Component-scoped services without Service class
- **Co-located services**: Component-specific state, not needed elsewhere
- **Utils with owner**: Stateless utilities that occasionally need config/services
- **Runtime registration**: Dynamic configuration, feature flags, testing

Reference: [Ember Owner API](https://api.emberjs.com/ember/release/functions/@ember%2Fapplication/getOwner), [Dependency Injection](https://guides.emberjs.com/release/applications/dependency-injection/), [reactiveweb link()](https://reactive.nullvoxpopuli.com/functions/link.link.html), [ember-primitives createService](https://ce1d7e18.ember-primitives.pages.dev/6-utils/createService.md)
