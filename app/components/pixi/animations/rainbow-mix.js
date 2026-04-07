import * as PIXI from 'pixi.js';
import { later } from '@ember/runloop';
import { screenShake } from './utils';

export default class RainbowMix {
  sprites = [];
  finished = false;

  constructor(app, animations, fruits, filters = {}) {
    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;
    this.hueShift = 0;

    const total = fruits.length * 3;

    for (let i = 0; i < total; i++) {
      const fruitName = fruits[i % fruits.length];
      let sprite = new PIXI.AnimatedSprite(animations[fruitName]);

      sprite.scale.x = 0.25;
      sprite.scale.y = 0.25;

      // Expanding spiral: outer rings move more slowly
      sprite.orbitAngle = (i / total) * Math.PI * 2;
      sprite.orbitRadius = 20 + i * 8;
      sprite.orbitSpeed = Math.max(0.005, 0.04 - (i / total) * 0.03);

      sprite.animationSpeed = Math.random() * 2;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      sprite.gotoAndPlay(randomFrame);

      const filter = new PIXI.filters.ColorMatrixFilter();
      sprite.filters = [filter];

      this.sprites.push({ sprite, filter });
      app.stage.addChild(sprite);
    }

    later(() => {
      this.sprites.forEach(({ sprite }) => {
        sprite.filters = [filters.noiseFilter, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 12000);

    screenShake();

    let element = document.getElementsByTagName('body')[0];
    element.classList.remove('rotate-screen');
    void element.offsetWidth;
    element.classList.add('rotate-screen');
  }

  update(delta, app) {
    this.hueShift += 2 * delta;
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;
    const total = this.sprites.length;

    this.sprites.forEach(({ sprite, filter }, index) => {
      sprite.orbitAngle += sprite.orbitSpeed * delta;
      sprite.x = centerX + sprite.orbitRadius * Math.cos(sprite.orbitAngle);
      sprite.y = centerY + sprite.orbitRadius * Math.sin(sprite.orbitAngle);

      filter.hue(this.hueShift + index * (360 / total), false);
    });

    if (this.alphaFadeout) {
      this.alphaFilterValue -= 0.01;
      this.alphaFilter.alpha = this.alphaFilterValue;
    }
    if (this.alphaFilterValue <= 0) {
      this.sprites.forEach(({ sprite }) => {
        sprite.destroy();
        app.stage.removeChild(sprite);
      });
      this.finished = true;
    }
  }
}
