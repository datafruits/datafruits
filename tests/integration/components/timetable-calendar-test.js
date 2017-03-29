import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timetable-calendar', 'Integration | Component | timetable calendar', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(0);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{timetable-calendar}}`);

  //assert.equal(this.$().text().trim(), '');
});
