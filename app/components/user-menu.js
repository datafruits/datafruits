import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class UserMenuComponent extends Component {
  @service session;
  @service chat;
  @service currentUser;

  @action
  logout() {
    this.session.invalidate();
    this.chat.disconnect();
    this.args.toggleUserMenu();
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserMenuComponent: typeof UserMenuComponent;
  }
}
  
