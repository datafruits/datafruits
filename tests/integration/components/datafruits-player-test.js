import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | datafruits player', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set("nextShow", { title: "vampire disco 3000" });

    await render(hbs`{{datafruits-player nextShow=nextShow}}`);

    assert.dom("#next-show").hasText('Next live on air: vampire disco 3000');
  });
});
