---
title: Use Glimmer Components Over Classic Components
impact: HIGH
impactDescription: 30-50% faster rendering
tags: components, glimmer, performance, reactivity
---

## Use Glimmer Components Over Classic Components

Glimmer components are lighter, faster, and have a simpler lifecycle than classic Ember components. They don't have two-way bindings or element lifecycle hooks, making them more predictable and performant.

**Incorrect (classic component):**

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

**Correct (Glimmer component):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

class UserCard extends Component {
  get fullName() {
    return `${this.args.user.firstName} ${this.args.user.lastName}`;
  }

  <template>
    <div class="user-card">
      <h3>{{this.fullName}}</h3>
      <p>{{@user.email}}</p>
    </div>
  </template>
}```

Glimmer components are 30-50% faster, have cleaner APIs, and integrate better with tracked properties.

Reference: [Glimmer Components](https://guides.emberjs.com/release/components/component-state-and-actions/)
