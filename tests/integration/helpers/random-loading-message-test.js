
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('random-loading-message', 'helper:random-loading-message', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{random-loading-message inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

