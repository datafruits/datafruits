import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import eqNumber from "../../../app/helpers/eq-number.js";

module('Integration | Helper | eq-number', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {const self = this;

    this.set('inputValue', '1234');

    await render(<template>{{eqNumber self.inputValue 1234}}</template>);

    assert.dom(this.element).hasText('true');
  });
});
