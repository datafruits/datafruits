---
title: Use {{on}} Modifier for Event Handling
impact: MEDIUM
impactDescription: Better memory management and clarity
tags: events, modifiers, on, performance
---

## Use {{on}} Modifier for Event Handling

Use the `{{on}}` modifier for event handling instead of traditional action handlers for better memory management and clearer code.

**Incorrect (traditional action attribute):**

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

```glimmer-js
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

```glimmer-js
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

```glimmer-js
// app/components/item-list.gjs
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

<template>
  <ul>
    {{#each @items as |item|}}
      <li>
        {{item.name}}
        <button {{on "click" (fn @onDelete item.id)}}>
          Delete
        </button>
      </li>
    {{/each}}
  </ul>
</template>```

The `{{on}}` modifier properly cleans up event listeners, supports event options (passive, capture, once), and makes event handling more explicit.

Reference: [Ember Modifiers - on](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_event-handlers)
