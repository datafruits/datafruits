import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminRoute extends Route {
  @service session;
  @service currentUser;
  @service router;

  beforeModel(transition) {
    // First check if user is authenticated
    if (!this.session.isAuthenticated) {
      this.session.requireAuthentication(transition, 'home.login');
      return;
    }

    // Load current user if not already loaded
    return this.currentUser.load();
  }

  afterModel() {
    // Check if user has admin role
    if (!this.currentUser.user || !this.currentUser.user.roles.includes('admin')) {
      // Redirect non-admin users to home page
      this.router.transitionTo('home.index');
    }
  }

  model() {
    // For now, return fake data
    // Eventually this will come from /api/admin_stats.json
    return {
      fruitsCount: {
        labels: ['Apples', 'Bananas', 'Oranges', 'Grapes', 'Strawberries', 'Mangoes'],
        data: [45, 32, 28, 19, 38, 24]
      },
      userSignups: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12, 19, 15, 25, 22, 30]
      }
    };
  }
}