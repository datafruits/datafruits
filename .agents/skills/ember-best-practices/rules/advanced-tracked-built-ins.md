---
title: Use Reactive Collections from @ember/reactive/collections
impact: HIGH
impactDescription: Enables reactive arrays, maps, and sets
tags: reactivity, tracked, collections, advanced
---

## Use Reactive Collections from @ember/reactive/collections

Use reactive collections from `@ember/reactive/collections` to make arrays, Maps, and Sets reactive in Ember. Standard JavaScript collections don't trigger Ember's reactivity system when mutated—reactive collections solve this.

**The Problem:**
Standard arrays, Maps, and Sets are not reactive in Ember when you mutate them. Changes won't trigger template updates.

**The Solution:**
Use Ember's built-in reactive collections from `@ember/reactive/collections`.

### Reactive Arrays

**Incorrect (non-reactive array):**

```glimmer-js
// app/components/todo-list.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TodoList extends Component {
  @tracked todos = []; // ❌ Array mutations (push, splice, etc.) won't trigger updates

  @action
  addTodo(text) {
    // This won't trigger a re-render!
    this.todos.push({ id: Date.now(), text });
  }

  @action
  removeTodo(id) {
    // This also won't trigger a re-render!
    const index = this.todos.findIndex(t => t.id === id);
    this.todos.splice(index, 1);
  }

  <template>
    <ul>
      {{#each this.todos as |todo|}}
        <li>
          {{todo.text}}
          <button {{on "click" (fn this.removeTodo todo.id)}}>Remove</button>
        </li>
      {{/each}}
    </ul>
    <button {{on "click" (fn this.addTodo "New todo")}}>Add</button>
  </template>
}
```

**Correct (reactive array with @ember/reactive/collections):**

```glimmer-js
// app/components/todo-list.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { trackedArray } from '@ember/reactive/collections';

export default class TodoList extends Component {
  todos = trackedArray([]); // ✅ Mutations are reactive

  @action
  addTodo(text) {
    // Now this triggers re-render!
    this.todos.push({ id: Date.now(), text });
  }

  @action
  removeTodo(id) {
    // This also triggers re-render!
    const index = this.todos.findIndex(t => t.id === id);
    this.todos.splice(index, 1);
  }

  <template>
    <ul>
      {{#each this.todos as |todo|}}
        <li>
          {{todo.text}}
          <button {{on "click" (fn this.removeTodo todo.id)}}>Remove</button>
        </li>
      {{/each}}
    </ul>
    <button {{on "click" (fn this.addTodo "New todo")}}>Add</button>
  </template>
}
```

### Reactive Maps

Maps are useful for key-value stores with non-string keys:

```glimmer-js
// app/components/user-cache.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { trackedMap } from '@ember/reactive/collections';

export default class UserCache extends Component {
  userCache = trackedMap(); // key: userId, value: userData

  @action
  cacheUser(userId, userData) {
    this.userCache.set(userId, userData);
  }

  @action
  clearUser(userId) {
    this.userCache.delete(userId);
  }

  get cachedUsers() {
    return Array.from(this.userCache.values());
  }

  <template>
    <ul>
      {{#each this.cachedUsers as |user|}}
        <li>{{user.name}}</li>
      {{/each}}
    </ul>
    <p>Cache size: {{this.userCache.size}}</p>
  </template>
}
```

### Reactive Sets

Sets are useful for unique collections:

```glimmer-js
// app/components/tag-selector.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { trackedSet } from '@ember/reactive/collections';

export default class TagSelector extends Component {
  selectedTags = trackedSet();

  @action
  toggleTag(tag) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
  }

  get selectedCount() {
    return this.selectedTags.size;
  }

  <template>
    <div>
      {{#each @availableTags as |tag|}}
        <label>
          <input
            type="checkbox"
            checked={{this.selectedTags.has tag}}
            {{on "change" (fn this.toggleTag tag)}}
          />
          {{tag}}
        </label>
      {{/each}}
    </div>
    <p>Selected: {{this.selectedCount}} tags</p>
  </template>
}
```

### When to Use Each Type

| Type | Use Case |
|------|----------|
| `trackedArray` | Ordered lists that need mutation methods (push, pop, splice, etc.) |
| `trackedMap` | Key-value pairs with non-string keys or when you need `size` |
| `trackedSet` | Unique values, membership testing |

### Common Patterns

**Initialize with data:**

```javascript
import { trackedArray, trackedMap, trackedSet } from '@ember/reactive/collections';

// Array
const todos = trackedArray([
  { id: 1, text: 'First' },
  { id: 2, text: 'Second' }
]);

// Map
const userMap = trackedMap([
  [1, { name: 'Alice' }],
  [2, { name: 'Bob' }]
]);

// Set
const tags = trackedSet(['javascript', 'ember', 'web']);
```

**Convert to plain JavaScript:**

```javascript
// Array
const plainArray = [...trackedArray];
const plainArray2 = Array.from(trackedArray);

// Map
const plainObject = Object.fromEntries(trackedMap);

// Set
const plainArray3 = [...trackedSet];
```

**Functional array methods still work:**

```javascript
const todos = trackedArray([...]);

// All of these work and are reactive
const completed = todos.filter(t => t.done);
const titles = todos.map(t => t.title);
const allDone = todos.every(t => t.done);
const firstIncomplete = todos.find(t => !t.done);
```

### Alternative: Immutable Updates

If you prefer immutability, you can use regular `@tracked` with reassignment:

```javascript
import { tracked } from '@glimmer/tracking';

export default class TodoList extends Component {
  @tracked todos = [];

  @action
  addTodo(text) {
    // Reassignment is reactive
    this.todos = [...this.todos, { id: Date.now(), text }];
  }

  @action
  removeTodo(id) {
    // Reassignment is reactive
    this.todos = this.todos.filter(t => t.id !== id);
  }
}
```

**When to use each approach:**
- Use reactive collections when you need mutable operations (better performance for large lists)
- Use immutable updates when you want simpler mental model or need history/undo

### Best Practices

1. **Don't mix approaches** - choose either reactive collections or immutable updates
2. **Initialize in class field** - no need for constructor
3. **Use appropriate type** - Map for key-value, Set for unique values, Array for ordered lists
4. **Export from modules** if shared across components

Reactive collections from `@ember/reactive/collections` provide the best of both worlds: mutable operations with full reactivity. They're especially valuable for large lists or frequent updates where immutable updates would be expensive.

**References:**
- [Ember Reactivity System](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
- [JavaScript Built-in Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
- [Reactive Collections RFC](https://github.com/emberjs/rfcs/blob/master/text/0869-reactive-collections.md)
