# Authentication Redirect Implementation

This document describes the implementation of redirect-after-login functionality for the Datafruits application.

## Problem

Previously, when users tried to access protected routes and were prompted to login, after successful authentication they would be redirected to the chat page regardless of where they originally intended to go.

## Solution

### Components Added/Modified:

1. **`app/services/redirect-after-login.js`** - New service that manages storing and retrieving intended routes
2. **`app/mixins/authenticated-route.js`** - New mixin to simplify adding authentication requirements to routes
3. **`app/controllers/home.js`** - Modified to use the redirect service after successful authentication
4. **Protected Routes** - Updated to store intended destination before requiring authentication

### How it Works:

1. **Route Access**: When a user tries to access a protected route (e.g., `/user/settings`), the route's `beforeModel` hook checks if they're authenticated.

2. **Store Intended Route**: If not authenticated, the route stores the intended destination using `redirectAfterLogin.storeIntendedRoute(transition)`.

3. **Require Authentication**: The route then calls `session.requireAuthentication()` which triggers the login modal.

4. **Login Success**: After successful authentication, the `authenticate` action in the `HomeController` calls `redirectAfterLogin.redirectToIntended()`.

5. **Redirect**: The user is redirected to their originally intended destination, or falls back to the chat page if no destination was stored.

### Usage Examples:

#### For new protected routes:
```javascript
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'datafruits13/mixins/authenticated-route';

export default class MyProtectedRoute extends Route.extend(AuthenticatedRouteMixin) {
  // Your route logic here
}
```

#### Manual implementation (if mixin isn't suitable):
```javascript
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyRoute extends Route {
  @service session;
  @service redirectAfterLogin;

  beforeModel(transition) {
    if (!this.session.isAuthenticated) {
      this.redirectAfterLogin.storeIntendedRoute(transition);
    }
    this.session.requireAuthentication(transition, 'home.chat');
  }
}
```

### Routes Updated:

- `home.user.settings`
- `home.user.notifications`
- `home.user.studio`
- `home.user.my-shows`
- `home.user.my-shows.new`
- `home.user.my-shows.edit`
- `home.user.my-shows.episodes`
- `home.user.my-shows.episode`
- `home.forum.new`
- `home.wiki.new`
- `home.wiki.edit`

## Testing

Unit tests have been added for the `redirect-after-login` service to ensure proper storage and retrieval of intended routes.

## Benefits

- Improved user experience: users land where they intended to go after logging in
- Consistent behavior across all protected routes
- Reusable mixin for easy implementation on new protected routes
- Fallback to chat route maintains existing behavior when no intended route is stored