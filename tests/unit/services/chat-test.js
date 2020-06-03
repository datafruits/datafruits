import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import MockSocketService from '../../mocks/services/socket';

module('Unit | Service | chat', function (hooks) {
  setupTest(hooks);

  const setup = testContext => {
    testContext.owner.register('service:socket', MockSocketService);
    let chatService = testContext.owner.lookup('service:chat');
    let lobbyChannel = chatService.socket.socket.channels["rooms:lobby"];

    return {
      chatService, lobbyChannel
    }
  }

  test('it receives messages', function (assert) {
    let { chatService, lobbyChannel } = setup(this);

    for (let i = 0; i < 3; i++) {
      // dispatches the callback attached to first arg
      // the second arg is passed to the callback fn
      lobbyChannel.dispatch("new:msg", "test message number " + (i + 1))
    }

    assert.ok(chatService.messages.content.includes("test message number 1"));
    assert.ok(chatService.messages.content.includes("test message number 2"));
    assert.ok(chatService.messages.content.includes("test message number 3"));
    assert.notOk(chatService.messages.content.includes("This message was never sent"));
  });

  test('it lets you log in if you\'re cool', function (assert) {
     let { chatService, lobbyChannel } = setup(this);

    lobbyChannel.dispatch("authorized", { user: "daniel \"cool guy\" fridkin" });

    assert.equal(chatService.username, "daniel \"cool guy\" fridkin");
    assert.ok(chatService.joinedChat);

  });

  test('it doesn\'t let you log in if you\'re not cool', function (assert) {
     let { chatService, lobbyChannel } = setup(this);

    // Normally, this would result in a browser alert.
    // But testem literally does not allow you to do that.
    // So instead MockChannel calls the "new:msg" callback instead
    lobbyChannel.dispatch("notauthorized", { error: "you suck" });
    assert.ok(chatService.messages.content.includes("you suck"));

  });

  test('it notifies you when someone leaves chat', function (assert) {

     let { chatService, lobbyChannel } = setup(this);

    lobbyChannel.dispatch("user:left", { user: "lame_nerd23", timestamp: "before the party started" });
    assert.equal(chatService.messages.content
      .filter(t => t instanceof Object)
      .filter(t => (
        t.body &&
        t.timestamp === "before the party started" &&
        t.user === "lame_nerd23"
      ))
      .length, 1
    );

  });

  test('it forces the user out when banned', function (assert) {

    let { chatService, lobbyChannel } = setup(this);

    lobbyChannel.dispatch('disconnect', {});
    assert.notOk(chatService.joinedChat);

  });

  test('it syncs presense', function (assert) {

    let { chatService, lobbyChannel } = setup(this);

    const presenceState = {
      "swag man": "online",
      "activated cool": "online",
      "gotta blast": "online"
    };

    lobbyChannel.dispatch('presence_state', presenceState);
    assert.deepEqual(chatService.presences, presenceState);

  });

  // https://github.com/phoenixframework/phoenix/blob/master/assets/test/presence_test.js#L100
  // I copied this technique directly from phoenix's own tests.
  // I don't know if this is a decent way to test this.
  // I don't know why mock state was ok in the previous test, but fails here.
  // I don't understand why "joins" has to have this structure.
  test('it syncs presence diffs', function (assert) {

    let { chatService, lobbyChannel } = setup(this);

    let joins = {u1: {metas: [{id: 1, phx_ref: "1"}]}}

    lobbyChannel.dispatch('presence_diff', { joins: joins, leaves: {} });
    assert.deepEqual(chatService.presences, joins);

    lobbyChannel.dispatch('presence_diff', { joins: {}, leaves: joins });
    assert.deepEqual(chatService.presences, {});

  });

});
