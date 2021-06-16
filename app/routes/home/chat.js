import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';

export default class ChatRoute extends Route {
  @service session;

  @service currentUser;

  @service chat;

  _loadCurrentUser() {
    console.log('in _loadCurrentUser in chat');
    if (this.session.isAuthenticated) {
      console.log('session is authenticated');
      return this.currentUser
        .load()
        .then(() => {
          const nick = this.currentUser.user.username;
          const avatarUrl = this.currentUser.user.avatarUrl;
          const token = this.session.data.authenticated.token;
          this.chat.push('authorize_token', { user: nick, timestamp: Date.now(), token: token, avatarUrl: avatarUrl });
        })
        .catch(() => {
          console.log("couldn't load this.currentUser in chat _loadCurrentUser, invalidating session");
          this.session.invalidate();
        });
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
