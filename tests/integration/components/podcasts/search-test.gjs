import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import Search from "../../../../app/components/podcasts/search.js";

module('Integration | Component | podcasts/search', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.labels = [];

    await render(<template><Search @labels={{self.labels}} /></template>);

    assert.dom(this.element).hasText('Title Tag');
  });
});
