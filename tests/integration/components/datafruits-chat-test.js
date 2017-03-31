import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('datafruits-chat', 'Integration | Component | datafruits chat', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{datafruits-chat}}`);

  console.log("HEY");
  console.log(this.$().text().trim());
  assert.equal(this.$().text().trim(), 'Join chatroom');
});
