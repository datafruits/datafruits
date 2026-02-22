---
title: Use Strict Mode and Template-Only Components
impact: HIGH
impactDescription: Better type safety and simpler components
tags: strict-mode, template-only, components, gjs
---

## Use Strict Mode and Template-Only Components

Use strict mode and template-only components for simpler, safer code with better tooling support.

**Incorrect (JavaScript component for simple templates):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

class UserCard extends Component {
  <template>
    <div class="user-card">
      <h3>{{@user.name}}</h3>
      <p>{{@user.email}}</p>
    </div>
  </template>
}```

**Correct (template-only component):**

```glimmer-js
// app/components/user-card.gjs
<template>
  <div class="user-card">
    <h3>{{@user.name}}</h3>
    <p>{{@user.email}}</p>
  </div>
</template>```

**With TypeScript for better type safety:**

```glimmer-ts
// app/components/user-card.gts
import type { TOC } from '@ember/component/template-only';

interface UserCardSignature {
  Args: {
    user: {
      name: string;
      email: string;
    };
  };
}

const UserCard: TOC<UserCardSignature> = <template>
  <div class="user-card">
    <h3>{{@user.name}}</h3>
    <p>{{@user.email}}</p>
  </div>
</template>;

export default UserCard;
```

**Enable strict mode in your app:**

```javascript
// ember-cli-build.js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });

  return app.toTree();
};
```

Template-only components are lighter, more performant, and easier to understand. Strict mode provides better error messages and prevents common mistakes.

Reference: [Ember Strict Mode](https://guides.emberjs.com/release/upgrading/current-edition/templates/)
