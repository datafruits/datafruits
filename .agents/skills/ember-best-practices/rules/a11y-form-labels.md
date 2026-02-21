---
title: Form Labels and Error Announcements
impact: HIGH
impactDescription: Essential for screen reader users
tags: accessibility, a11y, forms, aria-live
---

## Form Labels and Error Announcements

All form inputs must have associated labels, and validation errors should be announced to screen readers using ARIA live regions.

**Incorrect (missing labels and announcements):**

```glimmer-js
// app/components/form.gjs
<template>
  <form {{on "submit" this.handleSubmit}}>
    <input
      type="email"
      value={{this.email}}
      {{on "input" this.updateEmail}}
      placeholder="Email"
    />

    {{#if this.emailError}}
      <span>{{this.emailError}}</span>
    {{/if}}

    <button type="submit">Submit</button>
  </form>
</template>```

**Correct (with labels and announcements):**

```glimmer-js
// app/components/form.gjs
<template>
  <form {{on "submit" this.handleSubmit}}>
    <div>
      <label for="email-input">
        Email Address
        {{#if this.isEmailRequired}}
          <span aria-label="required">*</span>
        {{/if}}
      </label>

      <input
        id="email-input"
        type="email"
        value={{this.email}}
        {{on "input" this.updateEmail}}
        aria-describedby={{if this.emailError "email-error"}}
        aria-invalid={{if this.emailError "true"}}
        required={{this.isEmailRequired}}
      />

      {{#if this.emailError}}
        <span
          id="email-error"
          role="alert"
          aria-live="polite"
        >
          {{this.emailError}}
        </span>
      {{/if}}
    </div>

    <button type="submit" disabled={{this.isSubmitting}}>
      {{#if this.isSubmitting}}
        <span aria-live="polite">Submitting...</span>
      {{else}}
        Submit
      {{/if}}
    </button>
  </form>
</template>```

**For complex forms, use platform-native validation with custom logic:**

```glimmer-js
// app/components/user-form.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

class UserForm extends Component {
  @tracked errorMessages = {};

  validateEmail = (event) => {
    // Custom business logic validation
    const input = event.target;
    const value = input.value;

    if (!value) {
      input.setCustomValidity('Email is required');
      return false;
    }

    if (!input.validity.valid) {
      input.setCustomValidity('Must be a valid email');
      return false;
    }

    // Additional custom validation (e.g., check if email is already taken)
    if (value === 'taken@example.com') {
      input.setCustomValidity('This email is already registered');
      return false;
    }

    input.setCustomValidity('');
    return true;
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    // Run custom validations
    const emailInput = form.querySelector('[name="email"]');
    const fakeEvent = { target: emailInput };
    this.validateEmail(fakeEvent);

    // Use native validation check
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    await this.args.onSubmit(formData);
  };

  <template>
    <form {{on "submit" this.handleSubmit}}>
      <label for="user-email">
        Email
        <input
          id="user-email"
          type="email"
          name="email"
          required
          value={{@user.email}}
          {{on "blur" this.validateEmail}}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  </template>
}```

Always associate labels with inputs and announce dynamic changes to screen readers using aria-live regions.

Reference: [Ember Accessibility - Application Considerations](https://guides.emberjs.com/release/accessibility/application-considerations/)
