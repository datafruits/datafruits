import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import ChatService from "datafruits13/services/chat";

export default class BuddyListButton extends Component {
  @service declare chat: ChatService;

  @tracked showingDialog = false;

  @action toggleDialog() {
    this.showingDialog = !this.showingDialog;
  }
}

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    BuddyListButton: typeof BuddyListButton;
  }
}
