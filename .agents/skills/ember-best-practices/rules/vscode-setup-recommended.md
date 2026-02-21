---
title: VSCode Extensions and MCP Configuration for Ember Projects
category: tooling
impact: HIGH
---

## VSCode Extensions and MCP Configuration for Ember Projects

Set up recommended VSCode extensions and Model Context Protocol (MCP) servers for optimal Ember development experience.

**Incorrect (no extension recommendations):**

```json
{
  "recommendations": []
}
```

**Correct (recommended extensions for Ember):**

```json
{
  "recommendations": [
    "emberjs.vscode-ember",
    "vunguyentuan.vscode-glint",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

## Recommended VSCode Extensions

Create a `.vscode/extensions.json` file in your project root to recommend extensions to all team members:

```json
{
  "recommendations": [
    "emberjs.vscode-ember",
    "vunguyentuan.vscode-glint",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

### Core Ember Extensions

**ember-extension-pack** (or individual extensions):
- `emberjs.vscode-ember` - Ember.js language support
- Syntax highlighting for `.hbs`, `.gjs`, `.gts` files
- IntelliSense for Ember-specific patterns
- Code snippets for common Ember patterns

**Glint 2 Extension** (for TypeScript projects):
- `vunguyentuan.vscode-glint` - Type checking for Glimmer templates
- Real-time type errors in `.gts`/`.gjs` files
- Template-aware autocomplete
- Hover information for template helpers and components

Install instructions:
```bash
# Via command palette
# Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
# Type: "Extensions: Install Extensions"
# Search for "Ember" or "Glint"
```

## MCP (Model Context Protocol) Server Configuration

Configure MCP servers in `.vscode/settings.json` to integrate AI coding assistants with Ember-specific context:

```json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": false,
    "markdown": false
  },
  "mcp.servers": {
    "ember-mcp": {
      "command": "npx",
      "args": ["@ember/mcp-server"],
      "description": "Ember.js MCP Server - Provides Ember-specific context"
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-chrome-devtools"],
      "description": "Chrome DevTools MCP Server - Browser debugging integration"
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp-server"],
      "description": "Playwright MCP Server - Browser automation and testing"
    }
  }
}
```

### MCP Server Benefits

**Ember MCP Server** (`@ember/mcp-server`):
- Ember API documentation lookup
- Component and helper discovery
- Addon documentation integration
- Routing and data layer context

**Chrome DevTools MCP** (`@modelcontextprotocol/server-chrome-devtools`):
- Live browser inspection
- Console debugging assistance
- Network request analysis
- Performance profiling integration

**Playwright MCP** (optional, `@playwright/mcp-server`):
- Test generation assistance
- Browser automation context
- E2E testing patterns
- Debugging test failures

## Complete VSCode Settings Example

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  "[glimmer-js]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[glimmer-ts]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "files.associations": {
    "*.gjs": "glimmer-js",
    "*.gts": "glimmer-ts"
  },

  "glint.enabled": true,
  "glint.configPath": "./tsconfig.json",

  "github.copilot.enable": {
    "*": true
  },

  "mcp.servers": {
    "ember-mcp": {
      "command": "npx",
      "args": ["@ember/mcp-server"],
      "description": "Ember.js MCP Server"
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-chrome-devtools"],
      "description": "Chrome DevTools MCP Server"
    }
  }
}
```

## TypeScript Configuration (when using Glint)

Ensure your `tsconfig.json` has Glint configuration:

```json
{
  "compilerOptions": {
    // ... standard TS options
  },
  "glint": {
    "environment": [
      "ember-loose",
      "ember-template-imports"
    ]
  }
}
```

## Installation Steps

1. **Install extensions** (prompted automatically when opening project with `.vscode/extensions.json`)
2. **Install Glint** (if using TypeScript):
   ```bash
   npm install --save-dev @glint/core @glint/environment-ember-loose @glint/environment-ember-template-imports
   ```
3. **Configure MCP servers** in `.vscode/settings.json`
4. **Reload VSCode** to activate all extensions and MCP integrations

## Benefits

- **Consistent team setup**: All developers get same extensions
- **Type safety**: Glint provides template type checking
- **AI assistance**: MCP servers give AI tools Ember-specific context
- **Better DX**: Autocomplete, debugging, and testing integration
- **Reduced onboarding**: New team members get productive faster

## References

- [VSCode Ember Extension](https://marketplace.visualstudio.com/items?itemName=emberjs.vscode-ember)
- [Glint Documentation](https://typed-ember.gitbook.io/glint/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Ember Primitives VSCode Setup Example](https://github.com/universal-ember/ember-primitives/tree/main/.vscode)
