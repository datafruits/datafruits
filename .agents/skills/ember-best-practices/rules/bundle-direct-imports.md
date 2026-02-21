---
title: Avoid Importing Entire Addon Namespaces
impact: CRITICAL
impactDescription: 200-500ms import cost reduction
tags: bundle, imports, tree-shaking, performance
---

## Avoid Importing Entire Addon Namespaces

Import specific utilities and components directly rather than entire addon namespaces to enable better tree-shaking and reduce bundle size.

**Incorrect (imports entire namespace):**

```javascript
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
// OK - these are already optimized

// But avoid this pattern with utility libraries:
import * as lodash from 'lodash';
import * as moment from 'moment';

class My extends Component {
  someMethod() {
    return lodash.debounce(this.handler, 300);
  }
}
```

**Correct (direct imports):**

```javascript
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs'; // moment alternative, smaller

class My extends Component {
  someMethod() {
    return debounce(this.handler, 300);
  }
}
```

**Even better (use Ember utilities when available):**

```javascript
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

class My extends Component {
  someMethod() {
    return debounce(this, this.handler, 300);
  }
}
```

Direct imports and using built-in Ember utilities reduce bundle size by avoiding unused code.
