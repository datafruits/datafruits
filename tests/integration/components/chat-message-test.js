import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | chat message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set("message", { body: "hey", user: "tony", timestamp: Date.parse("2017-03-27") });
    await render(hbs`{{chat-message message=message}}`);

    assert.dom(".username").hasText('tony');
    assert.dom(".message-body").hasText('hey');
    //assert.equal(this.$(".message-timestamp").text().trim(), 'hey');
  });

  // test('it shows images if they are enabled', function(assert) {
  // });
});
