import * as PIXI from 'pixi.js';
import { later } from '@ember/runloop';

export default class TropicalWave {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}) {
    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    const tropicalFruits = ['banana', 'pineapple'];
    const count = 24;

    for (let i = 0; i < count; i++) {
      const fruitName = tropicalFruits[i % tropicalFruits.length];
      let sprite = new PIXI.AnimatedSprite(animations[fruitName]);

      sprite.scale.x = 0.3;
      sprite.scale.y = 0.3;

      // Spread sprites across the screen height, each with a unique phase
      sprite.waveOffset = (i / count) * Math.PI * 2;
      sprite.speed = 2 + Math.random() * 2;
      sprite.amplitude = 60 + Math.random() * 80;
      sprite.baseY = (i / count) * app.screen.height;
      sprite.x = Math.random() * app.screen.width;
      sprite.y = sprite.baseY;

      sprite.animationSpeed = 0.15 + Math.random() * 0.1;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      sprite.gotoAndPlay(randomFrame);

      this.sprites.push(sprite);
      app.stage.addChild(sprite);
    }

    later(() => {
      this.sprites.forEach((sprite) => {
        sprite.filters = [filters.noiseFilter, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 8000);
  }

  update(delta, app) {
    this.sprites.forEach((sprite) => {
      sprite.x += sprite.speed * delta;
      sprite.waveOffset += 0.05 * delta;
      sprite.y = sprite.baseY + sprite.amplitude * Math.sin(sprite.waveOffset);

      // Wrap around when sprite exits the right edge
      if (sprite.x > app.screen.width + 50) {
        sprite.x = -50;
      }
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
