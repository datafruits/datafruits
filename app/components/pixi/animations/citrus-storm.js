import * as PIXI from 'pixi.js';
import { later } from '@ember/runloop';
import { screenShake } from './utils';

export default class CitrusStorm {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}) {
    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    const citrusFruits = ['lemon', 'orange'];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const fruitName = citrusFruits[i % citrusFruits.length];
      let sprite = new PIXI.AnimatedSprite(animations[fruitName]);

      sprite.scale.x = 0.25;
      sprite.scale.y = 0.25;

      // Distribute evenly around the center in orbit
      sprite.orbitAngle = (i / count) * Math.PI * 2;
      sprite.orbitRadius = 60 + Math.random() * 160;
      sprite.orbitSpeed = (0.02 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : -1);

      sprite.animationSpeed = 0.5 + Math.random() * 1.5;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      sprite.gotoAndPlay(randomFrame);

      const filter = new PIXI.filters.ColorMatrixFilter();
      filter.hue(i * 12, false);
      sprite.filters = [filter];

      this.sprites.push({ sprite, filter });
      app.stage.addChild(sprite);
    }

    later(() => {
      this.sprites.forEach(({ sprite }) => {
        sprite.filters = [filters.noiseFilter, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 8000);

    screenShake();
  }

  update(delta, app) {
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;

    this.sprites.forEach(({ sprite, filter }, index) => {
      sprite.orbitAngle += sprite.orbitSpeed * delta;
      sprite.x = centerX + sprite.orbitRadius * Math.cos(sprite.orbitAngle);
      sprite.y = centerY + sprite.orbitRadius * Math.sin(sprite.orbitAngle);

      filter.hue(index * 12 + sprite.orbitAngle * 10, false);
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
