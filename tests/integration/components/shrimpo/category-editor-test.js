import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, focus, render, triggerEvent } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | shrimpo/category-editor', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en-us');

  test('typing keeps focus in saved and new category rows', async function (assert) {
    this.set('categories', [{ key: 'saved-1', id: '1', name: 'Tone', emoji: ':sshrimp:' }]);
    this.set('updateCategories', (categories) => this.set('categories', categories));

    await render(hbs`<Shrimpo::CategoryEditor
      @categories={{this.categories}}
      @onChange={{this.updateCategories}}
    />`);
    await click('fieldset > button');

    for (const [index, text] of ['Tone!', 'Groove'].entries()) {
      const input = find(`[data-test-voting-category]:nth-of-type(${index + 1}) input`);
      await focus(input);
      input.value = text;
      await triggerEvent(input, 'input');

      assert.strictEqual(document.activeElement, input, 'the input keeps focus after updating');
      assert.strictEqual(this.categories[index].name, text, 'the edit updates the draft');
    }
  });
});
