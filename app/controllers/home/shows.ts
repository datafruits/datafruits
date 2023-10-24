import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class HomeShows extends Controller {
  @service declare session: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/shows': HomeShows;
  }
}
