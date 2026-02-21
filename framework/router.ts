/**
 * Client-side router for the datafruits custom framework.
 * Replaces @ember/routing/router and EmberRouter.
 *
 * Uses the History API for clean URLs and supports nested routes,
 * dynamic segments, and wildcard routes.
 */

export interface RouteDefinition {
  /** URL pattern, e.g. "/shows/:slug" or "/blogs/*path" */
  path: string;
  /** Symbolic name used with `router.transitionTo('shows.show', { slug })` */
  name: string;
  /** Child routes (nested routes share a URL prefix from the parent). */
  children?: RouteDefinition[];
}

export interface RouteMatch {
  name: string;
  params: Record<string, string>;
  /** The matched URL path */
  path: string;
}

export type RouteChangeListener = (match: RouteMatch | null) => void;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface CompiledRoute {
  name: string;
  pattern: RegExp;
  paramNames: string[];
  template: string;
}

function compileRoute(
  name: string,
  path: string,
  prefix = ''
): CompiledRoute {
  const fullPath = `${prefix}${path}`.replace(/\/+/g, '/');
  const paramNames: string[] = [];

  const regexStr = fullPath
    .replace(/\*/g, '.*') // wildcard
    .replace(/:([^/]+)/g, (_m, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });

  const pattern = new RegExp(`^${regexStr}$`);
  return { name, pattern, paramNames, template: fullPath };
}

function flattenRoutes(
  routes: RouteDefinition[],
  prefix = '',
  parentName = ''
): CompiledRoute[] {
  const result: CompiledRoute[] = [];

  for (const route of routes) {
    const fullName = parentName ? `${parentName}.${route.name}` : route.name;
    const compiled = compileRoute(fullName, route.path, prefix);
    result.push(compiled);

    if (route.children?.length) {
      const childPrefix = `${prefix}${route.path}`.replace(/\/+/g, '/');
      result.push(...flattenRoutes(route.children, childPrefix, fullName));
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

/**
 * The datafruits client-side router.
 *
 * Usage:
 *   const router = new Router([
 *     { name: 'home', path: '/' },
 *     { name: 'shows', path: '/shows', children: [
 *       { name: 'show', path: '/:slug' },
 *     ]},
 *     { name: 'not-found', path: '/*path' },
 *   ]);
 *
 *   router.onChange((match) => {
 *     if (match) renderRoute(match.name, match.params);
 *   });
 *
 *   router.start();
 */
export class Router {
  private compiled: CompiledRoute[];
  private listeners = new Set<RouteChangeListener>();
  private currentMatch: RouteMatch | null = null;
  private rootURL: string;

  constructor(routes: RouteDefinition[], rootURL = '/') {
    this.rootURL = rootURL;
    this.compiled = flattenRoutes(routes);
  }

  // ---------------------------------------------------------------------------
  // Matching
  // ---------------------------------------------------------------------------

  /** Match a URL path against the registered routes. */
  match(urlPath: string): RouteMatch | null {
    const relative = urlPath.startsWith(this.rootURL)
      ? urlPath.slice(this.rootURL.length - 1) || '/'
      : urlPath;

    for (const route of this.compiled) {
      const m = route.pattern.exec(relative);
      if (m) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, i) => {
          params[name] = m[i + 1]!;
        });
        return { name: route.name, params, path: relative };
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Navigate to a named route, optionally with dynamic params and query params.
   *
   * router.transitionTo('shows.show', { slug: 'my-show' });
   */
  transitionTo(
    name: string,
    params: Record<string, string | number> = {},
    queryParams: Record<string, string> = {}
  ): void {
    const url = this.urlFor(name, params, queryParams);
    history.pushState({}, '', url);
    this._handleLocationChange();
  }

  /**
   * Replace the current history entry instead of pushing a new one.
   */
  replaceWith(
    name: string,
    params: Record<string, string | number> = {},
    queryParams: Record<string, string> = {}
  ): void {
    const url = this.urlFor(name, params, queryParams);
    history.replaceState({}, '', url);
    this._handleLocationChange();
  }

  /**
   * Build a URL for a named route without navigating.
   */
  urlFor(
    name: string,
    params: Record<string, string | number> = {},
    queryParams: Record<string, string> = {}
  ): string {
    const route = this.compiled.find((r) => r.name === name);
    if (!route) {
      throw new Error(`[datafruits/router] Unknown route "${name}"`);
    }

    let path = route.template;
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, encodeURIComponent(String(value)));
    }

    const qp = new URLSearchParams(queryParams);
    const qpString = qp.toString();
    return `${this.rootURL}${path.replace(/^\//, '')}${qpString ? `?${qpString}` : ''}`;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Start listening to browser navigation events.
   * Call this once after setting up route listeners.
   */
  start(): void {
    window.addEventListener('popstate', this._onPopState);
    this._handleLocationChange();
  }

  /**
   * Stop listening to browser navigation events.
   */
  stop(): void {
    window.removeEventListener('popstate', this._onPopState);
  }

  /** The currently active route match. */
  get currentRoute(): RouteMatch | null {
    return this.currentMatch;
  }

  // ---------------------------------------------------------------------------
  // Subscriptions
  // ---------------------------------------------------------------------------

  /**
   * Register a callback that is called whenever the active route changes.
   * Returns an unsubscribe function.
   */
  onChange(listener: RouteChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private _onPopState = (): void => {
    this._handleLocationChange();
  };

  private _handleLocationChange(): void {
    const path = window.location.pathname + window.location.search;
    const match = this.match(window.location.pathname);
    this.currentMatch = match;
    this.listeners.forEach((fn) => fn(match));
    void path; // suppress unused warning
  }
}

/**
 * The global application router instance.
 * Initialized by calling `setupRouter(routes)` during app bootstrap.
 */
export let router: Router | null = null;

/**
 * Initialize the global router with the application's route definitions.
 */
export function setupRouter(routes: RouteDefinition[], rootURL = '/'): Router {
  router = new Router(routes, rootURL);
  return router;
}
