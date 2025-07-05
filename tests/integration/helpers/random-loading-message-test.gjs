import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import randomLoadingMessage from "../../../app/helpers/random-loading-message.js";

module('helper:random-loading-message', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function (assert) {
    await render(<template>{{randomLoadingMessage}}</template>);

    assert.ok(true);
  });
});
