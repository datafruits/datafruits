---
title: Use {{#let}} to Avoid Recomputation
impact: MEDIUM
impactDescription: 30-50% reduction in duplicate work
tags: templates, helpers, performance, optimization
---

## Use {{#let}} to Avoid Recomputation

Use `{{#let}}` to compute expensive values once and reuse them in the template instead of calling getters or helpers multiple times.

**Incorrect (recomputes on every reference):**

```glimmer-js
// app/components/user-card.gjs
<template>
  <div class="user-card">
    {{#if (and this.user.isActive (not this.user.isDeleted))}}
      <h3>{{this.user.fullName}}</h3>
      <p>Status: Active</p>
    {{/if}}

    {{#if (and this.user.isActive (not this.user.isDeleted))}}
      <button {{on "click" this.editUser}}>Edit</button>
    {{/if}}

    {{#if (and this.user.isActive (not this.user.isDeleted))}}
      <button {{on "click" this.deleteUser}}>Delete</button>
    {{/if}}
  </div>
</template>```

**Correct (compute once, reuse):**

```glimmer-js
// app/components/user-card.gjs
<template>
  {{#let (and this.user.isActive (not this.user.isDeleted)) as |isEditable|}}
    <div class="user-card">
      {{#if isEditable}}
        <h3>{{this.user.fullName}}</h3>
        <p>Status: Active</p>
      {{/if}}

      {{#if isEditable}}
        <button {{on "click" this.editUser}}>Edit</button>
      {{/if}}

      {{#if isEditable}}
        <button {{on "click" this.deleteUser}}>Delete</button>
      {{/if}}
    </div>
  {{/let}}
</template>```

**Multiple values:**

```glimmer-js
// app/components/checkout.gjs
<template>
  {{#let
    (this.calculateTotal this.items)
    (this.formatCurrency this.total)
    (this.hasDiscount this.user)
    as |total formattedTotal showDiscount|
  }}
    <div class="checkout">
      <p>Total: {{formattedTotal}}</p>

      {{#if showDiscount}}
        <p>Original: {{total}}</p>
        <p>Discount Applied!</p>
      {{/if}}
    </div>
  {{/let}}
</template>```

`{{#let}}` computes values once and caches them for the block scope, reducing redundant calculations.
