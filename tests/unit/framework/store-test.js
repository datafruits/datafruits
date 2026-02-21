import { module, test } from 'qunit';
import { Store } from '../../../framework/store.js';
import { Model, attr, registerModel } from '../../../framework/model.js';

// Register a simple model for testing
class Article extends Model {
  @attr() title = '';
  @attr() body = '';
}
registerModel('article', Article);
registerModel('articles', Article); // JSON:API type can be plural

module('Unit | Framework | store', function (hooks) {
  let store;

  hooks.beforeEach(function () {
    store = new Store({ host: 'https://api.test', getToken: () => null });
  });

  // ---------------------------------------------------------------------------
  // push
  // ---------------------------------------------------------------------------

  test('push() hydrates a single resource', function (assert) {
    const doc = {
      data: {
        id: '1',
        type: 'article',
        attributes: { title: 'Hello World', body: 'Lorem ipsum' },
      },
    };
    const record = store.push(doc);
    assert.ok(record instanceof Model, 'returns a Model instance');
    assert.strictEqual(record.id, '1', 'id is set');
    assert.strictEqual(record.title, 'Hello World', 'title attribute is set');
    assert.strictEqual(record.body, 'Lorem ipsum', 'body attribute is set');
  });

  test('push() hydrates an array of resources', function (assert) {
    const doc = {
      data: [
        { id: '10', type: 'article', attributes: { title: 'First' } },
        { id: '11', type: 'article', attributes: { title: 'Second' } },
      ],
    };
    const records = store.push(doc);
    assert.ok(Array.isArray(records), 'returns an array');
    assert.strictEqual(records.length, 2, 'returns two records');
    assert.strictEqual(records[0].title, 'First', 'first record title');
    assert.strictEqual(records[1].title, 'Second', 'second record title');
  });

  test('push() converts snake_case attribute keys to camelCase', function (assert) {
    const doc = {
      data: {
        id: '2',
        type: 'article',
        attributes: { title: 'CamelTest', created_at: '2024-01-01' },
      },
    };
    const record = store.push(doc);
    assert.strictEqual(record.createdAt, '2024-01-01', 'snake_case -> camelCase');
  });

  // ---------------------------------------------------------------------------
  // peekRecord / peekAll
  // ---------------------------------------------------------------------------

  test('peekRecord() returns a cached record', function (assert) {
    const doc = {
      data: { id: '5', type: 'article', attributes: { title: 'Cached' } },
    };
    store.push(doc);
    const peeked = store.peekRecord('article', '5');
    assert.ok(peeked, 'record is found in cache');
    assert.strictEqual(peeked.title, 'Cached', 'cached record has correct title');
  });

  test('peekRecord() returns null for missing record', function (assert) {
    const result = store.peekRecord('article', '999');
    assert.strictEqual(result, null, 'returns null for unknown id');
  });

  test('peekAll() returns all cached records of a type', function (assert) {
    const doc = {
      data: [
        { id: '20', type: 'article', attributes: { title: 'A' } },
        { id: '21', type: 'article', attributes: { title: 'B' } },
      ],
    };
    store.push(doc);
    const all = store.peekAll('article');
    assert.ok(all.length >= 2, 'at least two records are returned');
  });

  // ---------------------------------------------------------------------------
  // createRecord
  // ---------------------------------------------------------------------------

  test('createRecord() returns a new unsaved record', function (assert) {
    const record = store.createRecord('article', { title: 'New Article' });
    assert.ok(record instanceof Model, 'returns a Model instance');
    assert.strictEqual(record.id, null, 'new record has null id');
    assert.strictEqual(record.title, 'New Article', 'attributes are applied');
  });

  // ---------------------------------------------------------------------------
  // unloadAll
  // ---------------------------------------------------------------------------

  test('unloadAll() clears the cache for a type', function (assert) {
    const doc = {
      data: { id: '50', type: 'article', attributes: { title: 'To remove' } },
    };
    store.push(doc);
    store.unloadAll('article');
    const peeked = store.peekRecord('article', '50');
    assert.strictEqual(peeked, null, 'record is gone after unloadAll');
  });

  test('unloadAll() with no argument clears everything', function (assert) {
    const doc = {
      data: { id: '51', type: 'article', attributes: { title: 'Gone' } },
    };
    store.push(doc);
    store.unloadAll();
    const all = store.peekAll('article');
    assert.strictEqual(all.length, 0, 'all records are gone');
  });
});
