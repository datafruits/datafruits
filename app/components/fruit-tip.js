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
    {
      name: 'banana',
      image: '/assets/images/emojis/banaynay.gif',
    },
    {
      name: 'watermelon',
      image: '/assets/images/emojis/watermel.gif',
    },
    {
      name: 'metalPineapple',
      image: '/assets/images/emojis/metal_pineapple.png',
    },
  ];

  get randomFruitImage() {
    return this.fruitTypes[Math.floor(Math.random() * this.fruitTypes.length)].image;
  }

  @action
  fruitTip(fruitType, event) {
    event.preventDefault();
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
