import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class HomeForumShow extends Controller {
  @service declare currentUser: any;
  @service declare session: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/forum/show': HomeForumShow;
  }
}
