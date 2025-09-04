import Route from '@ember/routing/route';
import { service } from '@ember/service';
import fruitTypes from '../../fruit-types';
import dayjs from 'dayjs';

export default class AdminRoute extends Route {
  @service session;
  @service currentUser;
  @service router;
  @service chat;
  @service store;

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
    // Get the first 6 fruits for the chart (to keep it readable)
    const fruitsToShow = fruitTypes.slice(0, 6);
    const fruitLabels = fruitsToShow.map(fruit => fruit.name);
    const fruitCounts = fruitsToShow.map(fruit => this.chat.getFruitCount(fruit.name) || 0);

    // Calculate last 12 months date range
    const endDate = dayjs();
    const startDate = dayjs().subtract(12, 'months');

    console.log('Admin route: Fetching user signups for date range:', {
      start: startDate.format('YYYY-MM-DD'),
      end: endDate.format('YYYY-MM-DD')
    });

    // Fetch user signup data from API
    let userSignupsData;
    try {
      const signups = await this.store.query('user-signup', {
        start: startDate.format('YYYY-MM-DD'),
        end: endDate.format('YYYY-MM-DD')
      });
      console.log('Admin route: Received signup data:', signups.length, 'records');
      userSignupsData = this._transformSignupData(signups);
      console.log('Admin route: Transformed data:', userSignupsData);
    } catch (error) {
      console.error('Admin route: Failed to fetch user signups:', error);
      // Fallback to empty data if API fails
      userSignupsData = {
        labels: [],
        data: []
      };
    }

    return {
      fruitsCount: {
        labels: fruitLabels,
        data: fruitCounts
      },
      userSignups: userSignupsData
    };
  }

  _transformSignupData(signups) {
    // Generate labels for last 12 months
    const labels = [];
    const dataMap = new Map();
    
    // Initialize data map with zero counts for all 12 months
    for (let i = 11; i >= 0; i--) {
      const month = dayjs().subtract(i, 'months');
      const monthKey = month.format('YYYY-MM');
      const monthLabel = month.format('MMM');
      labels.push(monthLabel);
      dataMap.set(monthKey, 0);
    }

    // Fill in actual signup counts from API
    signups.forEach(signup => {
      if (dataMap.has(signup.month)) {
        dataMap.set(signup.month, signup.count);
      }
    });

    // Convert map to array in the same order as labels
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const month = dayjs().subtract(i, 'months');
      const monthKey = month.format('YYYY-MM');
      data.push(dataMap.get(monthKey) || 0);
    }

    return {
      labels,
      data
    };
  }
}