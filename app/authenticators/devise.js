/**
 * Devise authenticator – replaced ember-simple-auth with the custom AuthService.
 *
 * This file is kept for compatibility with existing code that references the
 * 'authenticators/devise' name.  Authentication is now handled by the
 * SessionService which wraps AuthService from the custom framework.
 */
export default class DeviseAuthenticator {
  // Authentication is delegated to app/services/session.js -> framework/auth.ts
}
