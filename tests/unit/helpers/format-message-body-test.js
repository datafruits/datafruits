import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Unit | Helper | format message body', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    // Optionally seed the emojiZone service if needed
    let emojiZone = this.owner.lookup('service:emoji-zone');
    emojiZone.emojiMap.set('smile', { file: 'smile.png' });

    this.set('messageText', 'Hello :smile:');

    await render(hbs`{{format-message-body this.messageText}}`);

    assert.dom(this.element).hasText('Hello'); // or check that it renders the html output
  });
});