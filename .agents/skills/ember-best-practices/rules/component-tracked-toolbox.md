---
title: Use Tracked Toolbox for Complex State
impact: HIGH
impactDescription: Cleaner state management
tags: components, tracked, state-management, performance
---

## Use Tracked Toolbox for Complex State

For complex state patterns like maps, sets, and arrays that need fine-grained reactivity, use tracked-toolbox utilities instead of marking entire structures as @tracked.

**Incorrect (tracking entire structures):**

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

**Correct (using tracked-toolbox):**

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

Reference: [tracked-built-ins](https://github.com/tracked-tools/tracked-built-ins)
