import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import BlogPostPreview from "../../../app/components/blog-post-preview.gjs";

module('Integration | Component | blog-post-preview', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  skip('it renders', async function (assert) {const self = this;

    this.set('post', { blogPostBodies: [] });

    await render(<template><BlogPostPreview @post={{self.post}} /></template>);

    assert.dom(this.element).hasText('');
  });
});
