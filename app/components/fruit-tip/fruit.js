import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class FruitTipFruitComponent extends Component {
  @service chat;

  get count() {
    console.log(`in count: ${this.args.fruit.name}`);
    return this.chat.getFruitCount(this.args.fruit.name);
  }
}
