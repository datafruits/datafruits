import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/shows/episode', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:home/shows/episode');
    assert.ok(route);
  });

  test('afterModel sets fallback image and social meta tags', function (assert) {
    const route = this.owner.lookup('route:home/shows/episode') as any;
    const model = {
      title: 'The Records and Hotdog Program',
      description: 'Guestfruits episode',
      imageUrl: null,
      imageOrDefault: 'https://datafruits.fm/uploads/episode-fallback.png',
    };

    route.afterModel(model);

    assert.strictEqual(route.headData.title, 'datafruits.fm - The Records and Hotdog Program');
    assert.strictEqual(route.headData.description, model.description);
    assert.strictEqual(route.headData.image, model.imageOrDefault);

    const twitterCardTag = route.headTags.find((tag: any) => tag.attrs?.name === 'twitter:card');
    const twitterImageTag = route.headTags.find((tag: any) => tag.attrs?.name === 'twitter:image');
    const ogTitleTag = route.headTags.find((tag: any) => tag.attrs?.property === 'og:title');
    const ogDescriptionTag = route.headTags.find((tag: any) => tag.attrs?.property === 'og:description');
    const ogImageTag = route.headTags.find((tag: any) => tag.attrs?.property === 'og:image');

    assert.strictEqual(twitterCardTag?.attrs?.content, 'summary_large_image');
    assert.strictEqual(twitterImageTag?.attrs?.content, model.imageOrDefault);
    assert.strictEqual(ogTitleTag?.attrs?.content, 'datafruits.fm - The Records and Hotdog Program');
    assert.strictEqual(ogDescriptionTag?.attrs?.content, model.description);
    assert.strictEqual(ogImageTag?.attrs?.content, model.imageOrDefault);
  });
});
