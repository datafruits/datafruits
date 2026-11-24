import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { canEditShrimpo } from 'datafruits13/utils/can-edit-shrimpo';

export default class HomeShrimposEdit extends Route {
  @service store;
  @service session;
  @service currentUser;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.chat');
  }

  model(params) {
    return this.store.findRecord('shrimpo', params.title, { reload: true });
  }

  async afterModel(shrimpo) {
    await this.currentUser.load();
    if (!this.session.isAuthenticated || !canEditShrimpo(this.currentUser.user, shrimpo)) {
      this.router.replaceWith('home.shrimpos.show', shrimpo.slug);
    }
  }
}
