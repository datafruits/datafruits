import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import ArchivesCard from "../../../app/components/archives-card.gjs";

module('Integration | Component | archives-card', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.track = { title: 'shrimpshake 09202021' };
    this.image = 'cat.png';
    this.scheduledShow = { id: 2 };
    await render(
      <template><ArchivesCard @track={{self.track}} @image={{self.image}} @scheduledShow={{self.scheduledShow}} /></template>,
    );

    assert.dom(this.element).hasText('shrimpshake 09202021');
  });
});
