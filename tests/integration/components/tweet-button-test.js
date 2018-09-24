import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | tweet button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set("text", "hey this is the tweet")
    window.twttr = { widgets: { load: function(){} } };

    await render(hbs`{{tweet-button data-text=text}}`);

    assert.dom('*').hasText('Tweet');
  });
});
