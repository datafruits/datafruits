import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | blog post', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  skip('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:blog-post');
    assert.ok(adapter);
  });
});
