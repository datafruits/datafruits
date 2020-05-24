import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ChatTextService extends Service {
  @tracked color = "color: yellow"

  setColor(hexCode) {
    this.set('color', "color: " + hexCode)
  }
}
