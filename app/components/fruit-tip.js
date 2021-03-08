import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FruitTipComponent extends Component {
  @tracked showingFruitChoices = false;
  @tracked selectedFruitTip;
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

  tippableFruits = [
    {
      name: 'dragonfruit',
      value: 5,
      image: '/assets/images/fruit-tips/dragonfruit.gif',
    },
    {
      name: 'rainbow-pineapple',
      value: 10,
      image: '/assets/images/fruit-tips/rainbow-pineapple.gif',
    },
    {
      name: 'pizza-sushi',
      value: 20,
      image: '/assets/images/fruit-tips/pizza-sushi.gif',
    },
  ];

  get randomFruitImage() {
    return this.fruitTypes[Math.floor(Math.random() * this.fruitTypes.length)].image;
  }

  @action
  fruitTip(fruitType, event) {
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

  @action
  beginTipTransaction(fruitTip) {
    this.selectedFruitTip = fruitTip;
    this.showingTipModal = true;
  }
}
