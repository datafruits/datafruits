import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class HomeShrimposShow extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  @service declare currentUser: any;
  @service declare session: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/shrimpos/show': HomeShrimposShow;
  }
}
