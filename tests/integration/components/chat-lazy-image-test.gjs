import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import ChatLazyImage from "../../../app/components/chat-lazy-image.js";

module('Integration | Component | chat-lazy-image', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const adjustScrolling = function () {};
    this.set('adjustScrolling', adjustScrolling);

    await render(<template><ChatLazyImage @adjustScrolling={{self.adjustScrolling}} /></template>);

    assert.dom(this.element).hasText('');
  });
});
