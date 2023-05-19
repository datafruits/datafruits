import { tracked } from '@glimmer/tracking';

export default class Fruit {
  @tracked count: number = 0;
  @tracked name: string;
  @tracked image: string;
  @tracked cost: number = 0;
  @tracked levelReq: number = 0;

  constructor(name: string, image: string, cost: number = 0, levelReq: number = 0) {
    this.name = name;
    this.image = image;
    this.cost = cost;
    this.levelReq = levelReq;
  }
}
