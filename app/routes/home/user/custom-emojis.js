import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

function getEmojiOwnerId(emoji) {
  return String(emoji?.user?.id ?? emoji?.belongsTo?.('user')?.id?.() ?? '');
}

export default class UserCustomEmojisRoute extends Route {
  @service session;
  @service currentUser;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.login');
    await this.currentUser.load(true);
  }

  model() {
    const user = this.currentUser.user;
    const emojis = Array.from(user?.get('customEmojis') ?? []);
    const userId = String(user?.id ?? '');

    return {
      canUploadCustomEmojis: Boolean(user && user.level >= 3 && user.roles.includes('dj')),
      savedEmojis: emojis.filter((emoji) => getEmojiOwnerId(emoji) !== userId),
      uploadedEmojis: emojis.filter((emoji) => getEmojiOwnerId(emoji) === userId),
      emojiSlotsTotal: user?.emojiSlotsTotal ?? 0,
      emojiSlotsAvailable: user?.emojiSlotsAvailable ?? 0,
    };
  }
}
