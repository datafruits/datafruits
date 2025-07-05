import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import ShowCard from "../../../embroider-pair-component/%2Fhome%2Ftony%2Fsrc%2Fdatafruits%2Fapp%2Ftemplates%2Fcomponents%2Fshow-card.gjs/__vpc__/%2Fhome%2Ftony%2Fsrc%2Fdatafruits%2Fapp%2Fcomponents%2Fshow-card.gts";

module('Integration | Component | show-card', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    let start = new Date(2021, 9, 20, 19, 0, 0);
    this.show = { title: 'shrimpshake', start: start, thumbImageUrl: 'cat.png' };
    await render(<template><ShowCard @showSeries={{self.show}} /></template>);

    assert.dom(this.element).includesText('shrimpshake');
  });
});
