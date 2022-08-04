import { underscore } from '@ember/string';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import classic from 'ember-classic-decorator';

@classic
export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(attr) {
    return underscore(attr);
  }
}
