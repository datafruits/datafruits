import { BaseService } from '../../framework/index.js';

/**
 * Simple publish/subscribe event bus.
 * Replaces Ember's Evented mixin.
 */
export default class EventBusService extends BaseService {
  constructor() {
    super();
    this._handlers = new Map();
  }

  publish(event, ...args) {
    const handlers = this._handlers.get(event);
    if (handlers) {
      handlers.forEach((fn) => fn(...args));
    }
  }

  subscribe(event, target, method) {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, new Set());
    }
    const fn = typeof method === 'function' ? method.bind(target) : target[method].bind(target);
    this._handlers.get(event).add(fn);
    // Store bound fn for unsubscribe lookup
    target._eventBusHandlers = target._eventBusHandlers ?? new Map();
    target._eventBusHandlers.set(`${event}:${method}`, fn);
  }

  unsubscribe(event, target, method) {
    const key = `${event}:${method}`;
    const fn = target._eventBusHandlers?.get(key);
    if (fn && this._handlers.has(event)) {
      this._handlers.get(event).delete(fn);
    }
  }

  // Alias for backwards compatibility
  trigger(event, ...args) {
    return this.publish(event, ...args);
  }
  on(event, target, method) {
    return this.subscribe(event, target, method);
  }
  off(event, target, method) {
    return this.unsubscribe(event, target, method);
  }
}
