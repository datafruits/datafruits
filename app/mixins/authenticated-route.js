import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

/**
 * Mixin for routes that require authentication.
 * Stores the intended route before requiring authentication,
 * so users can be redirected back after successful login.
 */
export default Mixin.create({
  session: service(),
  redirectAfterLogin: service(),

  /**
   * Override this method in routes that need authentication
   */
  beforeModel(transition) {
    if (!this.session.isAuthenticated) {
      this.redirectAfterLogin.storeIntendedRoute(transition);
    }
    this.session.requireAuthentication(transition, 'home.chat');
    return this._super(...arguments);
  }
});