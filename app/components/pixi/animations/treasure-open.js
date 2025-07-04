import * as PIXI from 'pixi.js';
import { screenShake } from './utils';
import { later } from '@ember/runloop';

export default class TreasureOpen {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}, treasureName) {
    let sprite;
    switch(treasureName) {
      case 'glorp_points': {
        sprite = new PIXI.AnimatedSprite(animations["treasureChestGlorpOpen"]);
        break;
      }
      case 'fruit_tickets': {
        sprite = new PIXI.AnimatedSprite(animations["treasureChestFruitTicketsOpen"]);
        break;
      }
      case 'bonezo': {
        sprite = new PIXI.AnimatedSprite(animations["treasureChestBonezoOpen"]);
        break;
      }
      default:
        break;
    }
    if(!sprite) return;

    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    // TODO refactor blobs to use a particle system
    let blobSprite;
    for (let i = 0; i < 15; i++) {
      blobSprite = new PIXI.AnimatedSprite(animations["weirdBlobs"]);
      blobSprite.x = Math.random() * app.screen.width;
      blobSprite.y = Math.random() * app.screen.height;
      blobSprite.scale.x = 0.25;
      blobSprite.scale.y = 0.25;
      blobSprite.animationSpeed = 0.15;
      let randomFrame = Math.floor(Math.random() * blobSprite.totalFrames);
      blobSprite.gotoAndPlay(randomFrame);
      app.stage.addChild(blobSprite);
      this.sprites.push(blobSprite);
    }

    sprite.scale.x = 1;
    sprite.scale.y = 1;
    sprite.x = app.screen.width / 8;
    sprite.y = app.screen.height / 8;

    sprite.animationSpeed = 0.5;
    sprite.loop = false;
    sprite.play();

    app.stage.addChild(sprite);
    this.sprites.push(sprite);

    later(() => {
      this.sprites.forEach((sprite) => {
        sprite.filters = [filters.noiseFilter, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 5000);

    screenShake();
  }

  update(delta, app) {
    if (this.alphaFadeout) {
      this.alphaFilterValue = this.alphaFilterValue - 0.01;
      this.alphaFilter.alpha = this.alphaFilterValue;
    }
    if (this.alphaFilterValue <= 0) {
      this.sprites.forEach((sprite) => {
        app.stage.removeChild(sprite);
      });
      this.finished = true;
    }
  }
}
