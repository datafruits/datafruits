import App from '../../app';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  model(params){
    params.page = params.page || 1;
    return this.store.queryRecord('podcast', { name: 'datafruits', page: params.page }).then((podcast) => {
      return hash({
        tracks: podcast.get('tracks'),
        meta: App.storeMeta['podcast'],
        labels: this.store.findAll('label'),
      })
    });
  }
});
