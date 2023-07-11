import Fruit from './fruit';

const fruitTypes: Array<Fruit> = [
  new Fruit('strawberry', '/assets/images/emojis/strawbur.gif'),
  new Fruit('orange', '/assets/images/emojis/orangey.gif'),
  new Fruit('lemon', '/assets/images/emojis/lemoner.gif'),
  new Fruit('banana', '/assets/images/emojis/banaynay.gif'),
  new Fruit('watermelon', '/assets/images/emojis/watermel.gif'),
  new Fruit('cabbage', '/assets/images/emojis/cabbage.gif'),
  new Fruit('pineapple', '/assets/images/emojis/pineapple.gif', 0, 3),
  new Fruit('metal-pineapple', '/assets/images/emojis/metal_pineapple.png', 200),
  new Fruit('real-lemoner', '/assets/images/emojis/lemoner_real.png', 400),
];

export default fruitTypes;
