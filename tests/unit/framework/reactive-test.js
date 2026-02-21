import { module, test } from 'qunit';
import { Signal, signal, tracked, notify, subscribe } from '../../../framework/reactive.js';

module('Unit | Framework | reactive', function () {
  // ---------------------------------------------------------------------------
  // Signal
  // ---------------------------------------------------------------------------

  test('Signal holds an initial value', function (assert) {
    const s = new Signal(42);
    assert.strictEqual(s.value, 42, 'initial value is correct');
  });

  test('Signal notifies subscribers on change', function (assert) {
    assert.expect(2);
    const s = new Signal('hello');
    s.subscribe(() => {
      assert.ok(true, 'subscriber is called');
      assert.strictEqual(s.value, 'world', 'new value is visible inside subscriber');
    });
    s.value = 'world';
  });

  test('signal() factory returns a Signal', function (assert) {
    const s = signal('initial');
    assert.ok(s instanceof Signal, 'is a Signal');
    assert.strictEqual(s.value, 'initial', 'value is set');
  });

  test('Signal unsubscribe stops notifications', function (assert) {
    assert.expect(1); // only one notification, not two
    const s = signal(0);
    let callCount = 0;
    const unsub = s.subscribe(() => callCount++);
    s.value = 1; // notified
    unsub();
    s.value = 2; // NOT notified
    assert.strictEqual(callCount, 1, 'subscriber is only called once');
  });

  // ---------------------------------------------------------------------------
  // tracked decorator + subscribe/notify
  // ---------------------------------------------------------------------------

  test('@tracked getter/setter round-trips correctly', function (assert) {
    class Counter {
      @tracked count = 0;
    }
    const c = new Counter();
    c.count = 5;
    assert.strictEqual(c.count, 5, 'value is stored and retrieved');
  });

  test('@tracked notifies via subscribe()', function (assert) {
    assert.expect(1);
    class Counter {
      @tracked count = 0;
    }
    const c = new Counter();
    subscribe(c, 'count', () => {
      assert.ok(true, 'subscriber is invoked on change');
    });
    c.count = 1;
  });

  test('subscribe() returns an unsubscribe function', function (assert) {
    assert.expect(0); // no calls expected after unsubscribe
    class Box {
      @tracked value = '';
    }
    const b = new Box();
    const unsub = subscribe(b, 'value', () => {
      assert.ok(false, 'should not be called after unsubscribe');
    });
    unsub();
    b.value = 'changed';
  });

  test('notify() manually triggers subscribers', function (assert) {
    assert.expect(1);
    class Foo {}
    const foo = new Foo();
    subscribe(foo, 'bar', () => {
      assert.ok(true, 'subscriber triggered by manual notify');
    });
    notify(foo, 'bar');
  });
});
