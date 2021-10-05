import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

const chatStub = class ChatStub extends Service {};

module('Integration | Component | datafruits chat', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:chat', chatStub);
  });

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`<DatafruitsChat />`);

    assert.true(this.element.textContent.trim().includes('Join chat'));
    assert.true(this.element.textContent.trim().includes('Images are off'));
    assert.true(this.element.textContent.trim().includes('Login'));
    assert.dom('[data-test-join-chat]').isDisabled();
  });

  test('it has offline message', async function (assert) {
    this.set('networkStatus', {});
    this.set('networkStatus.isOffline', true);
    await render(hbs`<DatafruitsChat @networkStatus={{this.networkStatus}} />`);

    assert.true(
      this.element.textContent
        .trim()
        .includes("You appear to be offline. I guess you won't be able to chat. Musta been the onion salad dressing"),
    );
  });
});
