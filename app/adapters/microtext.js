import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Microtext extends ApplicationAdapter {
  namespace = 'api';
}
