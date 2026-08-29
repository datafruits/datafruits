import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | simple-multi-select', function (hooks) {
  setupRenderingTest(hooks);

  test('it supports selecting multiple options', async function (assert) {
    this.set('selected', []);
    this.set('options', ['dj', 'vj']);
    this.set('onChange', (values) => this.set('selected', values));

    await render(hbs`<SimpleMultiSelect @options={{this.options}} @selected={{this.selected}} @onChange={{this.onChange}} />`);

    await click(findAll('[data-test-option]')[0]);
    await click(findAll('[data-test-option]')[1]);

    assert.deepEqual(this.selected, ['dj', 'vj']);
    assert.dom('[data-test-selected-option]').exists({ count: 2 });
  });

  test('it loads options from async search', async function (assert) {
    this.set('selected', []);
    this.set('options', []);
    this.set('search', async (term) => [`${term}-1`, `${term}-2`]);
    this.set('onChange', () => {});

    await render(hbs`<SimpleMultiSelect @options={{this.options}} @selected={{this.selected}} @search={{this.search}} @onChange={{this.onChange}} />`);

    await fillIn('[data-test-simple-multi-select-input]', 'pine');

    assert.dom('[data-test-option]').exists({ count: 2 });
    assert.dom(findAll('[data-test-option]')[0]).hasTextContaining('pine-1');
  });

  test('it adds created option returned from onCreate', async function (assert) {
    this.set('selected', []);
    this.set('options', []);
    this.set('onChange', (values) => this.set('selected', values));
    this.set('onCreate', (term) => term);

    await render(
      hbs`<SimpleMultiSelect @options={{this.options}} @selected={{this.selected}} @onChange={{this.onChange}} @onCreate={{this.onCreate}} />`
    );

    await fillIn('[data-test-simple-multi-select-input]', 'newtag');
    await click('[data-test-create-option]');

    assert.deepEqual(this.selected, ['newtag']);
  });
});
