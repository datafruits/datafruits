import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

import { setupIntl } from 'ember-intl/test-support';

class MockCurrentUserService extends Service {
  user = {
    scheduledShowFavorites: [],
  };
}

class MockStoreService extends Service {
  queryResult = undefined;

  query() {
    if (this.queryResult !== undefined) {
      return this.queryResult;
    }
    return new Promise(() => {});
  }
}

module('Integration | Component | user-favorites', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  hooks.beforeEach(function () {
    this.owner.register('service:current-user', MockCurrentUserService);
    this.owner.register('service:store', MockStoreService);
  });

  test('it renders the loading state while the promise is pending', async function (assert) {
    await render(hbs`<UserFavorites />`);

    assert.dom('#podcast-search-loading').exists();
  });

  test('it renders an empty list when the promise resolves with no shows', async function (assert) {
    this.owner.lookup('service:store').queryResult = Promise.resolve([]);

    await render(hbs`<UserFavorites />`);

    assert.dom('#podcast-search-loading').doesNotExist();
  });

  test('it renders the error state when the promise rejects', async function (assert) {
    this.owner.lookup('service:store').queryResult = Promise.reject(new Error('fetch failed'));

    await render(hbs`<UserFavorites />`);

    assert.dom(this.element).includesText('error');
  });
});
