import * as PIXI from 'pixi.js';
import { later } from '@ember/runloop';
import { screenShake } from './utils';

export default class MegaCombo {
  sprites = [];
  finished = false;

  constructor(app, animations, filters = {}) {
    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    let text = new PIXI.Text('MEGA COMBO!', {
      fontFamily: 'Arial',
      fontSize: 64,
      fill: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'],
      align: 'center',
      dropShadow: true,
    });
    text.x = app.screen.width / 2 - text.width / 2;
    text.y = app.screen.height / 4;
    app.stage.addChild(text);
    this.sprites.push(text);

    // Scatter all available premium animated sprites across the screen
    const premiumAnimations = [
      'metalPineapple',
      'realLemoner',
      'megaBeamsprout',
      'gigaShrimpshake',
    ];

    premiumAnimations.forEach((animName) => {
      for (let i = 0; i < 4; i++) {
        const sprite = new PIXI.AnimatedSprite(animations[animName]);
        sprite.x = Math.random() * app.screen.width;
        sprite.y = Math.random() * app.screen.height;
        const scale = 0.3 + Math.random() * 0.7;
        sprite.scale.x = scale;
        sprite.scale.y = scale;
        sprite.tint = Math.floor(Math.random() * 0xffffff);
        sprite.animationSpeed = 0.2 + Math.random() * 0.3;
        let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
        sprite.gotoAndPlay(randomFrame);
        app.stage.addChild(sprite);
        this.sprites.push(sprite);
      }
    });

    later(() => {
      this.sprites.forEach((sprite) => {
        sprite.filters = [filters.noiseFilter, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 8000);

    screenShake();
  }

  update(delta, app) {
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
