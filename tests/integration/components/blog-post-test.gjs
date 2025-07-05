import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import BlogPost from "../../../app/components/blog-post.gjs";

module('Integration | Component | blog-post', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  skip('it renders', async function (assert) {const self = this;

    this.set('post', { blogPostBodies: [] });

    await render(<template><BlogPost @post={{self.post}} /></template>);

    assert.dom(this.element).hasText('');
  });
});
