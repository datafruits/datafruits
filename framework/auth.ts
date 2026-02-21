/**
 * Authentication service for the datafruits custom framework.
 * Replaces ember-simple-auth and the Devise authenticator.
 *
 * Handles sign-in, sign-out, and token persistence via localStorage.
 */

export interface AuthSession {
  token: string;
  id: string | number;
  email?: string;
}

export interface SignInCredentials {
  login: string;
  password: string;
}

export interface SignInResponse {
  data: {
    id: string;
    attributes: {
      email: string;
      authentication_token: string;
    };
  };
}

const SESSION_KEY = 'datafruits:session';

export type AuthChangeListener = (session: AuthSession | null) => void;

/**
 * Manages the user authentication session.
 *
 * Usage:
 *   const auth = new AuthService({ apiHost: 'https://api.datafruits.fm' });
 *   await auth.signIn({ login: 'user@example.com', password: 'secret' });
 *   auth.isAuthenticated; // true
 *   auth.session;         // { token, id, email }
 */
export class AuthService {
  private readonly apiHost: string;
  private _session: AuthSession | null = null;
  private _listeners = new Set<AuthChangeListener>();

  constructor({ apiHost }: { apiHost: string }) {
    this.apiHost = apiHost;
    this._restore();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  get isAuthenticated(): boolean {
    return this._session !== null;
  }

  /** The current session data, or null when not signed in. */
  get session(): AuthSession | null {
    return this._session;
  }

  /** The current auth token, or null when not signed in. */
  get token(): string | null {
    return this._session?.token ?? null;
  }

  /**
   * Sign in with email/username + password.
   * Persists the session to localStorage and notifies listeners.
   */
  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    const response = await fetch(`${this.apiHost}/users/sign_in.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          login: credentials.login,
          password: credentials.password,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AuthError(
        response.status,
        (errorData['error'] as string) ?? 'Sign in failed'
      );
    }

    const payload = (await response.json()) as SignInResponse;
    const session: AuthSession = {
      token: payload.data.attributes.authentication_token,
      id: payload.data.id,
      email: payload.data.attributes.email,
    };

    this._setSession(session);
    return session;
  }

  /**
   * Sign out the current user.
   * Clears the session from localStorage and notifies listeners.
   */
  async signOut(): Promise<void> {
    if (!this._session) return;

    try {
      await fetch(`${this.apiHost}/users/sign_out.json`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this._session.token}`,
        },
      });
    } catch {
      // Best-effort: clear local session even if the request fails.
    }

    this._clearSession();
  }

  /**
   * Register a callback that is invoked whenever the session changes.
   * Returns an unsubscribe function.
   */
  onChange(listener: AuthChangeListener): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  // ---------------------------------------------------------------------------
  // Password reset
  // ---------------------------------------------------------------------------

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${this.apiHost}/users/password.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email } }),
    });
    if (!response.ok) {
      throw new AuthError(response.status, 'Password reset request failed');
    }
  }

  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
    const response = await fetch(`${this.apiHost}/users/password.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          reset_password_token: token,
          password,
          password_confirmation: passwordConfirmation,
        },
      }),
    });
    if (!response.ok) {
      throw new AuthError(response.status, 'Password reset failed');
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private _restore(): void {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        this._session = JSON.parse(raw) as AuthSession;
      }
    } catch {
      this._session = null;
    }
  }

  private _setSession(session: AuthSession): void {
    this._session = session;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Storage might be unavailable in SSR / private browsing.
    }
    this._notify();
  }

  private _clearSession(): void {
    this._session = null;
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    this._notify();
  }

  private _notify(): void {
    this._listeners.forEach((fn) => fn(this._session));
  }
}

/**
 * Error thrown by AuthService on failed requests.
 */
export class AuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}
