---
title: Lazy Load Heavy Dependencies
impact: CRITICAL
impactDescription: 30-50% initial bundle reduction
tags: bundle, lazy-loading, dynamic-imports, performance
---

## Lazy Load Heavy Dependencies

Use dynamic imports to load heavy libraries only when needed, reducing initial bundle size.

**Incorrect (loaded upfront):**

```javascript
import Component from '@glimmer/component';
import Chart from 'chart.js/auto'; // 300KB library loaded immediately
import hljs from 'highlight.js'; // 500KB library loaded immediately

class Dashboard extends Component {
  get showChart() {
    return this.args.hasData;
  }
}
```

**Correct (lazy loaded with error/loading state handling):**

```glimmer-js
import Component from '@glimmer/component';
import { getPromiseState } from 'reactiveweb/promise';

class Dashboard extends Component {
  // Use getPromiseState to model promise state for error/loading handling
  chartLoader = getPromiseState(async () => {
    const { default: Chart } = await import('chart.js/auto');
    return Chart;
  });

  highlighterLoader = getPromiseState(async () => {
    const { default: hljs } = await import('highlight.js');
    return hljs;
  });

  loadChart = () => {
    // Triggers lazy load, handles loading/error states automatically
    return this.chartLoader.value;
  };

  highlightCode = (code) => {
    const hljs = this.highlighterLoader.value;
    if (hljs) {
      return hljs.highlightAuto(code);
    }
    return code;
  };

  <template>
    {{#if this.chartLoader.isLoading}}
      <p>Loading chart library...</p>
    {{else if this.chartLoader.isError}}
      <p>Error loading chart: {{this.chartLoader.error.message}}</p>
    {{else if this.chartLoader.isResolved}}
      <canvas {{on "click" this.loadChart}}></canvas>
    {{/if}}
  </template>
}```

**Note**: Always model promise state (loading/error/resolved) using `getPromiseState` from `reactiveweb/promise` to handle slow networks and errors properly.

Dynamic imports reduce initial bundle size by 30-50%, improving Time to Interactive.
