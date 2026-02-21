/**
 * datafruits custom framework – main entry point.
 *
 * Import from this module to access all framework primitives:
 *
 *   import { Store, AuthService, Router, container, signal, tracked } from 'framework';
 *
 * This framework was created to replace Ember.js and Ember Data in the
 * datafruits frontend application.  It is intentionally minimal and
 * tailored to the specific needs of datafruits.fm.
 */

export * from './model.js';
export * from './api.js';
export * from './store.js';
export * from './auth.js';
export * from './service.js';
export * from './reactive.js';
export * from './router.js';
export * from './adapter.js';
export * from './normalizer.js';

// Re-export the application bootstrap helper
export { createApp } from './app.js';
