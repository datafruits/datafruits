import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | archives-card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.track = { title: 'shrimpshake 09202021' };
    this.image = 'cat.png';
    this.scheduledShow = { id: 2 };
    await render(
      hbs`<ArchivesCard @track={{this.track}} @image={{this.image}} @scheduledShow={{this.scheduledShow}} />`,
    );

    assert.dom(this.element).hasText('shrimpshake 09202021');
  });
});
