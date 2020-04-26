import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | chat message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set("message", { body: "hey", user: "tony", timestamp: Date.parse("2017-03-27") });
    const setupAutoscroll = function(){};
    this.set ("setupAutoscroll", setupAutoscroll);
    const adjustScrolling = function(){};
    this.set ("adjustScrolling", adjustScrolling);
    await render(hbs`{{chat-message message=message setupAutoscroll=setupAutoscroll adjustScrolling=adjustScrolling}}`);

    assert.dom(".username").hasText('tony');
    assert.dom(".message-body").hasText('hey');
  });

  // Deleted image renders by default test due to old observer code, "called set on destroyed object" and a 4+ year old lazy loading library
  skip('it shows images by default', async function(assert) {
    this.set("message", { body: "hey a cat http://cat.com/cat.png", user: "tony", timestamp: Date.parse("2017-03-27") });
    const setupAutoscroll = function(){};
    this.set ("setupAutoscroll", setupAutoscroll);
    const adjustScrolling = function(){};
    this.set ("adjustScrolling", adjustScrolling);
    await render(hbs`{{chat-message message=message setupAutoscroll=setupAutoscroll adjustScrolling=adjustScrolling}}`);

    assert.dom(".username").hasText('tony');
    assert.dom(".message-body").hasText('hey a cat http://cat.com/cat.png');
    assert.equal(this.element.querySelector('a').getAttribute('href'), 'http://cat.com/cat.png');
    assert.equal(this.element.querySelector('img').getAttribute('src'), 'http://cat.com/cat.png');
  });

  test('hides images if show images is false', async function(assert) {
    this.set("message", { body: "hey a cat http://cat.com/cat.png", user: "tony", timestamp: Date.parse("2017-03-27") });
    const setupAutoscroll = function(){};
    this.set ("setupAutoscroll", setupAutoscroll);
    const adjustScrolling = function(){};
    this.set ("adjustScrolling", adjustScrolling);
    this.set('gifsEnabled', false)
    await render(hbs`{{chat-message message=message setupAutoscroll=setupAutoscroll adjustScrolling=adjustScrolling gifsEnabled=gifsEnabled}}`);

    assert.dom(".username").hasText('tony');
    assert.dom(".message-body").hasText('hey a cat http://cat.com/cat.png');
    assert.equal(this.element.querySelector('a').getAttribute('href'), 'http://cat.com/cat.png');
    assert.notOk(this.element.querySelector('img'));
  });
});
