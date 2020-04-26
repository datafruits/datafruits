import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | blog-post', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('post', { blogPostBodies: [] });

    await render(hbs`<BlogPost @post={{post}} />`);

    assert.dom(this.element).hasText('');
  });
});
