import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import ENV from 'datafruits13/config/environment';

module('Unit | Adapter | gif', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:gif');
    assert.ok(adapter);
  });

  test('routes Gifcities searches to the proxy and encodes the search term', function (assert) {
    const adapter = this.owner.lookup('adapter:gif');
    const url = adapter.urlForQuery({ provider: 'gifcities', query: 'pizza & cats' });
    assert.strictEqual(url, `${ENV.GIFCITIES_HOST.replace(/\/$/, '')}/search?q=pizza%20%26%20cats`);
  });

  test('defaults to Giphy', function (assert) {
    const adapter = this.owner.lookup('adapter:gif');
    const url = new URL(adapter.urlForQuery({ query: 'pizza & cats' }));
    assert.strictEqual(url.origin, 'https://api.giphy.com');
    assert.strictEqual(url.searchParams.get('q'), 'pizza & cats');
  });
});
