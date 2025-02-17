import * as PIXI from 'pixi.js';
import { screenShake } from './utils';
import { later } from '@ember/runloop';

export default class GigaShrimpshake {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}) {
    let sprite = new PIXI.AnimatedSprite(animations["gigaShrimpshake"]);
    let noise = new PIXI.filters.NoiseFilter(0.2);

    let textSprite = new PIXI.AnimatedSprite(animations["gigaShrimpshakeText"]);

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
      //blobSprite.rotation = Math.floor(Math.random() * 360);
      let randomFrame = Math.floor(Math.random() * blobSprite.totalFrames);
      blobSprite.gotoAndPlay(randomFrame);
      app.stage.addChild(blobSprite);
      //sprite.filters = [this.filter];
      //this.sprites.pushObject(sprite);
      this.sprites.pushObject(blobSprite);
    }

    let randomGigaShrimpshake;
    for (let i = 0; i < 25; i++) {
      randomGigaShrimpshake = new PIXI.AnimatedSprite(
        animations["gigaShrimpshake"],
      );
      randomGigaShrimpshake.x = Math.random() * app.screen.width;
      randomGigaShrimpshake.y = Math.random() * app.screen.height;
      const randomScale = Math.random() * 1;
      randomGigaShrimpshake.scale.x = randomScale;
      randomGigaShrimpshake.scale.y = randomScale;
      randomGigaShrimpshake.tint = Math.random() * 0xFFFFFF;

      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomGigaShrimpshake.gotoAndPlay(randomFrame);
      app.stage.addChild(randomGigaShrimpshake);
      this.sprites.pushObject(randomGigaShrimpshake);
    }

    let randomBlueShrimp;
    for (let i = 0; i < 100; i++) {
      randomBlueShrimp = new PIXI.AnimatedSprite(
        animations["blueShrimp"],
      );
      randomBlueShrimp.x = Math.random() * app.screen.width;
      randomBlueShrimp.y = Math.random() * app.screen.height;
      const randomScale = Math.random() * 5;
      const flippedChance = Math.random() * 100;
      if(flippedChance >= 50) {
        randomBlueShrimp.scale.x = -randomScale;
      } else {
        randomBlueShrimp.scale.x = randomScale;
      }
      randomBlueShrimp.scale.y = randomScale;
      randomBlueShrimp.tint = Math.random() * 0xFFFFFF;

      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomBlueShrimp.gotoAndPlay(randomFrame);
      app.stage.addChild(randomBlueShrimp);
      this.sprites.pushObject(randomBlueShrimp);
    }

    sprite.scale.x = 1;
    sprite.scale.y = 1;
    sprite.x = app.screen.width / 4;
    sprite.y = app.screen.height / 4;

    sprite.animationSpeed = 0.25;
    let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
    sprite.gotoAndPlay(randomFrame);

    //sprite.filters = [this.filter];
    app.stage.addChild(sprite);
    this.sprites.pushObject(sprite);

    textSprite.x = app.screen.width / 4;
    textSprite.y = app.screen.height / 4;
    textSprite.gotoAndPlay(0);
    app.stage.addChild(textSprite);
    this.sprites.pushObject(textSprite);


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
