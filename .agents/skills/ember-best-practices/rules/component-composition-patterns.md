---
title: Use Component Composition Patterns
impact: HIGH
impactDescription: Better code reuse and maintainability
tags: components, composition, yield, blocks, contextual-components
---

## Use Component Composition Patterns

Use component composition with yield blocks, named blocks, and contextual components for flexible, reusable UI patterns.

**Named blocks** are for invocation consistency in design systems where you **don't want the caller to have full markup control**. They provide structured extension points while maintaining design system constraints - the same concept as named slots in other frameworks.

**Incorrect (monolithic component):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

class UserCard extends Component {
  <template>
    <div class="user-card">
      <div class="header">
        <img src={{@user.avatar}} alt={{@user.name}} />
        <h3>{{@user.name}}</h3>
        <p>{{@user.email}}</p>
      </div>

      {{#if @showActions}}
        <div class="actions">
          <button {{on "click" @onEdit}}>Edit</button>
          <button {{on "click" @onDelete}}>Delete</button>
        </div>
      {{/if}}

      {{#if @showStats}}
        <div class="stats">
          <span>Posts: {{@user.postCount}}</span>
          <span>Followers: {{@user.followers}}</span>
        </div>
      {{/if}}
    </div>
  </template>
}```

**Correct (composable with named blocks):**

```glimmer-js
// app/components/user-card.gjs
import Component from '@glimmer/component';

class UserCard extends Component {
  <template>
    <div class="user-card" ...attributes>
      {{#if (has-block "header")}}
        {{yield to="header"}}
      {{else}}
        <div class="header">
          <img src={{@user.avatar}} alt={{@user.name}} />
          <h3>{{@user.name}}</h3>
        </div>
      {{/if}}

      {{yield @user to="default"}}

      {{#if (has-block "actions")}}
        <div class="actions">
          {{yield @user to="actions"}}
        </div>
      {{/if}}

      {{#if (has-block "footer")}}
        <div class="footer">
          {{yield @user to="footer"}}
        </div>
      {{/if}}
    </div>
  </template>
}```

**Usage with flexible composition:**

```glimmer-js
// app/components/user-list.gjs
import UserCard from './user-card';

<template>
  {{#each @users as |user|}}
    <UserCard @user={{user}}>
      <:header>
        <div class="custom-header">
          <span class="badge">{{user.role}}</span>
          <h3>{{user.name}}</h3>
        </div>
      </:header>

      <:default as |u|>
        <p class="bio">{{u.bio}}</p>
        <p class="email">{{u.email}}</p>
      </:default>

      <:actions as |u|>
        <button {{on "click" (fn @onEdit u)}}>Edit</button>
        <button {{on "click" (fn @onDelete u)}}>Delete</button>
      </:actions>

      <:footer as |u|>
        <div class="stats">
          Posts: {{u.postCount}} | Followers: {{u.followers}}
        </div>
      </:footer>
    </UserCard>
  {{/each}}
</template>```

**Contextual components pattern:**

```glimmer-js
// app/components/data-table.gjs
import Component from '@glimmer/component';
import { hash } from '@ember/helper';

class HeaderCell extends Component {
  <template>
    <th class="sortable" {{on "click" @onSort}}>
      {{yield}}
      {{#if @sorted}}
        <span class="sort-icon">{{if @ascending "↑" "↓"}}</span>
      {{/if}}
    </th>
  </template>
}

class Row extends Component {
  <template>
    <tr class={{if @selected "selected"}}>
      {{yield}}
    </tr>
  </template>
}

class Cell extends Component {
  <template>
    <td>{{yield}}</td>
  </template>
}

class DataTable extends Component {
  <template>
    <table class="data-table">
      {{yield (hash
        Header=HeaderCell
        Row=Row
        Cell=Cell
      )}}
    </table>
  </template>
}```

**Using contextual components:**

```glimmer-js
// app/components/users-table.gjs
import DataTable from './data-table';

<template>
  <DataTable as |Table|>
    <thead>
      <tr>
        <Table.Header @onSort={{fn @onSort "name"}}>Name</Table.Header>
        <Table.Header @onSort={{fn @onSort "email"}}>Email</Table.Header>
        <Table.Header @onSort={{fn @onSort "role"}}>Role</Table.Header>
      </tr>
    </thead>
    <tbody>
      {{#each @users as |user|}}
        <Table.Row @selected={{eq @selectedId user.id}}>
          <Table.Cell>{{user.name}}</Table.Cell>
          <Table.Cell>{{user.email}}</Table.Cell>
          <Table.Cell>{{user.role}}</Table.Cell>
        </Table.Row>
      {{/each}}
    </tbody>
  </DataTable>
</template>```

**Renderless component pattern:**

```glimmer-js
// app/components/dropdown.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash } from '@ember/helper';

class Dropdown extends Component {
  @tracked isOpen = false;

  @action
  toggle() {
    this.isOpen = !this.isOpen;
  }

  @action
  close() {
    this.isOpen = false;
  }

  <template>
    {{yield (hash
      isOpen=this.isOpen
      toggle=this.toggle
      close=this.close
    )}}
  </template>
}```

```glimmer-js
// Usage
import Dropdown from './dropdown';

<template>
  <Dropdown as |dd|>
    <button {{on "click" dd.toggle}}>
      Menu {{if dd.isOpen "▲" "▼"}}
    </button>

    {{#if dd.isOpen}}
      <ul class="dropdown-menu">
        <li><a href="#" {{on "click" dd.close}}>Profile</a></li>
        <li><a href="#" {{on "click" dd.close}}>Settings</a></li>
        <li><a href="#" {{on "click" dd.close}}>Logout</a></li>
      </ul>
    {{/if}}
  </Dropdown>
</template>```

Component composition provides flexibility, reusability, and clean separation of concerns while maintaining type safety and clarity.

Reference: [Ember Components - Block Parameters](https://guides.emberjs.com/release/components/block-content/)
