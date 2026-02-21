---
title: Template-Only Components with In-Scope Functions
impact: MEDIUM
impactDescription: Clean, performant patterns for template-only components
tags: templates, components, functions, performance
---

## Template-Only Components with In-Scope Functions

For template-only components (components without a class and `this`), use in-scope functions to keep logic close to the template while avoiding unnecessary caching overhead.

**Incorrect (using class-based component for simple logic):**

```glimmer-js
// app/components/product-card.gjs
import Component from '@glimmer/component';

export class ProductCard extends Component {
  // Unnecessary class and overhead for simple formatting
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  <template>
    <div class="product-card">
      <h3>{{@product.name}}</h3>
      <div class="price">{{this.formatPrice @product.price}}</div>
    </div>
  </template>
}
```

**Correct (template-only component with in-scope functions):**

```glimmer-js
// app/components/product-card.gjs
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function calculateDiscount(price, discountPercent) {
  return price * (1 - discountPercent / 100);
}

function isOnSale(product) {
  return product.discountPercent > 0;
}

<template>
  <div class="product-card">
    <h3>{{@product.name}}</h3>

    {{#if (isOnSale @product)}}
      <div class="price">
        <span class="original">{{formatPrice @product.price}}</span>
        <span class="sale">
          {{formatPrice (calculateDiscount @product.price @product.discountPercent)}}
        </span>
      </div>
    {{else}}
      <div class="price">{{formatPrice @product.price}}</div>
    {{/if}}

    <p>{{@product.description}}</p>
  </div>
</template>
```

**When to use class-based vs template-only:**

```glimmer-js
// Use class-based when:
// - You need @cached for expensive computations accessed multiple times
// - You have tracked state
// - You need lifecycle hooks or services

import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

export class ProductList extends Component {
  @cached
  get sortedProducts() {
    // Expensive sort, accessed in template multiple times
    return [...this.args.products].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  @cached
  get filteredProducts() {
    // Depends on sortedProducts - benefits from caching
    return this.sortedProducts.filter(p =>
      p.category === this.args.selectedCategory
    );
  }

  <template>
    {{#each this.filteredProducts as |product|}}
      <div>{{product.name}}</div>
    {{/each}}
  </template>
}
```

```glimmer-js
// Use template-only when:
// - Simple transformations
// - Functions accessed once
// - No state or services needed

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

<template>
  <div class="timestamp">
    Last updated: {{formatDate @lastUpdate}}
  </div>
</template>
```

**Combining in-scope functions for readability:**

```glimmer-js
// app/components/user-badge.gjs
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

function getBadgeColor(status) {
  const colors = {
    active: 'green',
    pending: 'yellow',
    inactive: 'gray'
  };
  return colors[status] || 'gray';
}

<template>
  <div class="user-badge" style="background-color: {{getBadgeColor @user.status}}">
    <span class="initials">{{getInitials @user.name}}</span>
    <span class="name">{{@user.name}}</span>
  </div>
</template>
```

**Anti-pattern - Complex nested calls:**

```glimmer-js
// ❌ Hard to read, lots of nesting
<template>
  <div>
    {{formatCurrency (multiply (add @basePrice @taxAmount) @quantity)}}
  </div>
</template>

// ✅ Better - use intermediate function
function calculateTotal(basePrice, taxAmount, quantity) {
  return (basePrice + taxAmount) * quantity;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

<template>
  <div>
    {{formatCurrency (calculateTotal @basePrice @taxAmount @quantity)}}
  </div>
</template>
```

**Key differences from class-based components:**

| Aspect | Template-Only | Class-Based |
|--------|--------------|-------------|
| `this` context | ❌ No `this` | ✅ Has `this` |
| Function caching | ❌ Recreated each render | ✅ `@cached` available |
| Services | ❌ Cannot inject | ✅ `@service` decorator |
| Tracked state | ❌ No instance state | ✅ `@tracked` properties |
| Best for | Simple, stateless | Complex, stateful |

**Best practices:**

1. **Keep functions simple** - If computation is complex, consider a class with `@cached`
2. **One responsibility per function** - Makes them reusable and testable
3. **Minimize nesting** - Use intermediate functions for readability
4. **No side effects** - Functions should be pure transformations
5. **Export for testing** - Export functions so they can be tested independently

```glimmer-js
// app/components/stats-display.gjs
export function average(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

export function round(number, decimals = 2) {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

<template>
  <div class="stats">
    Average: {{round (average @scores)}}
  </div>
</template>
```

Reference: [Template-only Components](https://guides.emberjs.com/release/components/component-types/), [Component Authoring Best Practices](https://guides.emberjs.com/release/components/conditional-content/)
