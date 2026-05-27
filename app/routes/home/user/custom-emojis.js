import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserCustomEmojisRoute extends Route {
  @service session;
  @service currentUser;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.login');
    await this.currentUser.load(true);
  }

  model() {
    const user = this.currentUser.user;

    return {
      canUploadCustomEmojis: Boolean(user && user.level >= 3 && user.roles.includes('dj')),
      emojiSlotsTotal: user?.emojiSlotsTotal ?? 0,
      emojiSlotsAvailable: user?.emojiSlotsAvailable ?? 0,
    };
  }
}
