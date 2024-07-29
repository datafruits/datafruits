import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class ChatTextService extends Service {
  @tracked color = "color: #fff940";

  setColor(hexCode) {
    this.color = "color: " + hexCode;
  }

  constructor() {
    super(...arguments);

    const storedColor = localStorage.getItem("datafruits-chat-color");

    if (storedColor) {
      this.color = `color: ${storedColor}`;
    }
  }
}
