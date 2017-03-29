import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tweet-button', 'Integration | Component | tweet button', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set("text", "hey this is the tweet")
  window.twttr = { widgets: { load: function(){} } };

  this.render(hbs`{{tweet-button data-text=text}}`);

  assert.equal(this.$().text().trim(), 'Tweet');
});
