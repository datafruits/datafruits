import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import UserListItem from "../../../app/components/user-list-item.gjs";

module('Integration | Component | user list item', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('user', { metas: [{ avatarUrl: 'garfield.gif', username: 'garfield' }] });

    await render(<template><UserListItem @user={{self.user}} /></template>);

    assert.dom(this.element).hasText('garfield');
  });
});
