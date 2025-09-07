import Route from '@ember/routing/route';
import { service } from '@ember/service';
import fruitTypes from '../../fruit-types';
import fetch from 'fetch';
import ENV from 'datafruits13/config/environment';
import dayjs from 'dayjs';

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

  async model() {
    const fruitLabels = fruitTypes.map(fruit => fruit.name);
    const fruitCounts = fruitTypes.map(fruit => this.chat.getFruitCount(fruit.name) || 0);

    console.log(fruitCounts);

    // const start = dayjs(new Date()).startOf('month').subtract(12, 'month').format('YYYY-MM-DD');
    // const end = dayjs(new Date()).endOf('month').format('YYYY-MM-DD');

    try {
      // const response = await fetch(`${ENV.API_HOST}/api/admin/user_signups?start=${start}&end=${end}`, {
      const response = await fetch(`${ENV.API_HOST}/api/admin/user_signups`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.session.data.authenticated.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userSignups = await response.json();

      return {
        fruitsCount: {
          labels: fruitLabels,
          data: fruitCounts
        },
        userSignups: {
          labels: Object.keys(userSignups["user_signups"]),
          data: Object.values(userSignups["user_signups"]),
        }
      };

    } catch (error) {
      console.error('Failed to fetch data:', error);
      return { error: true };
    }
  }
}
