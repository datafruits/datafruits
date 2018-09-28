import App from '../app';
import { ActiveModelSerializer } from 'active-model-adapter';

App.storeMeta = {};

export default ActiveModelSerializer.extend({
  host: 'https://datafruits.streampusher.com',

  normalizeResponse(store, primaryModelClass, payload) {
    App.storeMeta[primaryModelClass.modelName] = payload.meta; //ember data only allows meta data on 'query', this adds support for all other methods
      return this._super(...arguments);
  }

});
