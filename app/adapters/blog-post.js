import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class BlogPost extends ApplicationAdapter {
  namespace = 'api';
}
