import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FruitTipComponent extends Component {
  @tracked showingFruitChoices = false;
  @service
  chat;

  fruitTypes = [
    {
      name: 'strawberry',
      image: '/assets/images/emojis/strawbur.gif',
    },
    {
      name: 'orange',
      image: '/assets/images/emojis/orangey.gif',
    },
    {
      name: 'lemon',
      image: '/assets/images/emojis/lemoner.gif',
    },
  ];

  // strawberry, orange, lemon
  @action
  fruitTip(fruitType, event) {
    console.log('tip fruit!');
    if (this.chat.token) {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: fruitType,
        timestamp: Date.now(),
        token: this.chat.token,
      });
    } else {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: fruitType,
        timestamp: Date.now(),
      });
    }
    event.preventDefault();
  }

  @action
  showFruitChoices() {
    this.showingFruitChoices = true;
  }

  @action
  hideFruitChoices() {
    this.showingFruitChoices = false;
  }
}
