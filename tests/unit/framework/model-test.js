import { module, test } from 'qunit';
import { Model, attr, belongsTo, hasMany, registerModel, lookupModel } from '../../../framework/model.js';

module('Unit | Framework | model', function () {
  test('Model base class has id and _type properties', function (assert) {
    const m = new Model();
    assert.strictEqual(m.id, null, 'id defaults to null');
    assert.strictEqual(m._type, '', '_type defaults to empty string');
  });

  test('attr decorator marks a property (no-op at runtime)', function (assert) {
    class User extends Model {
      @attr() username = '';
      @attr('string') email = '';
    }
    const u = new User();
    assert.ok('username' in u, 'username property exists');
    assert.ok('email' in u, 'email property exists');
  });

  test('hasMany decorator marks a property (no-op at runtime)', function (assert) {
    class ShowSeries extends Model {
      @hasMany('scheduled-show') episodes = [];
    }
    const s = new ShowSeries();
    assert.ok('episodes' in s, 'episodes property exists');
  });

  test('belongsTo decorator marks a property (no-op at runtime)', function (assert) {
    class Episode extends Model {
      @belongsTo('show-series') showSeries = null;
    }
    const e = new Episode();
    assert.ok('showSeries' in e, 'showSeries property exists');
  });

  test('registerModel and lookupModel', function (assert) {
    class TestModel extends Model {}
    registerModel('testModel', TestModel);
    const Cls = lookupModel('testModel');
    assert.strictEqual(Cls, TestModel, 'looks up the registered model class');
  });

  test('lookupModel returns null for unknown type', function (assert) {
    const Cls = lookupModel('nonExistentXyz123');
    assert.strictEqual(Cls, null, 'returns null for unknown type');
  });

  test('toJsonApi() serialises attributes', function (assert) {
    class Product extends Model {
      @attr() name = '';
      @attr() price = 0;
    }
    const p = new Product();
    p.id = 7;
    p._type = 'product';
    p.name = 'Widget';
    p.price = 9.99;

    const resource = p.toJsonApi();
    assert.strictEqual(resource.id, 7, 'id is serialised');
    assert.strictEqual(resource.type, 'product', 'type is serialised');
    assert.strictEqual(resource.attributes.name, 'Widget', 'name attribute');
    assert.strictEqual(resource.attributes.price, 9.99, 'price attribute');
  });
});
