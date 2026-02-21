---
title: Build Reactive Chains with Dependent Getters
impact: HIGH
impactDescription: Clear data flow and automatic reactivity
tags: reactivity, getters, tracked, derived-state, composition
---

## Build Reactive Chains with Dependent Getters

Create reactive chains where getters depend on other getters or tracked properties for clear, maintainable data derivation.

**Incorrect (imperative updates):**

```glimmer-js
// app/components/shopping-cart.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class ShoppingCart extends Component {
  @tracked items = [];
  @tracked subtotal = 0;
  @tracked tax = 0;
  @tracked shipping = 0;
  @tracked total = 0;

  @action
  addItem(item) {
    this.items = [...this.items, item];
    this.recalculate();
  }

  @action
  removeItem(index) {
    this.items = this.items.filter((_, i) => i !== index);
    this.recalculate();
  }

  recalculate() {
    this.subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    this.tax = this.subtotal * 0.08;
    this.shipping = this.subtotal > 50 ? 0 : 5.99;
    this.total = this.subtotal + this.tax + this.shipping;
  }

  <template>
    <div class="cart">
      <div>Subtotal: ${{this.subtotal}}</div>
      <div>Tax: ${{this.tax}}</div>
      <div>Shipping: ${{this.shipping}}</div>
      <div>Total: ${{this.total}}</div>
    </div>
  </template>
}```

**Correct (reactive getter chains):**

```glimmer-js
// app/components/shopping-cart.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { TrackedArray } from 'tracked-built-ins';

class ShoppingCart extends Component {
  @tracked items = new TrackedArray([]);

  // Base calculation
  get subtotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  // Depends on subtotal
  get tax() {
    return this.subtotal * 0.08;
  }

  // Depends on subtotal
  get shipping() {
    return this.subtotal > 50 ? 0 : 5.99;
  }

  // Depends on subtotal, tax, and shipping
  get total() {
    return this.subtotal + this.tax + this.shipping;
  }

  // Derived from total
  get formattedTotal() {
    return `$${this.total.toFixed(2)}`;
  }

  // Multiple dependencies
  get discount() {
    if (this.items.length >= 5) return this.subtotal * 0.1;
    if (this.subtotal > 100) return this.subtotal * 0.05;
    return 0;
  }

  // Depends on total and discount
  get finalTotal() {
    return this.total - this.discount;
  }

  @action
  addItem(item) {
    this.items.push(item);
    // All getters automatically update!
  }

  @action
  removeItem(index) {
    this.items.splice(index, 1);
    // All getters automatically update!
  }

  <template>
    <div class="cart">
      <div>Items: {{this.items.length}}</div>
      <div>Subtotal: ${{this.subtotal.toFixed 2}}</div>
      <div>Tax: ${{this.tax.toFixed 2}}</div>
      <div>Shipping: ${{this.shipping.toFixed 2}}</div>
      {{#if this.discount}}
        <div class="discount">Discount: -${{this.discount.toFixed 2}}</div>
      {{/if}}
      <div class="total">Total: {{this.formattedTotal}}</div>
    </div>
  </template>
}```

**Complex reactive chains with @cached:**

```glimmer-js
// app/components/data-analysis.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class DataAnalysis extends Component {
  // Base data
  get rawData() {
    return this.args.data || [];
  }

  // Level 1: Filter
  @cached
  get validData() {
    return this.rawData.filter(item => item.value != null);
  }

  // Level 2: Transform (depends on validData)
  @cached
  get normalizedData() {
    const max = Math.max(...this.validData.map(d => d.value));
    return this.validData.map(item => ({
      ...item,
      normalized: item.value / max
    }));
  }

  // Level 2: Statistics (depends on validData)
  @cached
  get statistics() {
    const values = this.validData.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;

    return {
      count: values.length,
      sum,
      mean,
      stdDev: Math.sqrt(variance),
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  // Level 3: Depends on normalizedData and statistics
  @cached
  get outliers() {
    const threshold = this.statistics.mean + (2 * this.statistics.stdDev);
    return this.normalizedData.filter(item => item.value > threshold);
  }

  // Level 3: Depends on statistics
  get qualityScore() {
    const validRatio = this.validData.length / this.rawData.length;
    const outlierRatio = this.outliers.length / this.validData.length;
    return (validRatio * 0.7) + ((1 - outlierRatio) * 0.3);
  }

  <template>
    <div class="analysis">
      <h3>Data Quality: {{this.qualityScore.toFixed 2}}</h3>
      <div>Valid: {{this.validData.length}} / {{this.rawData.length}}</div>
      <div>Mean: {{this.statistics.mean.toFixed 2}}</div>
      <div>Std Dev: {{this.statistics.stdDev.toFixed 2}}</div>
      <div>Outliers: {{this.outliers.length}}</div>
    </div>
  </template>
}```

**Combining multiple tracked sources:**

```glimmer-js
// app/components/filtered-list.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { cached } from '@glimmer/tracking';

class FilteredList extends Component {
  @tracked searchTerm = '';
  @tracked selectedCategory = 'all';
  @tracked sortDirection = 'asc';

  // Depends on args.items and searchTerm
  @cached
  get searchFiltered() {
    if (!this.searchTerm) return this.args.items;

    const term = this.searchTerm.toLowerCase();
    return this.args.items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  }

  // Depends on searchFiltered and selectedCategory
  @cached
  get categoryFiltered() {
    if (this.selectedCategory === 'all') return this.searchFiltered;

    return this.searchFiltered.filter(item =>
      item.category === this.selectedCategory
    );
  }

  // Depends on categoryFiltered and sortDirection
  @cached
  get sorted() {
    const items = [...this.categoryFiltered];
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    return items.sort((a, b) =>
      direction * a.name.localeCompare(b.name)
    );
  }

  // Final result
  get items() {
    return this.sorted;
  }

  // Metadata derived from chain
  get resultsCount() {
    return this.items.length;
  }

  get hasFilters() {
    return this.searchTerm || this.selectedCategory !== 'all';
  }

  <template>
    <div class="filtered-list">
      <input
        type="search"
        value={{this.searchTerm}}
        {{on "input" (pick "target.value" (set this "searchTerm"))}}
      />

      <select
        value={{this.selectedCategory}}
        {{on "change" (pick "target.value" (set this "selectedCategory"))}}
      >
        <option value="all">All Categories</option>
        {{#each @categories as |cat|}}
          <option value={{cat}}>{{cat}}</option>
        {{/each}}
      </select>

      <p>Showing {{this.resultsCount}} results</p>

      {{#each this.items as |item|}}
        <div>{{item.name}}</div>
      {{/each}}
    </div>
  </template>
}```

Reactive getter chains provide automatic updates, clear data dependencies, and better performance through intelligent caching with @cached.

Reference: [Glimmer Tracking](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
