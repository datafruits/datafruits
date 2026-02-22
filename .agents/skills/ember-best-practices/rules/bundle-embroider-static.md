---
title: Use Embroider Build Pipeline
impact: CRITICAL
impactDescription: Modern build system with better performance
tags: bundle, embroider, build-performance, vite
---

## Use Embroider Build Pipeline

Use Embroider, Ember's modern build pipeline, with Vite for faster builds, better tree-shaking, and smaller bundles.

**Incorrect (classic build pipeline):**

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {});
  return app.toTree();
};
```

**Correct (Embroider with Vite):**

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

  let app = new EmberApp(defaults, {
    // Add options here
  });

  return compatBuild(app, buildOnce);
};
```

**For stricter static analysis (optimized mode):**

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

  let app = new EmberApp(defaults, {
    // Add options here
  });

  return compatBuild(app, buildOnce, {
    // Enable static analysis for better tree-shaking
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
  });
};
```

Embroider provides a modern build pipeline with Vite that offers faster builds and better optimization compared to the classic Ember CLI build system.

Reference: [Embroider Documentation](https://github.com/embroider-build/embroider)
