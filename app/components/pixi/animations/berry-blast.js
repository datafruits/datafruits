import * as PIXI from 'pixi.js';
import { later } from '@ember/runloop';
import { screenShake } from './utils';

export default class BerryBlast {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}) {
    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    const count = 40;
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;

    for (let i = 0; i < count; i++) {
      let sprite = new PIXI.AnimatedSprite(animations['strawberry']);

      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 3 + Math.random() * 5;

      sprite.scale.x = 0.2 + Math.random() * 0.2;
      sprite.scale.y = sprite.scale.x;
      sprite.x = centerX;
      sprite.y = centerY;
      sprite.vx = Math.cos(angle) * speed;
      sprite.vy = Math.sin(angle) * speed;

      sprite.animationSpeed = 0.5 + Math.random() * 1.5;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      sprite.gotoAndPlay(randomFrame);

      const filter = new PIXI.filters.ColorMatrixFilter();
      filter.hue(i * 9, false);
      sprite.filters = [filter];

      this.sprites.push(sprite);
      app.stage.addChild(sprite);
    }

    later(() => {
      this.sprites.forEach((sprite) => {
        sprite.filters = [filters.noiseFilter, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 5000);

    screenShake();
  }

  update(delta, app) {
    this.sprites.forEach((sprite) => {
      sprite.x += sprite.vx * delta;
      sprite.y += sprite.vy * delta;
      sprite.vy += 0.1 * delta; // gravity pulls sprites downward
      sprite.rotation += 0.05 * delta;
    });

    if (this.alphaFadeout) {
      this.alphaFilterValue -= 0.01;
      this.alphaFilter.alpha = this.alphaFilterValue;
    }
    if (this.alphaFilterValue <= 0) {
      this.sprites.forEach((sprite) => {
        sprite.destroy();
        app.stage.removeChild(sprite);
      });
      this.finished = true;
    }
  }
}
