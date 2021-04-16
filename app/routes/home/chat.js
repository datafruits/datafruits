import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';

export default class ChatRoute extends Route {
  @service session;

  @service currentUser;

  @service chat;

  _loadCurrentUser() {
    if (this.session.isAuthenticated) {
      return this.currentUser
        .load()
        .then(() => {
          const nick = this.currentUser.user.username;
          const token = this.session.data.authenticated.token;
          this.chat.push('authorize_token', { user: nick, timestamp: Date.now(), token: token });
        })
        .catch(() => this.session.invalidate());
    }
  }

  beforeModel() {
    return this._loadCurrentUser();
  }

  afterModel() {
    this.setHeadTags();
  }

  setHeadTags() {
    const headTags = ENV.headTags;
    this.set('headTags', Object.values(headTags));
  }
}
