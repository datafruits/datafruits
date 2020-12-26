import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FruitTipComponent extends Component {
  @service
  chat;

  @action
  fruitTip(event) {
    console.log('tip fruit!');
    if (this.chat.token) {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: 'strawberry',
        timestamp: Date.now(),
        token: this.chat.token,
      });
    } else {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: 'strawberry',
        timestamp: Date.now(),
      });
    }
    event.preventDefault();
  }
}
