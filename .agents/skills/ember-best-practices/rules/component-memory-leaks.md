---
title: Prevent Memory Leaks in Components
impact: HIGH
impactDescription: Avoid memory leaks and resource exhaustion
tags: memory, cleanup, lifecycle, performance
---

## Prevent Memory Leaks in Components

Properly clean up event listeners, timers, and subscriptions to prevent memory leaks.

**Incorrect (no cleanup):**

```glimmer-js
// app/components/live-clock.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class LiveClock extends Component {
  @tracked time = new Date();

  constructor() {
    super(...arguments);

    // Memory leak: interval never cleared
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  <template>
    <div>{{this.time}}</div>
  </template>
}```

**Correct (proper cleanup with registerDestructor):**

```glimmer-js
// app/components/live-clock.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

class LiveClock extends Component {
  @tracked time = new Date();

  constructor() {
    super(...arguments);

    const intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Proper cleanup
    registerDestructor(this, () => {
      clearInterval(intervalId);
    });
  }

  <template>
    <div>{{this.time}}</div>
  </template>
}```

**Event listener cleanup:**

```glimmer-js
// app/components/window-size.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

class WindowSize extends Component {
  @tracked width = window.innerWidth;
  @tracked height = window.innerHeight;

  constructor() {
    super(...arguments);

    const handleResize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    registerDestructor(this, () => {
      window.removeEventListener('resize', handleResize);
    });
  }

  <template>
    <div>Window: {{this.width}} x {{this.height}}</div>
  </template>
}```

**Using modifiers for automatic cleanup:**

```javascript
// app/modifiers/window-listener.js
import { modifier } from 'ember-modifier';

export default modifier((element, [eventName, handler]) => {
  window.addEventListener(eventName, handler);

  // Automatic cleanup when element is removed
  return () => {
    window.removeEventListener(eventName, handler);
  };
});
```

```glimmer-js
// app/components/resize-aware.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import windowListener from '../modifiers/window-listener';

class ResizeAware extends Component {
  @tracked size = { width: 0, height: 0 };

  handleResize = () => {
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  <template>
    <div {{windowListener "resize" this.handleResize}}>
      {{this.size.width}} x {{this.size.height}}
    </div>
  </template>
}```

**Abort controller for fetch requests:**

```glimmer-js
// app/components/data-loader.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

class DataLoader extends Component {
  @tracked data = null;
  abortController = new AbortController();

  constructor() {
    super(...arguments);

    this.loadData();

    registerDestructor(this, () => {
      this.abortController.abort();
    });
  }

  async loadData() {
    try {
      const response = await fetch('/api/data', {
        signal: this.abortController.signal
      });
      this.data = await response.json();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to load data:', error);
      }
    }
  }

  <template>
    {{#if this.data}}
      <div>{{this.data.content}}</div>
    {{/if}}
  </template>
}```

**Using ember-resources for automatic cleanup:**

```glimmer-js
// app/components/websocket-data.gjs
import Component from '@glimmer/component';
import { resource } from 'ember-resources';

class WebsocketData extends Component {
  messages = resource(({ on }) => {
    const messages = [];
    const ws = new WebSocket('wss://example.com/socket');

    ws.onmessage = (event) => {
      messages.push(event.data);
    };

    // Automatic cleanup
    on.cleanup(() => {
      ws.close();
    });

    return messages;
  });

  <template>
    {{#each this.messages.value as |message|}}
      <div>{{message}}</div>
    {{/each}}
  </template>
}```

Always clean up timers, event listeners, subscriptions, and pending requests to prevent memory leaks and performance degradation.

Reference: [Ember Destroyable](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable)
