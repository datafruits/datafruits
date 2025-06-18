import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import ember from 'eslint-plugin-ember';
import qunit from 'eslint-plugin-qunit';
import n from 'eslint-plugin-n';
import globals from 'globals';

export default [

  // Base JS/TS/Ember setup
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          plugins: [['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]],
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      ember,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...ember.configs.recommended.rules,

      // your custom rules
      'ember/no-jquery': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-empty-function': 0,
      'prefer-rest-params': 0,
      'ember/no-empty-glimmer-component-classes': 'off',
    },
  },

  // Ember test overrides
  {
    files: ['tests/**/*-test.{js,ts}'],
    plugins: { qunit },
    rules: {
      ...qunit.configs.recommended.rules,
    },
  },

  // Node-specific config (scripts, config files)
  {
    files: [
      '.eslintrc.js',
      './.eslintrc.js',
      './.prettierrc.js',
      './.stylelintrc.js',
      './.template-lintrc.js',
      './ember-cli-build.js',
      './testem.js',
      './blueprints/*/index.js',
      './config/**/*.js',
      './lib/*/index.js',
      './server/**/*.js',
    ],
    languageOptions: {
      parserOptions: { sourceType: 'script' },
      globals: {
        ...globals.node,
      },
    },
    plugins: { n },
    rules: {
      ...n.configs.recommended.rules,
    },
  },

  // gts files (template-aware TypeScript)
  {
    files: ['**/*.gts'],
    languageOptions: {
      parser: 'ember-eslint-parser',
    },
    plugins: { ember },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...ember.configs.recommended.rules,
      ...ember.configs['recommended-gts'].rules,
    },
  },

  // gjs files (template-aware JS)
  {
    files: ['**/*.gjs'],
    languageOptions: {
      parser: 'ember-eslint-parser',
    },
    plugins: { ember },
    rules: {
      ...js.configs.recommended.rules,
      ...ember.configs.recommended.rules,
      ...ember.configs['recommended-gjs'].rules,
    },
  },

  // Shared rules for tests
  {
    files: ['tests/**/*.{js,ts,gjs,gts}'],
    rules: {
      'ember/no-replace-test-comments': 'error',
    },
  },

  // Shared overrides for .eslintignore behavior
  {
    ignores: ['dist/', 'node_modules/', 'tmp/'],
  },
];
