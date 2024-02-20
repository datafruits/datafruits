import Controller from '@ember/controller';
import type Shrimpo from 'datafruits13/models/shrimpo';
import { inject as service } from '@ember/service';

export default class HomeShrimposShow extends Controller {
  @service declare currentUser: any;
  @service declare session: any;

  declare model: Shrimpo;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/shrimpos/show': HomeShrimposShow;
  }
}
