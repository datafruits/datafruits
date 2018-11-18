import App from '../../app';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  model: async function(params){
    params.page = params.page || 1;
    const podcast = await this.store.queryRecord('podcast', { name: 'datafruits', page: params.page });
    return hash({
      tracks: podcast.get('tracks'),
      meta: App.storeMeta['podcast'],
      labels: this.store.findAll('label'),
    })
  }
});
