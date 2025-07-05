import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import GiphySearch from "../../../app/components/giphy-search.gjs";

module('Integration | Component | giphy-search', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    this.set('sendGif', () => {});

    await render(<template><GiphySearch @sendGif={{self.sendGif}} /></template>);

    assert.ok(this.element);
  });
});
