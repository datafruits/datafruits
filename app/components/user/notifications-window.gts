import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import CurrentUserService from 'datafruits13/services/current-user';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { on } from "@ember/modifier";
import Modal from "../ui/modal.ts";
import t from "ember-intl/helpers/t";
import Await from "../await.js";
import UserNotification from "../user-notification.gts";
import formatMessageBody from "../../helpers/format-message-body.js";

export default class UserNotificationsWindow extends Component {<template><div {{didInsert this.setUnread}}>
  <a {{on "click" this.toggleNotificationsModal}} ...attributes class="text-shadow">
    <img src="/assets/images/futsu.png" style="max-width: none;" alt="{{this.pidgeonTranslation}}" class="{{if this.hasUnread "shake" ""}}" />
  </a>
  {{#if this.showingNotificationsModal}}
    <Modal @toggleModal={{this.toggleNotificationsModal}}>
      <div class="modal-body m-1">
        <h1>
          {{t "profile.notifications.title"}}
        </h1>
        <div>
          <Await @promise={{this.fetchNotifications}}>
            <:pending>
              <p id="podcast-search-loading" class>
                {{t "loading"}}
              </p>
            </:pending>

            <:success as |result|>
              <ul>
                {{#each result as |notification|}}
                  <UserNotification @notification={{notification}} />
                {{/each}}
              </ul>
            </:success>

            <:error>
              {{t "error"}}{{formatMessageBody ":sorrymustabeentheonionsaladdressing:"}}
            </:error>
          </Await>
        </div>
      </div>
    </Modal>
  {{/if}}
</div></template>
  @service declare intl: any;
  @service declare store: any;
  @service declare currentUser: CurrentUserService;
  @tracked showingNotificationsModal: boolean = false;
  @tracked hasUnread: boolean = true;

  @action
  toggleNotificationsModal() {
    this.showingNotificationsModal = !this.showingNotificationsModal;
  }

  get fetchNotifications() {
    return this.store.findAll('notification').then((notifications: any) => {
      this.hasUnread = false; // eslint-disable-line ember/no-side-effects
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
