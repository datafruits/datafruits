import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('datafruits-player', 'Integration | Component | datafruits player', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set("nextShow", { title: "vampire disco 3000" });

  this.render(hbs`{{datafruits-player nextShow=nextShow}}`);

  assert.equal(this.$("#next-show").text().trim(), "Next live on air: vampire disco 3000");
});
