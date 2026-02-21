---
title: Keyboard Navigation Support
impact: HIGH
impactDescription: Critical for keyboard-only users
tags: accessibility, a11y, keyboard, focus-management
---

## Keyboard Navigation Support

Ensure all interactive elements are keyboard accessible and focus management is handled properly, especially in modals and dynamic content.

**Incorrect (no keyboard support):**

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

**Correct (full keyboard support with custom modifier):**

```javascript
// app/modifiers/focus-first.js
import { modifier } from 'ember-modifier';

export default modifier((element, [selector = 'button']) => {
  // Focus first matching element when modifier runs
  element.querySelector(selector)?.focus();
});
```

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
ember install ember-focus-trap
```

```glimmer-js
// app/components/modal.gjs
import FocusTrap from 'ember-focus-trap/components/focus-trap';

<template>
  {{#if this.showModal}}
    <FocusTrap
      @isActive={{true}}
      @initialFocus="#modal-title"
    >
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{{@title}}</h2>
        {{yield}}
        <button type="button" {{on "click" this.closeModal}}>Close</button>
      </div>
    </FocusTrap>
  {{/if}}
</template>
```

**Alternative: Use libraries for keyboard support:**

For complex keyboard interactions, consider using libraries that abstract keyboard support patterns:

```bash
npm install @fluentui/keyboard-keys
```

Or use [tabster](https://tabster.io/) for comprehensive keyboard navigation management including focus trapping, arrow key navigation, and modalizers.

Proper keyboard navigation ensures all users can interact with your application effectively.

Reference: [Ember Accessibility - Keyboard](https://guides.emberjs.com/release/accessibility/keyboard/)
