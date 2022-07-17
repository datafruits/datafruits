import classic from 'ember-classic-decorator';
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

@classic
export default class User extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  host = 'https://datafruits.streampusher.com';

  attrs = {
    trackFavorites: { embedded: 'always' },
  };
}
