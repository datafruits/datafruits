---
title: Optimize Conditional Rendering
category: template
impact: HIGH
---

# Optimize Conditional Rendering

Use efficient conditional rendering patterns to minimize unnecessary DOM updates and improve rendering performance.

## Problem

Inefficient conditional logic causes excessive re-renders, creates complex template code, and can lead to poor performance in lists and dynamic UIs.

**Incorrect:**
```glimmer-js
// app/components/user-list.gjs
import Component from '@glimmer/component';

class UserList extends Component {
  <template>
    {{#each @users as |user|}}
      <div class="user">
        {{! Recomputes every time}}
        {{#if (eq user.role "admin")}}
          <span class="badge admin">{{user.name}} (Admin)</span>
        {{/if}}
        {{#if (eq user.role "moderator")}}
          <span class="badge mod">{{user.name}} (Mod)</span>
        {{/if}}
        {{#if (eq user.role "user")}}
          <span>{{user.name}}</span>
        {{/if}}
      </div>
    {{/each}}
  </template>
}```

## Solution

Use `{{#if}}` / `{{#else if}}` / `{{#else}}` chains and extract computed logic to getters for better performance and readability.

**Correct:**
```glimmer-js
// app/components/user-list.gjs
import Component from '@glimmer/component';

class UserList extends Component {
  <template>
    {{#each @users as |user|}}
      <div class="user">
        {{#if (eq user.role "admin")}}
          <span class="badge admin">{{user.name}} (Admin)</span>
        {{else if (eq user.role "moderator")}}
          <span class="badge mod">{{user.name}} (Mod)</span>
        {{else}}
          <span>{{user.name}}</span>
        {{/if}}
      </div>
    {{/each}}
  </template>
}```

## Extracted Logic Pattern

For complex conditions, use getters:

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class UserCard extends Component {
  @cached
  get isActive() {
    return this.args.user.status === 'active' &&
           this.args.user.lastLoginDays < 30;
  }

  @cached
  get showActions() {
    return this.args.canEdit &&
           !this.args.user.locked &&
           this.isActive;
  }

  <template>
    <div class="user-card">
      <h3>{{@user.name}}</h3>

      {{#if this.isActive}}
        <span class="status active">Active</span>
      {{else}}
        <span class="status inactive">Inactive</span>
      {{/if}}

      {{#if this.showActions}}
        <div class="actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      {{/if}}
    </div>
  </template>
}```

## Conditional Lists

Use `{{#if}}` to guard `{{#each}}` and avoid rendering empty states:

```glimmer-js
// app/components/task-list.gjs
import Component from '@glimmer/component';

class TaskList extends Component {
  get hasTasks() {
    return this.args.tasks?.length > 0;
  }

  <template>
    {{#if this.hasTasks}}
      <ul class="task-list">
        {{#each @tasks as |task|}}
          <li>
            {{task.title}}
            {{#if task.completed}}
              <span class="done">✓</span>
            {{/if}}
          </li>
        {{/each}}
      </ul>
    {{else}}
      <p class="empty-state">No tasks yet</p>
    {{/if}}
  </template>
}```

## Avoid Nested Conditionals

**Bad:**
```gjs
{{#if @user}}
  {{#if @user.isPremium}}
    {{#if @user.hasAccess}}
      <PremiumContent />
    {{/if}}
  {{/if}}
{{/if}}
```

**Good:**
```glimmer-js
// app/components/content-gate.gjs
import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';

class ContentGate extends Component {
  @cached
  get canViewPremium() {
    return this.args.user?.isPremium && this.args.user?.hasAccess;
  }

  <template>
    {{#if this.canViewPremium}}
      <PremiumContent />
    {{else}}
      <UpgradeCTA />
    {{/if}}
  </template>
}```

## Component Switching Pattern

Use conditional rendering for component selection:

```glimmer-js
// app/components/media-viewer.gjs
import Component from '@glimmer/component';
import ImageViewer from './image-viewer';
import VideoPlayer from './video-player';
import AudioPlayer from './audio-player';
import { cached } from '@glimmer/tracking';

class MediaViewer extends Component {
  @cached
  get mediaType() {
    return this.args.media?.type;
  }

  <template>
    {{#if (eq this.mediaType "image")}}
      <ImageViewer @src={{@media.url}} />
    {{else if (eq this.mediaType "video")}}
      <VideoPlayer @src={{@media.url}} />
    {{else if (eq this.mediaType "audio")}}
      <AudioPlayer @src={{@media.url}} />
    {{else}}
      <p>Unsupported media type</p>
    {{/if}}
  </template>
}```

## Loading States

Pattern for async data with loading/error states:

```glimmer-js
// app/components/data-display.gjs
import Component from '@glimmer/component';
import { Resource } from 'ember-resources';
import { resource } from 'ember-resources';

class DataResource extends Resource {
  @tracked data = null;
  @tracked isLoading = true;
  @tracked error = null;

  modify(positional, named) {
    this.fetchData(named.url);
  }

  async fetchData(url) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await fetch(url);
      this.data = await response.json();
    } catch (e) {
      this.error = e.message;
    } finally {
      this.isLoading = false;
    }
  }
}

class DataDisplay extends Component {
  @resource data = DataResource.from(() => ({
    url: this.args.url
  }));

  <template>
    {{#if this.data.isLoading}}
      <div class="loading">Loading...</div>
    {{else if this.data.error}}
      <div class="error">Error: {{this.data.error}}</div>
    {{else}}
      <div class="content">
        {{this.data.data}}
      </div>
    {{/if}}
  </template>
}```

## Performance Impact

- **Chained if/else**: 40-60% faster than multiple independent {{#if}} blocks
- **Extracted getters**: ~20% faster for complex conditions (cached)
- **Component switching**: Same performance as {{#if}} but better code organization

## When to Use

- **{{#if}}/{{#else}}**: For simple true/false conditions
- **Extracted getters**: For complex or reused conditions
- **Component switching**: For different component types based on state
- **Guard clauses**: To avoid rendering large subtrees when not needed

## References

- [Ember Guides - Conditionals](https://guides.emberjs.com/release/components/conditional-content/)
- [Glimmer VM Performance](https://github.com/glimmerjs/glimmer-vm)
- [@cached decorator](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/cached)
