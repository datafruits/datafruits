/**
 * Reactive state primitives for the datafruits custom framework.
 * Replaces @glimmer/tracking.
 *
 * Provides a simple signal-based reactivity system using native browser
 * CustomEvents for change notification.
 */

type Listener = () => void;

const subscriptions = new WeakMap<object, Map<string | symbol, Set<Listener>>>();

function getListeners(target: object, key: string | symbol): Set<Listener> {
  if (!subscriptions.has(target)) {
    subscriptions.set(target, new Map());
  }
  const map = subscriptions.get(target)!;
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  return map.get(key)!;
}

/**
 * Subscribe to changes of a tracked property.
 */
export function subscribe(target: object, key: string | symbol, listener: Listener): () => void {
  const listeners = getListeners(target, key);
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Notify all subscribers of a tracked property change.
 */
export function notify(target: object, key: string | symbol): void {
  const listeners = getListeners(target, key);
  listeners.forEach((fn) => fn());
}

/**
 * `tracked` decorator – marks a class property as reactive.
 * When the property changes, all subscribers are notified.
 *
 * Usage:
 *   class MyService {
 *     @tracked count = 0;
 *   }
 */
export function tracked(target: object, key: string | symbol): void;
export function tracked<T>(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T>;
export function tracked(target: object, key: string | symbol, descriptor?: PropertyDescriptor): PropertyDescriptor | void {
  const storage = new WeakMap<object, unknown>();

  const getter = function (this: object) {
    return storage.get(this);
  };

  const setter = function (this: object, value: unknown) {
    storage.set(this, value);
    notify(this, key);
  };

  if (descriptor) {
    // Called as a property decorator (ES2022 with initializer)
    return {
      get: getter,
      set: setter,
      enumerable: descriptor.enumerable ?? true,
      configurable: true,
    };
  }

  // Legacy decorator (Babel stage-2)
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

/**
 * A simple reactive signal (standalone value).
 */
export class Signal<T> {
  private _value: T;
  private _listeners = new Set<Listener>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this._listeners.forEach((fn) => fn());
  }

  subscribe(listener: Listener): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }
}

/**
 * Create a reactive signal.
 */
export function signal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
}
