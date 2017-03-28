import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('chat-message', 'Integration | Component | chat message', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set("message", { body: "hey", user: "tony", timestamp: Date.parse("2017-03-27") });
  this.render(hbs`{{chat-message message=message}}`);

  assert.equal(this.$(".username").text().trim(), 'tony');
  assert.equal(this.$(".message-body").text().trim(), 'hey');
  //assert.equal(this.$(".message-timestamp").text().trim(), 'hey');
});

// test('it shows images if they are enabled', function(assert) {
// });
