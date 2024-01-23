import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';

export default class HomeController extends Controller {
  @service
  intl;

  @service
  router;

  @service
  videoStream;

  @service
  session;

  @service
  currentUser;

  @service
  fastboot;

  @service
  chat;

  get locale() {
    return this.intl.locale;
  }

  @tracked menuOpen = false;
  @tracked submenuOpen = false;
  @tracked isShowingUserMenu = false;
  @tracked showingLoginModal = false;

  get showingPixi() {
    return ENV.environment === "test" ? false : true;
  }

  @action
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @action
  toggleSubMenu() {
    debounce(this, "toggleSubMenuOnce", 500, true);
  }

  toggleSubMenuOnce() {
    this.submenuOpen = !this.submenuOpen;
  }

  @action
  toggleUserMenu() {
    this.isShowingUserMenu = !this.isShowingUserMenu;
  }

  @action
  toggleLoginModal() {
    this.showingLoginModal = !this.showingLoginModal;
  }

  @action
  authenticate(nick, pass) {
    this.isAuthenticating = true;
    this.session.store.cookieExpirationTime = 60 * 60 * 24 * 14;
    return this.session
      .authenticate("authenticator:devise", nick, pass)
      .then(() => {
        const token = this.session.data.authenticated.token;
        this.currentUser.load().then(() => {
          const avatarUrl = this.currentUser.user.avatarUrl;
          const role = this.currentUser.user.role;
          const style = this.currentUser.user.style;
          const pronouns = this.currentUser.user.pronouns;
          this.chat.push("authorize_token", {
            user: nick,
            timestamp: Date.now(),
            token,
            avatarUrl,
            role,
            style,
            pronouns,
          });
          this.isAuthenticating = false;
          return true;
        });
      })
      .catch((/*reason*/) => {
        alert("Wrong password");
        this.isAuthenticating = false;
        return false;
      });
  }

  get aprilFools() {
    let today = new Date();
    return today.getMonth() === 3 && today.getDate() === 1;
  }
}
