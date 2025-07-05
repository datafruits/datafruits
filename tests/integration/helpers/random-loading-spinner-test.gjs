import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import randomLoadingSpinner from "../../../app/helpers/random-loading-spinner.js";

module('helper:random-loading-spinner', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function (assert) {
    await render(<template>{{randomLoadingSpinner}}</template>);

    assert.ok(true);
  });
});
