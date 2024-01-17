import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

import ChatService from "datafruits13/services/chat";

export default class WebsiteSettings extends Component {
  @service declare chat: ChatService;

  @action
  toggleGifsEnabled() {
    this.chat.gifsEnabled = !this.chat.gifsEnabled;
  }
}
