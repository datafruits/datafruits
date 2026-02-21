---
title: Use {{on}} Modifier Instead of Event Handler Properties
impact: MEDIUM
impactDescription: Better performance and clearer event handling
tags: performance, events, modifiers, best-practices
---

## Use {{on}} Modifier Instead of Event Handler Properties

Always use the `{{on}}` modifier for event handling instead of HTML event handler properties. The `{{on}}` modifier provides better memory management, automatic cleanup, and clearer intent.

**Why {{on}} is Better:**
- Automatic cleanup when element is removed (prevents memory leaks)
- Supports event options (`capture`, `passive`, `once`)
- More explicit and searchable in templates

**Incorrect (HTML event properties):**

```glimmer-js
// app/components/button.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Button extends Component {
  @action
  handleClick() {
    console.log('clicked');
  }

  <template>
    <button onclick={{this.handleClick}}>
      Click Me
    </button>
  </template>
}
```

**Correct ({{on}} modifier):**

```glimmer-js
// app/components/button.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class Button extends Component {
  @action
  handleClick() {
    console.log('clicked');
  }

  <template>
    <button {{on "click" this.handleClick}}>
      Click Me
    </button>
  </template>
}
```

### Event Options

The `{{on}}` modifier supports standard event listener options:

```glimmer-js
// app/components/scrollable.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class Scrollable extends Component {
  @action
  handleScroll(event) {
    console.log('scrolled', event.target.scrollTop);
  }

  <template>
    {{! passive: true improves scroll performance }}
    <div {{on "scroll" this.handleScroll passive=true}}>
      {{yield}}
    </div>
  </template>
}
```

**Available options:**
- `capture` - Use capture phase instead of bubble phase
- `once` - Remove listener after first invocation
- `passive` - Indicates handler won't call `preventDefault()` (better scroll performance)

### Handling Multiple Events

```glimmer-js
// app/components/input-field.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class InputField extends Component {
  @action
  handleFocus() {
    console.log('focused');
  }

  @action
  handleBlur() {
    console.log('blurred');
  }

  @action
  handleInput(event) {
    this.args.onChange?.(event.target.value);
  }

  <template>
    <input
      type="text"
      value={{@value}}
      {{on "focus" this.handleFocus}}
      {{on "blur" this.handleBlur}}
      {{on "input" this.handleInput}}
    />
  </template>
}
```

### Preventing Default and Stopping Propagation

Handle these in your action, not in the template:

```glimmer-js
// app/components/form.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class Form extends Component {
  @action
  handleSubmit(event) {
    event.preventDefault(); // Prevent page reload
    event.stopPropagation(); // Stop event bubbling if needed

    this.args.onSubmit?.(/* form data */);
  }

  <template>
    <form {{on "submit" this.handleSubmit}}>
      <button type="submit">Submit</button>
    </form>
  </template>
}
```

### Keyboard Events

```glimmer-js
// app/components/keyboard-nav.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class KeyboardNav extends Component {
  @action
  handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.args.onActivate?.();
    }

    if (event.key === 'Escape') {
      this.args.onCancel?.();
    }
  }

  <template>
    <div
      role="button"
      tabindex="0"
      {{on "keydown" this.handleKeyDown}}
    >
      {{yield}}
    </div>
  </template>
}
```

### Performance Tip: Event Delegation

For lists with many items, use event delegation on the parent:

```glimmer-js
// app/components/todo-list.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class TodoList extends Component {
  @action
  handleClick(event) {
    // Find which todo was clicked
    const todoId = event.target.closest('[data-todo-id]')?.dataset.todoId;
    if (todoId) {
      this.args.onTodoClick?.(todoId);
    }
  }

  <template>
    {{! Single listener for all todos - better than one per item }}
    <ul {{on "click" this.handleClick}}>
      {{#each @todos as |todo|}}
        <li data-todo-id={{todo.id}}>
          {{todo.title}}
        </li>
      {{/each}}
    </ul>
  </template>
}
```

### Common Pitfalls

**❌ Don't bind directly without @action:**

```glimmer-js
// This won't work - loses 'this' context
<button {{on "click" this.myMethod}}>Bad</button>
```

**✅ Use @action decorator:**

```glimmer-js
@action
myMethod() {
  // 'this' is correctly bound
}

<button {{on "click" this.myMethod}}>Good</button>
```

**❌ Don't use string event handlers:**

```glimmer-js
{{! Security risk and doesn't work in strict mode }}
<button onclick="handleClick()">Bad</button>
```

Always use the `{{on}}` modifier for cleaner, safer, and more performant event handling in Ember applications.

**References:**
- [Ember Modifiers Guide](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
- [{{on}} Modifier RFC](https://github.com/emberjs/rfcs/blob/master/text/0471-on-modifier.md)
- [Event Listener Options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#parameters)
