import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/show', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    var route = this.owner.lookup('route:home/show');
    assert.ok(route);
  });

  test('afterModel sets headData with thumbImageUrl when available', function (assert) {
    let route = this.owner.lookup('route:home/show');
    
    // Mock show model with both image URLs
    let mockModel = {
      title: 'Test Show',
      description: 'Test Description',
      imageUrl: 'https://example.com/full-image.jpg',
      thumbImageUrl: 'https://example.com/thumb-image.jpg'
    };

    route.afterModel(mockModel);

    assert.strictEqual(route.headData.title, 'datafruits.fm - Test Show');
    assert.strictEqual(route.headData.description, 'Test Description');
    assert.strictEqual(route.headData.image, 'https://example.com/thumb-image.jpg', 'Should prefer thumbImageUrl');
  });

  test('afterModel falls back to imageUrl when thumbImageUrl is not available', function (assert) {
    let route = this.owner.lookup('route:home/show');
    
    // Mock show model with only imageUrl
    let mockModel = {
      title: 'Test Show',
      description: 'Test Description',
      imageUrl: 'https://example.com/full-image.jpg',
      thumbImageUrl: null
    };

    route.afterModel(mockModel);

    assert.strictEqual(route.headData.image, 'https://example.com/full-image.jpg', 'Should fall back to imageUrl');
  });

  test('afterModel handles missing images gracefully', function (assert) {
    let route = this.owner.lookup('route:home/show');
    
    // Mock show model with no images
    let mockModel = {
      title: 'Test Show',
      description: 'Test Description',
      imageUrl: null,
      thumbImageUrl: null
    };

    route.afterModel(mockModel);

    assert.strictEqual(route.headData.image, null, 'Should handle missing images gracefully');
  });
});
