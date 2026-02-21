import { module, test } from 'qunit';
import { Router, setupRouter } from '../../../framework/router.js';

module('Unit | Framework | router', function () {
  // ---------------------------------------------------------------------------
  // match()
  // ---------------------------------------------------------------------------

  test('match() returns null for unknown paths', function (assert) {
    const router = new Router([{ name: 'home', path: '/' }]);
    assert.strictEqual(router.match('/does-not-exist'), null);
  });

  test('match() matches a static path', function (assert) {
    const router = new Router([
      { name: 'home', path: '/' },
      { name: 'about', path: '/about' },
    ]);
    const match = router.match('/about');
    assert.ok(match, 'match is found');
    assert.strictEqual(match.name, 'about', 'correct route name');
    assert.deepEqual(match.params, {}, 'no dynamic params');
  });

  test('match() extracts dynamic segments', function (assert) {
    const router = new Router([
      { name: 'shows.show', path: '/shows/:slug' },
    ]);
    const match = router.match('/shows/my-cool-show');
    assert.ok(match, 'match is found');
    assert.strictEqual(match.name, 'shows.show', 'correct route name');
    assert.strictEqual(match.params.slug, 'my-cool-show', 'slug param extracted');
  });

  test('match() extracts multiple dynamic segments', function (assert) {
    const router = new Router([
      { name: 'episode', path: '/shows/:showSlug/episodes/:episodeSlug' },
    ]);
    const match = router.match('/shows/my-show/episodes/episode-1');
    assert.ok(match, 'match is found');
    assert.strictEqual(match.params.showSlug, 'my-show');
    assert.strictEqual(match.params.episodeSlug, 'episode-1');
  });

  test('match() matches wildcard routes', function (assert) {
    const router = new Router([
      { name: 'not-found', path: '/*path' },
    ]);
    const match = router.match('/anything/goes/here');
    assert.ok(match, 'wildcard matches');
    assert.strictEqual(match.name, 'not-found');
  });

  test('match() matches nested routes', function (assert) {
    const router = new Router([
      {
        name: 'user',
        path: '/user',
        children: [
          { name: 'settings', path: '/settings' },
          { name: 'my-shows', path: '/my-shows' },
        ],
      },
    ]);
    const settingsMatch = router.match('/user/settings');
    assert.ok(settingsMatch, 'nested route matches');
    assert.strictEqual(settingsMatch.name, 'user.settings', 'full dotted name');

    const showsMatch = router.match('/user/my-shows');
    assert.ok(showsMatch);
    assert.strictEqual(showsMatch.name, 'user.my-shows');
  });

  // ---------------------------------------------------------------------------
  // urlFor()
  // ---------------------------------------------------------------------------

  test('urlFor() builds a URL for a named route', function (assert) {
    const router = new Router([
      { name: 'shows.show', path: '/shows/:slug' },
    ]);
    const url = router.urlFor('shows.show', { slug: 'test-show' });
    assert.ok(url.includes('/shows/test-show'), 'URL contains the interpolated slug');
  });

  test('urlFor() throws for unknown route', function (assert) {
    const router = new Router([{ name: 'home', path: '/' }]);
    assert.throws(
      () => router.urlFor('unknown-route'),
      /Unknown route/,
      'throws for unknown routes'
    );
  });

  // ---------------------------------------------------------------------------
  // setupRouter()
  // ---------------------------------------------------------------------------

  test('setupRouter() returns a Router instance', function (assert) {
    const router = setupRouter([{ name: 'home', path: '/' }]);
    assert.ok(router instanceof Router, 'returns a Router');
  });
});
