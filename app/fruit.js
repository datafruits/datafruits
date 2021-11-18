import { tracked } from '@glimmer/tracking';

export default class Fruit {
  @tracked count;
  @tracked name;
  @tracked image;

  constructor(name, image) {
    this.name = name;
    this.image = image;
  }
}
