import * as PIXI from 'pixi.js';
import { screenShake } from './utils';
import { later } from '@ember/runloop';

export default class MegaBeamsprout {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}) {
    console.log("MEGA beamsprout!");
    let sprite = new PIXI.AnimatedSprite(animations["megaBeamsprout"]);
    let text = new PIXI.Text("MEGA BEAMSPROUT", {
      fontFamily: "Arial",
      fontSize: 48,
      fill: ["yellow", "green", "blue", "pink"],
      align: "center",
      dropShadow: true,
    });
    text.width = app.screen.width;
    text.height = app.screen.height;
    // text.x = app.screen.width / 2;
    // text.y = app.screen.height / 2;
    let noise = new PIXI.filters.NoiseFilter(0.2);

    text.filters = [filters.customFilter, noise];
    app.stage.addChild(text);
    this.paidFruitTipSprites.pushObject(text);

    // TODO refactor blobs to use a particle system
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
      this.paidFruitTipSprites.pushObject(blobSprite);
    }

    let randomMegaBeamsprout;
    for (let i = 0; i < 5; i++) {
      randomMegaBeamsprout = new PIXI.AnimatedSprite(
        animations["metalPineapple"],
      );
      randomMegaBeamsprout.x = Math.random() * app.screen.width;
      randomMegaBeamsprout.y = Math.random() * app.screen.height;
      randomMegaBeamsprout.scale.x = Math.random() * 1;
      randomMegaBeamsprout.scale.y = Math.random() * 1;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomMegaBeamsprout.gotoAndPlay(randomFrame);
      app.stage.addChild(randomMegaBeamsprout);
      this.paidFruitTipSprites.pushObject(randomMegaBeamsprout);
    }

    sprite.scale.x = 1;
    sprite.scale.y = 1;
    sprite.x = app.screen.width / 4;
    sprite.y = app.screen.height / 4;

    // sprite.animationSpeed = Math.random() * 2;
    // sprite.rotation = Math.floor(Math.random() * 360);
    let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
    sprite.gotoAndPlay(randomFrame);

    //sprite.filters = [this.filter];
    app.stage.addChild(sprite);
    this.paidFruitTipSprites.pushObject(sprite);

    later(() => {
      // kill everything after 5000 ms
      //app.stage.removeChild(text);
      //text.filters = [this.filter, this.alphaFilter];
      this.paidFruitTipSprites.forEach((sprite) => {
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
