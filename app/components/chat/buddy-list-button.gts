import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { formatEmojiHtml } from "datafruits13/helpers/format-emoji-html";
import ChatService from "datafruits13/services/chat";
import { on } from "@ember/modifier";
import Modal from "../ui/modal.gts";
import UserListItem from "../user-list-item.gjs";

export default class BuddyListButton extends Component {<template><button {{on "click" this.toggleDialog}} type="button" class="cool-button md:hidden" title="Show the buddy list">
  {{this.buddyListIcon}}
</button>
{{#if this.showingDialog}}
  <Modal @toggleModal={{this.toggleDialog}} @hasOverlay={{false}} @clickOutsideToClose={{true}}>
    <div class="modal-body m-1">
      <div class="flex flex-shrink overflow-y-scroll">
        <ul id="userlist">
          {{#each-in this.chat.presences as |username user|}}
            <UserListItem @user={{user}} />
          {{/each-in}}
        </ul>
      </div>
    </div>
  </Modal>
{{/if}}
</template>
  @service declare chat: ChatService;

  @tracked showingDialog = false;

  @action toggleDialog() {
    this.showingDialog = !this.showingDialog;
  }

  get buddyListIcon() {
    return formatEmojiHtml(":busts_in_silhouette:");
  }
}
