/**
 * Session store – replaced ember-simple-auth's Cookie store.
 * Authentication state is now stored in localStorage via framework/auth.ts (AuthService).
 */
export default class ApplicationSessionStore {
  // Session persistence is handled by AuthService using localStorage.
  // This file is kept as a stub for compatibility.
}
