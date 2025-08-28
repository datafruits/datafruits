import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RedirectAfterLoginService extends Service {
  @service router;
  
  @tracked intendedRoute = null;
  @tracked intendedRouteParams = null;
  @tracked intendedQueryParams = null;

  /**
   * Store the current route information for redirecting after login
   * @param {Transition} transition - The router transition object
   */
  storeIntendedRoute(transition) {
    if (transition) {
      this.intendedRoute = transition.to.name;
      this.intendedRouteParams = transition.to.params;
      this.intendedQueryParams = transition.to.queryParams;
    }
  }

  /**
   * Redirect to the stored intended route, or default route if none stored
   * @param {string} defaultRoute - Fallback route if no intended route is stored
   */
  redirectToIntended(defaultRoute = 'home.chat') {
    if (this.intendedRoute) {
      const route = this.intendedRoute;
      const params = this.intendedRouteParams;
      const queryParams = this.intendedQueryParams;
      
      // Clear stored route before redirecting
      this.clearIntendedRoute();
      
      this.router.transitionTo(route, params, { queryParams });
    } else {
      this.router.transitionTo(defaultRoute);
    }
  }

  /**
   * Clear the stored intended route
   */
  clearIntendedRoute() {
    this.intendedRoute = null;
    this.intendedRouteParams = null;
    this.intendedQueryParams = null;
  }

  /**
   * Check if there's an intended route stored
   */
  get hasIntendedRoute() {
    return !!this.intendedRoute;
  }
}