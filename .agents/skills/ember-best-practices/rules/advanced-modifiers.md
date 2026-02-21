---
title: Use Modifiers for DOM Side Effects
impact: LOW-MEDIUM
impactDescription: Better separation of concerns
tags: modifiers, dom, lifecycle, advanced
---

## Use Modifiers for DOM Side Effects

Use modifiers (element modifiers) to handle DOM side effects and lifecycle events in a reusable, composable way.

**Incorrect (manual DOM manipulation in component):**

```glimmer-js
// app/components/chart.gjs
import Component from '@glimmer/component';

class Chart extends Component {
  chartInstance = null;

  constructor() {
    super(...arguments);
    // Can't access element here - element doesn't exist yet!
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.chartInstance?.destroy();
  }

  <template>
    <canvas id="chart-canvas"></canvas>
    {{! Manual setup is error-prone and not reusable }}
  </template>
}
```

**Correct (function modifier - preferred for simple side effects):**

```javascript
// app/modifiers/chart.js
import { modifier } from 'ember-modifier';

export default modifier((element, [config]) => {
  // Initialize chart
  const chartInstance = new Chart(element, config);

  // Return cleanup function
  return () => {
    chartInstance.destroy();
  };
});
```

**Also correct (class-based modifier for complex state):**

```javascript
// app/modifiers/chart.js
import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

export default class ChartModifier extends Modifier {
  chartInstance = null;

  modify(element, [config]) {
    // Cleanup previous instance if config changed
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(element, config);

    // Register cleanup
    registerDestructor(this, () => {
      this.chartInstance?.destroy();
    });
  }
}
```

```glimmer-js
// app/components/chart.gjs
import chart from '../modifiers/chart';

<template>
  <canvas {{chart @config}}></canvas>
</template>```

**Use function modifiers** for simple side effects. Use class-based modifiers only when you need complex state management.

**For commonly needed modifiers, use ember-modifier helpers:**

```javascript
// app/modifiers/autofocus.js
import { modifier } from 'ember-modifier';

export default modifier((element) => {
  element.focus();
});
```

```glimmer-js
// app/components/input-field.gjs
import autofocus from '../modifiers/autofocus';

<template>
  <input {{autofocus}} type="text" />
</template>```

**Use ember-resize-observer-modifier for resize handling:**

```bash
ember install ember-resize-observer-modifier
```

```glimmer-js
// app/components/resizable.gjs
import onResize from 'ember-resize-observer-modifier';

<template>
  <div {{onResize this.handleResize}}>
    Content that responds to size changes
  </div>
</template>```

Modifiers provide a clean, reusable way to manage DOM side effects without coupling to specific components.

Reference: [Ember Modifiers](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
