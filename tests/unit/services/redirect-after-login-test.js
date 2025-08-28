import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | redirect-after-login', function (hooks) {
  setupTest(hooks);

  test('it stores and retrieves intended route', function (assert) {
    let service = this.owner.lookup('service:redirect-after-login');
    
    const mockTransition = {
      to: {
        name: 'home.user.settings',
        params: { userId: '123' },
        queryParams: { tab: 'profile' }
      }
    };

    // Initially no intended route
    assert.false(service.hasIntendedRoute, 'No intended route initially');

    // Store a route
    service.storeIntendedRoute(mockTransition);
    
    assert.true(service.hasIntendedRoute, 'Has intended route after storing');
    assert.strictEqual(service.intendedRoute, 'home.user.settings', 'Route name stored correctly');
    assert.strictEqual(service.intendedRouteParams.userId, '123', 'Route params stored correctly');
    assert.strictEqual(service.intendedQueryParams.tab, 'profile', 'Query params stored correctly');

    // Clear the route
    service.clearIntendedRoute();
    
    assert.false(service.hasIntendedRoute, 'No intended route after clearing');
    assert.strictEqual(service.intendedRoute, null, 'Route name cleared');
    assert.strictEqual(service.intendedRouteParams, null, 'Route params cleared');
    assert.strictEqual(service.intendedQueryParams, null, 'Query params cleared');
  });

  test('it handles null transition gracefully', function (assert) {
    let service = this.owner.lookup('service:redirect-after-login');
    
    service.storeIntendedRoute(null);
    
    assert.false(service.hasIntendedRoute, 'No intended route when storing null transition');
  });
});