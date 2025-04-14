import * as PIXI from 'pixi.js';
import { screenShake } from './utils';
import { later } from '@ember/runloop';

export default class TheRavers {
  sprites = [];
  finished = false;
  count = 0;
  constructor(app, animations, textures, filters = {}) {
    // TODO refactor blobs to use a particle system
    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    let blobSprite;
    for (let i = 0; i < 10; i++) {
      blobSprite = new PIXI.AnimatedSprite(animations["weirdBlobs"]);
      blobSprite.x = Math.random() * app.screen.width;
      blobSprite.y = Math.random() * app.screen.height;
      blobSprite.scale.x = 0.25;
      blobSprite.scale.y = 0.25;
      blobSprite.animationSpeed = 0.15;
      //blobSprite.rotation = Math.floor(Math.random() * 360);
      let randomFrame = Math.floor(Math.random() * blobSprite.totalFrames);
      blobSprite.gotoAndPlay(randomFrame);
      app.stage.addChild(blobSprite);
      //sprite.filters = [this.filter];
      //this.sprites.pushObject(sprite);
      this.sprites.push(blobSprite);
    }

    const ravers = [
      "alandmoosleech",
      "burger_girl",
      "chill_ghost_shirt_guy",
      "maskedburgerweirdo",
      "maybe_kamaida",
      "petscop",
      "rainbowglorpy",
      "sportsjin",
      "wormy"
    ];
    const raverCount = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
    //
    for(let i = 0; i < raverCount; i++) {
    //ravers.forEach((raver) => {
      const raver = ravers[Math.floor(Math.random() * ravers.length)];
      let sprite = new PIXI.Sprite(textures[raver]);

      sprite.scale.x = 0.25;
      sprite.scale.y = 0.25;
      sprite.x = Math.random() * app.screen.width;
      sprite.y = Math.random() * app.screen.height;
      this.sprites.push(sprite);
      app.stage.addChild(sprite);
      this.sprites.push(sprite);

    }

    later(() => {
      // kill everything after 5000 ms
      //app.stage.removeChild(text);
      //text.filters = [this.filter, this.alphaFilter];
      this.sprites.forEach((sprite) => {
        sprite.filters = [filters.noiseFilter, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 5000);

    screenShake();
  }

  update(delta, app) {
    this.count += 0.02 * delta;

    this.sprites.forEach((sprite) => {
      sprite.x += Math.sin(this.count);
      sprite.y += Math.cos(this.count);
    });

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
