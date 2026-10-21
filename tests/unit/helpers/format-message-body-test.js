import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Unit | Helper | format message body', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    // Seed the unified emoji service
    let emojiService = this.owner.lookup('service:emoji');
    emojiService.emojiMap.set('smile', { 
      id: 'smile', 
      name: 'smile', 
      category: 'Smileys', 
      tags: [], 
      file: 'smile.png' 
    });

    this.set('messageText', 'Hello :smile:');

    await render(hbs`{{format-message-body this.messageText}}`);

    assert.dom(this.element).hasText('Hello');
  });
});