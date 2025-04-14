import * as PIXI from 'pixi.js';
import { screenShake } from './utils';
import { later } from '@ember/runloop';

export default class RealLemoner {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}) {
    let sprite = new PIXI.AnimatedSprite(animations["realLemoner"]);
    let text = new PIXI.Text("LEMONER IS REAL", {
      fontFamily: "Arial",
      fontSize: 48,
      fill: ["yellow", "green", "blue", "pink"],
      align: "center",
      dropShadow: true,
    });
    text.width = app.screen.width;
    text.height = app.screen.height;

    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    text.filters = [filters.customFilter, filters.noiseFilter];
    app.stage.addChild(text);
    this.sprites.push(text);

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

    let randomRealLemoner;
    for (let i = 0; i < 5; i++) {
      randomRealLemoner = new PIXI.AnimatedSprite(
        animations["realLemoner"],
      );
      randomRealLemoner.x = Math.random() * app.screen.width;
      randomRealLemoner.y = Math.random() * app.screen.height;
      randomRealLemoner.scale.x = Math.random() * 1;
      randomRealLemoner.scale.y = Math.random() * 1;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomRealLemoner.gotoAndPlay(randomFrame);
      app.stage.addChild(randomRealLemoner);
      this.sprites.push(randomRealLemoner);
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
