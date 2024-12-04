import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class ScheduledShowFavorite extends ApplicationAdapter {
  namespace = 'api';
}
