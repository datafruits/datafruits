/**
 * Session service – replaced ember-simple-auth with the custom AuthService.
 *
 * Exposes the same interface that existing code expects:
 *   - session.isAuthenticated
 *   - session.data.authenticated.token
 *   - session.data.authenticated.id
 *   - session.invalidate()
 *   - session.authenticate(credentials)
 */
import { BaseService, AuthService } from '../../framework/index.js';

export default class SessionService extends BaseService {
  constructor() {
    super();
    const apiHost = typeof window !== 'undefined'
      ? (window.__ENV?.API_HOST ?? '')
      : '';
    this._auth = new AuthService({ apiHost });
  }

  get isAuthenticated() {
    return this._auth.isAuthenticated;
  }

  get data() {
    const session = this._auth.session;
    return {
      authenticated: session ?? {},
    };
  }

  async authenticate(credentials) {
    return this._auth.signIn(credentials);
  }

  async invalidate() {
    return this._auth.signOut();
  }

  onChange(listener) {
    return this._auth.onChange(listener);
  }
}
