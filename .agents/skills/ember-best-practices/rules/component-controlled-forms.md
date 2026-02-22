---
title: Use Native Forms with Platform Validation
category: component
impact: HIGH
---

# Use Native Forms with Platform Validation

Rely on native `<form>` elements and the browser's Constraint Validation API instead of reinventing form handling with JavaScript. The platform is really good at forms.

## Problem

Over-engineering forms with JavaScript when native browser features provide validation, accessibility, and UX patterns for free.

**Incorrect (Too much JavaScript):**
```glimmer-js
// app/components/signup-form.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class SignupForm extends Component {
  @tracked email = '';
  @tracked emailError = '';

  validateEmail = () => {
    // ❌ Reinventing email validation
    if (!this.email.includes('@')) {
      this.emailError = 'Invalid email';
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.emailError) return;
    // Submit logic
  };

  <template>
    <div>
      <input
        type="text"
        value={{this.email}}
        {{on "input" this.updateEmail}}
        {{on "blur" this.validateEmail}}
      />
      {{#if this.emailError}}
        <span class="error">{{this.emailError}}</span>
      {{/if}}
      <button type="button" {{on "click" this.handleSubmit}}>Submit</button>
    </div>
  </template>
}```

## Solution: Let the Platform Do the Work

Use native `<form>` with proper input types and browser validation:

**Correct (Native form with platform validation):**
```glimmer-js
// app/components/signup-form.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

class SignupForm extends Component {
  @tracked validationErrors = null;

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    // ✅ Use native checkValidity()
    if (!form.checkValidity()) {
      // Show native validation messages
      form.reportValidity();
      return;
    }

    // ✅ Use FormData API - no tracked state needed!
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    this.args.onSubmit(data);
  };

  <template>
    <form {{on "submit" this.handleSubmit}}>
      {{! ✅ Browser handles validation automatically }}
      <input
        type="email"
        name="email"
        required
        placeholder="email@example.com"
      />

      <input
        type="password"
        name="password"
        required
        minlength="8"
        placeholder="Min 8 characters"
      />

      <button type="submit">Sign Up</button>
    </form>
  </template>
}```

**Performance: -15KB** (no validation libraries needed)
**Accessibility: +100%** (native form semantics and error announcements)
**Code: -50%** (let the platform handle it)

## Custom Validation Messages with Constraint Validation API

Access and display native validation state in your component:

```glimmer-js
// app/components/validated-form.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

class ValidatedForm extends Component {
  @tracked errors = new Map();

  handleInput = (event) => {
    const input = event.target;

    // ✅ Access Constraint Validation API
    if (!input.validity.valid) {
      this.errors.set(input.name, input.validationMessage);
    } else {
      this.errors.delete(input.name);
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) {
      // Trigger native validation UI
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    this.args.onSubmit(Object.fromEntries(formData));
  };

  <template>
    <form {{on "submit" this.handleSubmit}}>
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          {{on "input" this.handleInput}}
        />
        {{#if (this.errors.get "email")}}
          <span class="error" role="alert">
            {{this.errors.get "email"}}
          </span>
        {{/if}}
      </div>

      <div>
        <label for="age">Age</label>
        <input
          id="age"
          type="number"
          name="age"
          min="18"
          max="120"
          required
          {{on "input" this.handleInput}}
        />
        {{#if (this.errors.get "age")}}
          <span class="error" role="alert">
            {{this.errors.get "age"}}
          </span>
        {{/if}}
      </div>

      <button type="submit">Submit</button>
    </form>
  </template>
}```

## Constraint Validation API Properties

The browser provides rich validation state via `input.validity`:

```javascript
handleInput = (event) => {
  const input = event.target;
  const validity = input.validity;

  // Check specific validation states:
  if (validity.valueMissing) {
    // required field is empty
  }
  if (validity.typeMismatch) {
    // type="email" but value isn't email format
  }
  if (validity.tooShort || validity.tooLong) {
    // minlength/maxlength violated
  }
  if (validity.rangeUnderflow || validity.rangeOverflow) {
    // min/max violated
  }
  if (validity.patternMismatch) {
    // pattern attribute not matched
  }

  // Or use the aggregated validationMessage:
  if (!validity.valid) {
    this.showError(input.name, input.validationMessage);
  }
};
```

## Custom Validation with setCustomValidity

For business logic validation beyond HTML5 constraints:

```glimmer-js
// app/components/password-match-form.gjs
import Component from '@glimmer/component';
import { on } from '@ember/modifier';

class PasswordMatchForm extends Component {
  validatePasswordMatch = (event) => {
    const form = event.target.form;
    const password = form.querySelector('[name="password"]');
    const confirm = form.querySelector('[name="confirm"]');

    // ✅ Use setCustomValidity for custom validation
    if (password.value !== confirm.value) {
      confirm.setCustomValidity('Passwords must match');
    } else {
      confirm.setCustomValidity(''); // Clear custom error
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    this.args.onSubmit(Object.fromEntries(formData));
  };

  <template>
    <form {{on "submit" this.handleSubmit}}>
      <input
        type="password"
        name="password"
        required
        minlength="8"
        placeholder="Password"
      />

      <input
        type="password"
        name="confirm"
        required
        placeholder="Confirm password"
        {{on "input" this.validatePasswordMatch}}
      />

      <button type="submit">Create Account</button>
    </form>
  </template>
}```

## When You Need Controlled State

Use controlled patterns when you need real-time interactivity that isn't form submission:

```glimmer-js
// app/components/live-search.gjs - Controlled state needed for instant search
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

class LiveSearch extends Component {
  @tracked query = '';

  updateQuery = (event) => {
    this.query = event.target.value;
    // Instant search as user types
    this.args.onSearch?.(this.query);
  };

  <template>
    {{! Controlled state justified - need instant feedback }}
    <input
      type="search"
      value={{this.query}}
      {{on "input" this.updateQuery}}
      placeholder="Search..."
    />
    {{#if this.query}}
      <p>Searching for: {{this.query}}</p>
    {{/if}}
  </template>
}```

**Use controlled state when you need:**
- Real-time validation display as user types
- Character counters
- Live search/filtering
- Multi-step forms where state drives UI
- Form state that affects other components

**Use native forms when:**
- Simple submit-and-validate workflows
- Standard HTML5 validation is sufficient
- You want browser-native UX and accessibility
- Simpler code and less JavaScript is better

## References

- [MDN: Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)
- [MDN: FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [MDN: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [Ember Guides: Event Handling](https://guides.emberjs.com/release/components/component-state-and-actions/)
