import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import CurrentUserService from 'datafruits13/services/current-user';

interface UserNotificationsWindowSignature {
  Args: {};
  Element: HTMLAnchorElement;
}

export default class UserNotificationsWindow extends Component<UserNotificationsWindowSignature> {
  @service declare intl: any;
  @service declare store: any;
  @service declare currentUser: CurrentUserService;
  @tracked showingNotificationsModal: boolean = false;
  @tracked hasUnread: boolean = true;

  @action
  toggleNotificationsModal() {
    this.showingNotificationsModal = !this.showingNotificationsModal;
  }

  @action
  fetchNotifications() {
    return this.store.findAll('notification').then((notifications: any) => {
      this.hasUnread = false;
      return notifications;
    });
  }

  @action
  setUnread() {
    this.hasUnread = this.currentUser.user?.hasUnreadNotifications;
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

