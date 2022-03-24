import { tracked } from '@glimmer/tracking';

export default class Fruit {
  @tracked count: number = 0;
  @tracked name: string;
  @tracked image: string;

  constructor(name: string, image: string) {
    this.name = name;
    this.image = image;
  }
}
