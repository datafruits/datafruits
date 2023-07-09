import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

interface UserNotificationsWindowArgs {}

export default class UserNotificationsWindow extends Component<UserNotificationsWindowArgs> {
  @service declare intl: any;
  @service declare store: any;
  @tracked showingNotificationsModal: boolean = false;
  @tracked hasUnread: boolean = true;

  @action
  toggleNotificationsModal() {
    this.showingNotificationsModal = !this.showingNotificationsModal;
  }

  @action
  fetchNotifications() {
    return this.store.findAll('notification');
  }

  get pidgeonTranslation() {
    if(this.hasUnread) {
      return this.intl.t("profile.notifications.header");
    } else {
      return this.intl.t("profile.notifications.title");
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserNotificationsWindow: typeof UserNotificationsWindow;
  }
}

