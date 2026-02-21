import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import MockSocketService from '../../mocks/services/socket';
import Service from '@ember/service';

module('Unit | Service | chat', function (hooks) {
  setupTest(hooks);

  const setup = (testContext, currentUserOverrides = {}) => {
    testContext.owner.register('service:socket', MockSocketService);

    const mockUser = Object.assign({ fruitTicketBalance: 10 }, currentUserOverrides.user);
    let loadCallCount = 0;
    const MockCurrentUserService = class extends Service {
      user = mockUser;
      load() { loadCallCount++; return Promise.resolve(); }
    };
    testContext.owner.register('service:current-user', MockCurrentUserService);

    let chatService = testContext.owner.lookup('service:chat');
    let lobbyChannel = chatService.socket.socket.channels['rooms:lobby'];

    return {
      chatService,
      lobbyChannel,
      get loadCallCount() { return loadCallCount; },
      mockUser,
    };
  };

  const setupWithUsername = (testContext, username, currentUserOverrides = {}) => {
    const result = setup(testContext, currentUserOverrides);
    result.chatService.username = username;
    return result;
  };

  test('it receives messages', function (assert) {
    let { chatService, lobbyChannel } = setup(this);

    for (let i = 0; i < 3; i++) {
      // dispatches the callback attached to first arg
      // the second arg is passed to the callback fn
      lobbyChannel.dispatch('new:msg', 'test message number ' + (i + 1));
    }

    assert.ok(chatService.messages.includes('test message number 1'));
    assert.ok(chatService.messages.includes('test message number 2'));
    assert.ok(chatService.messages.includes('test message number 3'));
    assert.notOk(chatService.messages.includes('This message was never sent'));
  });

  test("it lets you log in if you're cool", function (assert) {
    let { chatService, lobbyChannel } = setup(this);

    lobbyChannel.dispatch('authorized', { user: 'cassandra is cool B)' });

    assert.equal(chatService.username, 'cassandra is cool B)');
    assert.ok(chatService.joinedChat);
  });

  test("it doesn't let you log in", function (assert) {
    let { chatService, lobbyChannel } = setup(this);

    // Normally, this would result in a browser alert.
    // But testem literally does not allow you to do that.
    // So instead MockChannel calls the "new:msg" callback instead
    lobbyChannel.dispatch('notauthorized', { error: 'you suck' });
    assert.ok(chatService.messages.includes('you suck'));
  });

  test('it forces the user out when banned', function (assert) {
    let { chatService, lobbyChannel } = setup(this);

    lobbyChannel.dispatch('disconnect', {});
    assert.notOk(chatService.joinedChat);
  });

  test('it syncs presense', function (assert) {
    let { chatService, lobbyChannel } = setup(this);

    const presenceState = {
      'swag man': 'online',
      'activated cool': 'online',
      'gotta blast': 'online',
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

    let joins = { u1: { metas: [{ id: 1, phx_ref: '1' }] } };

    lobbyChannel.dispatch('presence_diff', { joins: joins, leaves: {} });
    assert.deepEqual(chatService.presences, joins);

    lobbyChannel.dispatch('presence_diff', { joins: {}, leaves: joins });
    assert.deepEqual(chatService.presences, {});
  });

  test('treasure:received increments fruitTicketBalance optimistically for current user', function (assert) {
    let { chatService, lobbyChannel, mockUser } = setupWithUsername(this, 'testuser');

    lobbyChannel.dispatch('treasure:received', {
      user: 'testuser',
      uuid: null,
      treasure: 'fruit_tickets',
      amount: 5,
    });

    assert.equal(mockUser.fruitTicketBalance, 15, 'balance incremented by amount');
  });

  test('treasure:received reloads currentUser after fruit_tickets received', function (assert) {
    let { lobbyChannel, loadCallCount } = setupWithUsername(this, 'testuser');

    lobbyChannel.dispatch('treasure:received', {
      user: 'testuser',
      uuid: null,
      treasure: 'fruit_tickets',
      amount: 5,
    });

    assert.equal(loadCallCount, 1, 'currentUser.load was called once');
  });

  test('treasure:received does not update balance for other users', function (assert) {
    let { lobbyChannel, mockUser } = setupWithUsername(this, 'testuser');

    lobbyChannel.dispatch('treasure:received', {
      user: 'otheruser',
      uuid: null,
      treasure: 'fruit_tickets',
      amount: 5,
    });

    assert.equal(mockUser.fruitTicketBalance, 10, 'balance unchanged for other user');
  });

  test('treasure:received does not update balance for non-fruit_tickets treasure', function (assert) {
    let { lobbyChannel, mockUser } = setupWithUsername(this, 'testuser');

    lobbyChannel.dispatch('treasure:received', {
      user: 'testuser',
      uuid: null,
      treasure: 'xp_boost',
      amount: 5,
    });

    assert.equal(mockUser.fruitTicketBalance, 10, 'balance unchanged for non-fruit_tickets treasure');
  });

  test('treasure:received handles missing amount gracefully', function (assert) {
    let { lobbyChannel, mockUser } = setupWithUsername(this, 'testuser');

    lobbyChannel.dispatch('treasure:received', {
      user: 'testuser',
      uuid: null,
      treasure: 'fruit_tickets',
      // amount is missing
    });

    assert.equal(mockUser.fruitTicketBalance, 10, 'balance unchanged when amount is missing');
  });
});
