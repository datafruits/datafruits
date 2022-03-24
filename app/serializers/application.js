import classic from 'ember-classic-decorator';
import { ActiveModelSerializer } from 'active-model-adapter';

@classic
export default class Application extends ActiveModelSerializer {
  host = 'https://datafruits.streampusher.com';

  normalizeResponse(store, primaryModelClass, payload) {
    return super.normalizeResponse(...arguments);
  }
}
