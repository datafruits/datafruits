import { module, test } from 'qunit';
import { ServiceContainer, container, service, BaseService } from '../../../framework/service.js';

module('Unit | Framework | service', function () {
  // ---------------------------------------------------------------------------
  // ServiceContainer
  // ---------------------------------------------------------------------------

  test('register and lookup return the same singleton', function (assert) {
    const sc = new ServiceContainer();
    let callCount = 0;
    sc.register('thing', () => {
      callCount++;
      return { name: 'thing' };
    });

    const a = sc.lookup('thing');
    const b = sc.lookup('thing');
    assert.strictEqual(a, b, 'same instance returned on each lookup');
    assert.strictEqual(callCount, 1, 'factory is only called once');
  });

  test('has() returns true for registered services', function (assert) {
    const sc = new ServiceContainer();
    sc.register('foo', () => ({}));
    assert.true(sc.has('foo'));
    assert.false(sc.has('bar'));
  });

  test('reset() forces re-creation of a service', function (assert) {
    const sc = new ServiceContainer();
    let n = 0;
    sc.register('counter', () => ({ id: ++n }));

    const first = sc.lookup('counter');
    sc.reset('counter');
    const second = sc.lookup('counter');

    assert.notStrictEqual(first, second, 'a new instance is created after reset');
    assert.strictEqual(first.id, 1);
    assert.strictEqual(second.id, 2);
  });

  test('clear() removes all registrations', function (assert) {
    const sc = new ServiceContainer();
    sc.register('alpha', () => ({}));
    sc.clear();
    assert.false(sc.has('alpha'), 'service is gone after clear');
  });

  test('lookup() throws for unregistered service', function (assert) {
    const sc = new ServiceContainer();
    assert.throws(
      () => sc.lookup('unknown'),
      /No service registered with name "unknown"/,
      'throws a descriptive error'
    );
  });

  // ---------------------------------------------------------------------------
  // BaseService
  // ---------------------------------------------------------------------------

  test('BaseService has a willDestroy hook', function (assert) {
    const svc = new BaseService();
    assert.ok(typeof svc.willDestroy === 'function', 'willDestroy is a function');
    assert.ok(() => svc.willDestroy(), 'willDestroy can be called without error');
  });

  // ---------------------------------------------------------------------------
  // @service decorator (uses global container)
  // ---------------------------------------------------------------------------

  test('@service decorator injects from the global container', function (assert) {
    // Use a fresh temporary container registration so we don't pollute global state
    const marker = { isMarker: true };
    container.register('__test_marker__', () => marker);

    class MyClass {
      @service('__test_marker__') declare dep: typeof marker;
    }

    const instance = new MyClass();
    assert.strictEqual(instance.dep, marker, '@service decorator injects the right value');

    container.reset('__test_marker__');
  });
});
