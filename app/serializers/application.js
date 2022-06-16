import classic from 'ember-classic-decorator';
import { ActiveModelSerializer } from 'active-model-adapter';
import ENV from 'datafruits13/config/environment';

@classic
export default class Application extends ActiveModelSerializer {
  host = ENV.API_HOST;

  normalizeResponse(store, primaryModelClass, payload) {
    return super.normalizeResponse(...arguments);
  }
}
