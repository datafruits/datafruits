import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.queryRecord('dj', { name: params.name });

  },
  serialize(dj) {
    return {
      name: dj.get('name')
    };
  }
});
