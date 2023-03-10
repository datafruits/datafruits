import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

export default class HomeForum extends Controller {
  @service declare session: Session;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/forum': HomeForum;
  }
}
