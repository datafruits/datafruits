import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | chat-lazy-image', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const adjustScrolling = function () {};
    this.set('adjustScrolling', adjustScrolling);

    await render(hbs`<ChatLazyImage @adjustScrolling={{this.adjustScrolling}} />`);

    assert.dom(this.element).hasText('');
  });
});
