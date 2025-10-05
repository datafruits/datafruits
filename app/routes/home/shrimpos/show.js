import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeShrimpoShow extends Route {
  @service store;
  @service currentUser;
  @service session;

  async model(params) {
    const shrimpo = await this.store.findRecord('shrimpo', params.title, { reload: true });
    let entry;

    if (this.session.isAuthenticated) {
      // Find existing entry by this user
      let existingEntry = shrimpo.shrimpoEntries.find((e) => {
        return e.username === this.currentUser.user.username;
      });

      if (existingEntry && !shrimpo.multiSubmitAllowed) {
        entry = existingEntry;
      } else {
        entry = this.store.createRecord('shrimpo-entry', {
          shrimpo,
          username: this.currentUser.user.username
        });
      }
    }

    return {
      shrimpo: shrimpo,
      shrimpoEntry: entry
    };
  }

}
