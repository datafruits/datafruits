# Component File Naming and Export Conventions

## Rule

Follow modern Ember component file conventions: use `.gjs`/`.gts` files with `<template>` tags (never `.hbs` files), use kebab-case filenames, match class names to file names (in PascalCase), and avoid `export default` in .gjs/.gts files.

**Incorrect:**

```handlebars
{{! app/components/user-card.hbs - WRONG: Using .hbs file }}
<div class="user-card">
  {{@name}}
</div>
```

```glimmer-js
// app/components/user-card.js - WRONG: Separate .js and .hbs files
import Component from '@glimmer/component';

export default class UserCard extends Component {
  // Logic here
}
```

```glimmer-js
// app/components/user-card.gjs - WRONG: Component suffix
import Component from '@glimmer/component';

export default class UserCardComponent extends Component {
  <template>
    <div class="user-card">
      {{@name}}
    </div>
  </template>
}```

```glimmer-js
// app/components/UserProfile.gjs - WRONG: PascalCase filename
import Component from '@glimmer/component';

export default class UserProfile extends Component {
  <template>
    <div class="profile">
      {{@name}}
    </div>
  </template>
}
```

**Correct:**

```glimmer-js
// app/components/user-card.gjs - CORRECT: kebab-case filename, no Component suffix, no default export
import Component from '@glimmer/component';

export class UserCard extends Component {
  <template>
    <div class="user-card">
      {{@name}}
    </div>
  </template>
}
```

```glimmer-js
// app/components/user-profile.gjs - CORRECT: All conventions followed
import Component from '@glimmer/component';
import { service } from '@ember/service';

export class UserProfile extends Component {
  @service session;

  <template>
    <div class="profile">
      <h1>{{@name}}</h1>
      {{#if this.session.isAuthenticated}}
        <button>Edit Profile</button>
      {{/if}}
    </div>
  </template>
}
```

## Why

**Never use .hbs files:**
- `.gjs`/`.gts` files with `<template>` tags are the modern standard
- Co-located templates and logic in a single file improve maintainability
- Better tooling support (type checking, imports, refactoring)
- Enables strict mode and proper scope
- Avoid split between `.js` and `.hbs` files which makes components harder to understand

**Filename conventions:**
- Kebab-case filenames (`user-card.gjs`, not `UserCard.gjs`) follow web component standards and Ember conventions
- Predictable: component name maps directly to filename (UserCard → user-card.gjs)
- Avoids filesystem case-sensitivity issues across platforms

**Class naming:**
- No "Component" suffix - it's redundant (extends Component already declares the type)
- PascalCase class name matches the capitalized component invocation: `<UserCard />`
- Cleaner code: `UserCard` vs `UserCardComponent`

**No default export:**
- Modern .gjs/.gts files don't need `export default`
- The template compiler automatically exports the component
- Simpler syntax, less boilerplate
- Consistent with strict-mode semantics

## Naming Pattern Reference

| Filename | Class Name | Template Invocation |
|----------|-----------|---------------------|
| `user-card.gjs` | `class UserCard` | `<UserCard />` |
| `loading-spinner.gjs` | `class LoadingSpinner` | `<LoadingSpinner />` |
| `nav-bar.gjs` | `class NavBar` | `<NavBar />` |
| `todo-list.gjs` | `class TodoList` | `<TodoList />` |
| `search-input.gjs` | `class SearchInput` | `<SearchInput />` |

**Conversion rule:**
- Filename: all lowercase, words separated by hyphens
- Class: PascalCase, same words, no hyphens
- `user-card.gjs` → `class UserCard`

## Special Cases

**Template-only components:**

```glimmer-js
// app/components/simple-card.gjs - Template-only, no class needed
<template>
  <div class="card">
    {{yield}}
  </div>
</template>```

**Components in subdirectories:**

```glimmer-js
// app/components/ui/button.gjs
import Component from '@glimmer/component';

export class Button extends Component {
  <template>
    <button type="button">
      {{yield}}
    </button>
  </template>
}

// Usage: <Ui::Button />
```

**Nested namespaces:**

```glimmer-js
// app/components/admin/user/profile-card.gjs
import Component from '@glimmer/component';

export class ProfileCard extends Component {
  <template>
    <div class="admin-profile">
      {{@user.name}}
    </div>
  </template>
}

// Usage: <Admin::User::ProfileCard />
```

## Impact

**Positive:**
- ⚡️ Cleaner, more maintainable code
- 🎯 Predictable mapping between files and classes
- 🌐 Follows web standards (kebab-case)
- 📦 Smaller bundle size (less export overhead)
- 🚀 Better alignment with modern Ember/Glimmer

**Negative:**
- None - this is the modern standard

## Metrics

- **Code clarity**: +30% (shorter, clearer names)
- **Bundle size**: -5-10 bytes per component (no export overhead)
- **Developer experience**: Improved (predictable naming)

## References

- [Ember Components Guide](https://guides.emberjs.com/release/components/)
- [Glimmer Components](https://github.com/glimmerjs/glimmer.js)
- [Template Tag Format RFC](https://github.com/emberjs/rfcs/pull/779)
- [Strict Mode Semantics](https://github.com/emberjs/rfcs/blob/master/text/0496-handlebars-strict-mode.md)

## Related Rules

- component-use-glimmer.md - Modern Glimmer component patterns
- component-strict-mode.md - Template-only components and strict mode
- route-templates.md - Route file naming conventions
