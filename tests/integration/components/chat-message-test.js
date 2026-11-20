import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | chat message', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en-us');

  test('renders GIFs from a localhost proxy with a port', async function (assert) {
    const url = 'http://localhost:4000/images/SFMyNTY.signed-image.gif';
    this.set('message', { body: url, user: 'tony', timestamp: Date.parse('2017-03-27') });
    this.set('noop', () => {});

    await render(hbs`<ChatMessage @message={{this.message}} @setupAutoscroll={{this.noop}} @adjustScrolling={{this.noop}} @gifsEnabled={{true}} />`);

    assert.dom('img').hasAttribute('src', url);
    assert.dom('[data-test-message-body]').doesNotExist();
  });

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('message', { body: 'hey', user: 'tony', timestamp: Date.parse('2017-03-27') });
    const setupAutoscroll = function () {};
    this.set('setupAutoscroll', setupAutoscroll);
    const adjustScrolling = function () {};
    this.set('adjustScrolling', adjustScrolling);
    await render(hbs`{{chat-message message=this.message setupAutoscroll=this.setupAutoscroll adjustScrolling=this.adjustScrolling}}`);

    assert.dom('[data-test-username]').hasText('tony');
    assert.dom('[data-test-message-body]').hasText('hey');
  });

  // Deleted image renders by default test due to old observer code, "called set on destroyed object" and a 4+ year old lazy loading library
  skip('it shows images by default', async function (assert) {
    this.set('message', {
      body: 'hey a cat http://cat.com/cat.png',
      user: 'tony',
      timestamp: Date.parse('2017-03-27'),
    });
    const setupAutoscroll = function () {};
    this.set('setupAutoscroll', setupAutoscroll);
    const adjustScrolling = function () {};
    this.set('adjustScrolling', adjustScrolling);
    await render(hbs`{{chat-message message=message setupAutoscroll=setupAutoscroll adjustScrolling=adjustScrolling}}`);

    assert.dom('[data-test-username]').hasText('tony');
    assert.dom('[data-test-message-body]').hasText('hey a cat');
    assert.equal(this.element.querySelector('a').getAttribute('href'), 'http://cat.com/cat.png');
    assert.equal(this.element.querySelector('img').getAttribute('src'), 'http://cat.com/cat.png');
  });

  test('hides images if show images is false', async function (assert) {
    this.set('message', {
      body: 'hey a cat http://cat.com/cat.png',
      user: 'tony',
      timestamp: Date.parse('2017-03-27'),
    });
    const setupAutoscroll = function () {};
    this.set('setupAutoscroll', setupAutoscroll);
    const adjustScrolling = function () {};
    this.set('adjustScrolling', adjustScrolling);
    this.set('gifsEnabled', false);
    await render(
      hbs`{{chat-message message=this.message setupAutoscroll=this.setupAutoscroll adjustScrolling=this.adjustScrolling gifsEnabled=this.gifsEnabled}}`,
    );

    assert.dom('[data-test-username]').hasText('tony');
    assert.dom('[data-test-message-body]').hasText('hey a cat');
    assert.notOk(this.element.querySelector('img'));
  });
});
