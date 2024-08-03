import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type Shrimpo from 'datafruits13/models/shrimpo';

export default class HomeShrimpos extends Controller {
  declare model: [Shrimpo];

  @service declare session: any;
  @service declare currentUser: any;

  get canCreateNewShrimpo(): boolean {
    return this.session.isAuthenticated && (this.currentUser.user.level > 2);
  }

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
