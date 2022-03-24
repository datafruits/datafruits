import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class UserFollow extends ApplicationAdapter {
  namespace = 'api';
}
