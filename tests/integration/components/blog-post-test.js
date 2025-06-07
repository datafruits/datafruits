import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | blog-post', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  skip('it renders', async function (assert) {
    this.set('post', { blogPostBodies: [] });

    await render(hbs`<BlogPost @post={{this.post}} />`);

    assert.dom(this.element).hasText('');
  });
});
