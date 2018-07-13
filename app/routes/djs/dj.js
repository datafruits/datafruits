import Route from '@ember/routing/route';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('dj', params.name);
  },
});
