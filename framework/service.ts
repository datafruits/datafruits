/**
 * Simple service container for the datafruits custom framework.
 * Replaces Ember's dependency injection system (@ember/service, inject as service).
 *
 * Services are singletons created lazily on first access.
 */

type ServiceFactory<T> = () => T;

/**
 * A lightweight container that manages singleton service instances.
 *
 * Usage:
 *   const container = new ServiceContainer();
 *   container.register('store', () => new Store(config));
 *   container.register('auth', () => new AuthService({ apiHost }));
 *
 *   const store = container.lookup<Store>('store');
 */
export class ServiceContainer {
  private factories = new Map<string, ServiceFactory<unknown>>();
  private instances = new Map<string, unknown>();

  /**
   * Register a factory function for a named service.
   * The factory is called lazily on first lookup.
   */
  register<T>(name: string, factory: ServiceFactory<T>): void {
    this.factories.set(name, factory as ServiceFactory<unknown>);
  }

  /**
   * Look up a service by name.
   * If the service has not been instantiated yet, the registered factory is called.
   */
  lookup<T>(name: string): T {
    if (!this.instances.has(name)) {
      const factory = this.factories.get(name);
      if (!factory) {
        throw new Error(
          `[datafruits/framework] No service registered with name "${name}". ` +
            `Did you forget to call container.register("${name}", ...)?`
        );
      }
      this.instances.set(name, factory());
    }
    return this.instances.get(name) as T;
  }

  /**
   * Check whether a service with the given name has been registered.
   */
  has(name: string): boolean {
    return this.factories.has(name);
  }

  /**
   * Remove a service instance from the container (forces re-creation on next lookup).
   */
  reset(name: string): void {
    this.instances.delete(name);
  }

  /**
   * Clear all registered services and instances.
   * Useful during testing.
   */
  clear(): void {
    this.factories.clear();
    this.instances.clear();
  }
}

/**
 * The global application service container.
 * Import and use this singleton throughout the app.
 */
export const container = new ServiceContainer();

/**
 * `service` decorator – injects a named service from the global container
 * as a lazily-evaluated class property.
 *
 * Usage:
 *   class MyComponent {
 *     @service('store') declare store: Store;
 *   }
 */
export function service(name: string): PropertyDecorator {
  return (target: object, key: string | symbol) => {
    Object.defineProperty(target, key, {
      get() {
        return container.lookup(name);
      },
      enumerable: true,
      configurable: true,
    });
  };
}

/**
 * Base class for all datafruits services.
 * Replaces `@ember/service` Service.
 *
 * Services are plain classes; use the `@service` decorator to inject other
 * services, and the `ServiceContainer` to register and look them up.
 */
export class BaseService {
  /** Called when the service is destroyed (e.g., on logout or app teardown). */
  willDestroy(): void {
    // Override in subclasses to clean up subscriptions, timers, etc.
  }
}
