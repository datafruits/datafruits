/**
 * Application bootstrap helper for the datafruits custom framework.
 * Replaces @ember/application, ember-resolver, and ember-load-initializers.
 *
 * Creates the service container, registers core services, and starts the router.
 */

import { Store } from './store.js';
import { AuthService } from './auth.js';
import { Router, setupRouter, type RouteDefinition } from './router.js';
import { container } from './service.js';

export interface AppConfig {
  /** Base URL of the JSON:API backend, e.g. "https://api.datafruits.fm" */
  apiHost: string;

  /** URL of the Phoenix WebSocket server, e.g. "wss://api.datafruits.fm/socket" */
  socketUrl?: string;

  /** Route definitions for the client-side router */
  routes: RouteDefinition[];

  /** Root URL prefix (defaults to "/") */
  rootURL?: string;
}

export interface DatafruitsApp {
  container: typeof container;
  store: Store;
  auth: AuthService;
  router: Router;
  start(): void;
}

/**
 * Bootstrap the datafruits application.
 *
 * Call this once at the top level of your app entry point:
 *
 *   import { createApp } from 'framework';
 *   import { routes } from './router';
 *
 *   const app = createApp({
 *     apiHost: ENV.API_HOST,
 *     socketUrl: ENV.CHAT_SOCKET_URL,
 *     routes,
 *   });
 *
 *   app.start();
 */
export function createApp(config: AppConfig): DatafruitsApp {
  const { apiHost, routes, rootURL = '/' } = config;

  // Register the authentication service
  const auth = new AuthService({ apiHost });
  container.register('auth', () => auth);

  // Register the data store (shares auth token via the getToken callback)
  const store = new Store({
    host: apiHost,
    getToken: () => auth.token,
  });
  container.register('store', () => store);

  // Set up the router
  const router = setupRouter(routes, rootURL)!;

  return {
    container,
    store,
    auth,
    router,
    start() {
      router.start();
    },
  };
}
