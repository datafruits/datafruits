---
title: Use Route Templates with Co-located Syntax
impact: MEDIUM-HIGH
impactDescription: Better code organization and maintainability
tags: routes, templates, gjs, co-location
---

## Use Route Templates with Co-located Syntax

Use co-located route templates with modern gjs syntax for better organization and maintainability.

**Incorrect (separate template file - old pattern):**

```glimmer-js
// app/routes/posts.js (separate file)
import Route from '@ember/routing/route';

export default class PostsRoute extends Route {
  model() {
    return this.store.request({ url: '/posts' });
  }
}

// app/templates/posts.gjs (separate template file)
<template>
  <h1>Posts</h1>
  <ul>
    {{#each @model as |post|}}
      <li>{{post.title}}</li>
    {{/each}}
  </ul>
</template>```

**Correct (co-located route template):**

```glimmer-js
// app/routes/posts.gjs
import Route from '@ember/routing/route';

export default class PostsRoute extends Route {
  model() {
    return this.store.request({ url: '/posts' });
  }

  <template>
    <h1>Posts</h1>
    <ul>
      {{#each @model as |post|}}
        <li>{{post.title}}</li>
      {{/each}}
    </ul>

    {{outlet}}
  </template>
}```

**With loading and error states:**

```glimmer-js
// app/routes/posts.gjs
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostsRoute extends Route {
  @service store;

  model() {
    return this.store.request({ url: '/posts' });
  }

  <template>
    <div class="posts-page">
      <h1>Posts</h1>

      {{#if @model}}
        <ul>
          {{#each @model as |post|}}
            <li>{{post.title}}</li>
          {{/each}}
        </ul>
      {{/if}}

      {{outlet}}
    </div>
  </template>
}```

**Template-only routes:**

```glimmer-js
// app/routes/about.gjs
<template>
  <div class="about-page">
    <h1>About Us</h1>
    <p>Welcome to our application!</p>
  </div>
</template>```

Co-located route templates keep route logic and presentation together, making the codebase easier to navigate and maintain.

Reference: [Ember Routes](https://guides.emberjs.com/release/routing/)
