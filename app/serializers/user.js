import classic from 'ember-classic-decorator';
import { ActiveModelSerializer } from 'active-model-adapter';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

@classic
export default class User extends ActiveModelSerializer.extend(EmbeddedRecordsMixin) {
  host = 'https://datafruits.streampusher.com';

  attrs = {
    trackFavorites: { embedded: 'always' },
  }
}
