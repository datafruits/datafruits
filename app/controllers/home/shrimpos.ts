import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type Shrimpo from 'datafruits13/models/shrimpo';

export default class HomeShrimpos extends Controller {
  declare model: [Shrimpo];

  @service declare session: any;

  get savedShrimpos() {
    return this.model.filter((shrimpo: any) => {
      return !shrimpo.isNew;
    });
  }

  get currentShrimpos() {
    return this.model.filter((shrimpo: any) => {
      return !shrimpo.isNew && (shrimpo.status === 'running' || shrimpo.status === 'voting');
    });
  }

  get completedShrimpos() {
    return this.model.filter((shrimpo: any) => {
      return !shrimpo.isNew && shrimpo.status === 'completed';
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/shrimpos': HomeShrimpos;
  }
}
