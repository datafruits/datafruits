import Route from '@ember/routing/route';
import { service } from '@ember/service';
import fruitTypes from '../../fruit-types';

export default class AdminRoute extends Route {
  @service session;
  @service currentUser;
  @service router;
  @service chat;

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
    // Get the first 6 fruits for the chart (to keep it readable)
    const fruitsToShow = fruitTypes.slice(0, 6);
    const fruitLabels = fruitsToShow.map(fruit => fruit.name);
    const fruitCounts = fruitsToShow.map(fruit => this.chat.getFruitCount(fruit.name) || 0);

    return {
      fruitsCount: {
        labels: fruitLabels,
        data: fruitCounts
      },
      userSignups: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12, 19, 15, 25, 22, 30]
      }
    };
  }
}