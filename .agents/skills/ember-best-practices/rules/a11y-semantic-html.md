---
title: Semantic HTML and ARIA Attributes
impact: HIGH
impactDescription: Essential for screen reader users
tags: accessibility, a11y, semantic-html, aria
---

## Semantic HTML and ARIA Attributes

Use semantic HTML elements and proper ARIA attributes to make your application accessible to screen reader users. **The first rule of ARIA is to not use ARIA** - prefer native semantic HTML elements whenever possible.

**Key principle:** Native HTML elements have built-in keyboard support, roles, and behaviors. Only add ARIA when semantic HTML can't provide the needed functionality.

**Incorrect (divs with insufficient semantics):**

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

```glimmer-js
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

```glimmer-js
// app/components/custom-button.gjs
import Component from '@glimmer/component';
import { action } from '@ember/object';
import XIcon from './x-icon';

class CustomButton extends Component {
  @action
  handleKeyDown(event) {
    // Support Enter and Space keys for keyboard users
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick();
    }
  }

  @action
  handleClick() {
    this.args.onClick?.();
  }

  <template>
    <div
      role="button"
      tabindex="0"
      {{on "click" this.handleClick}}
      {{on "keydown" this.handleKeyDown}}
      aria-label="Close dialog"
    >
      <XIcon />
    </div>
  </template>
}```

Always use native semantic elements when possible. When creating custom interactive elements, ensure they're keyboard accessible and have proper ARIA attributes.

**References:**
- [ARIA Authoring Practices Guide (W3C)](https://www.w3.org/WAI/ARIA/apg/)
- [Using ARIA (W3C)](https://www.w3.org/TR/using-aria/)
- [ARIA in HTML (WHATWG)](https://html.spec.whatwg.org/multipage/aria.html#aria)
- [Ember Accessibility Guide](https://guides.emberjs.com/release/accessibility/)
