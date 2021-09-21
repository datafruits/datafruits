import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | show-card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    let start = new Date(2021, 9, 20, 19, 0, 0);
    this.show = { title: 'shrimpshake', start: start, thumbImageUrl: 'cat.png' };
    await render(hbs`<ShowCard @show={{this.show}} />`);

    assert.dom(this.element).includesText('shrimpshake 10-20-2021 Wednesday 19:00');
  });
});
