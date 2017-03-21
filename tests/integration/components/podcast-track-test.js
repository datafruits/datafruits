import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('podcast-track', 'Integration | Component | podcast track', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('cdn_url', "http://cdn.dongles.net/track.mp3");
  this.set('title', "cool track");

  this.render(hbs`{{podcast-track cdn_url=cdn_url title=title}}`);

  assert.equal(this.$().text().trim(), '▶︎\n  \n  cool track');
});
