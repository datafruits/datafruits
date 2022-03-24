import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user list item', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('user', { metas: [{ avatarUrl: 'garfield.gif', username: 'garfield' }] });

    await render(hbs`<UserListItem @user={{user}} />`);

    assert.dom(this.element).hasText('garfield');
  });
});
