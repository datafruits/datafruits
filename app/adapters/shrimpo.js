import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Shrimpo extends ApplicationAdapter {
  namespace = 'api';
}
