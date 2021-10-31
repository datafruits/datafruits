import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

class Fruit {
  @service chat;

  @tracked count;
  @tracked name;
  @tracked image;

  constructor(name, image) {
    this.name = name;
    this.image = image;
  }

  get count() {
    return this.chat.getFruitCount(this.name);
  }
}

export default class FruitTipComponent extends Component {
  @tracked showingFruitChoices = false;
  @service
  chat;

  fruitTypes = [
    new Fruit('strawberry', '/assets/images/emojis/strawbur.gif'),
    new Fruit('orange', '/assets/images/emojis/orangey.gif'),
    new Fruit('lemon', '/assets/images/emojis/lemoner.gif'),
    new Fruit('banana', '/assets/images/emojis/banaynay.gif'),
    new Fruit('watermelon', '/assets/images/emojis/watermel.gif'),
  ];

  get randomFruitImage() {
    return this.fruitTypes[Math.floor(Math.random() * this.fruitTypes.length)].image;
  }

  get fruitCountTotal() {
    return this.chat.getFruitCount('total');
  }

  get lemons(){
    return this.chat.getFruitCount('lemon');
  }

  @action
  fruitTip(fruitType, event) {
    console.log(this.chat.fruitCounts);
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
