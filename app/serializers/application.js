import classic from 'ember-classic-decorator';
import { ActiveModelSerializer } from 'active-model-adapter';

@classic
export default class Application extends ActiveModelSerializer {
  host = 'https://datafruits.streampusher.com';

  normalizeResponse(store, primaryModelClass, payload) {
    //App.storeMeta[primaryModelClass.modelName] = payload.meta; //ember data only allows meta data on 'query', this adds support for all other methods
    return super.normalizeResponse(...arguments);
  }
}
