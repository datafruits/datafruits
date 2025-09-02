import * as PIXI from 'pixi.js';
import { later } from '@ember/runloop';
import { screenShake } from './utils';

export default class FruitSmoothie {
  sprites = [];
  finished = false;

  constructor(app, animations, fruits, filters = {}) {
    this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);
    this.alphaFilterValue = 1.0;
    this.alphaFadeout = false;

    const centerX = 0;
    const centerY = 0;
    let angle = 0; // Starting angle
    let radius = 10; // Initial spacing between fruits
    let spiralSpacing = 15; // Distance increase per step
    let angleIncrement = Math.PI / 6; // Spiral step angle

    for(let i = 0; i < 20; i++) {
      fruits.forEach((fruit) => {
        const fruitName = fruit;
        let sprite = new PIXI.AnimatedSprite(animations[fruitName]);
        sprite.scale.x = 0.25;
        sprite.scale.y = 0.25;

        sprite.x = centerX;
        sprite.y = centerY;

        // Store initial radius and angle
        sprite.angle = angle;
        sprite.radius = radius;

        sprite.animationSpeed = Math.random() * 2;
        let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
        sprite.gotoAndPlay(randomFrame);

        const filter = new PIXI.filters.ColorMatrixFilter();
        sprite.filters = [filter];

        this.sprites.push({ sprite, filter });

        app.stage.addChild(sprite);

        // Update for next fruit
        angle += angleIncrement;
        radius -= spiralSpacing;
      });
      angle = i * 10;
      radius = 10 * (-i);
    }

    // const pixiCanvas = document.getElementsByTagName("canvas")[0];
    // const oldZIndex  = pixiCanvas.style.zIndex;
    // pixiCanvas.style.zIndex = 99;
    //
    later(() => {
      // kill everything after 5000 ms
      this.sprites.forEach(({sprite, filter}) => {
        sprite.filters = sprite.filters.concat([filters.noiseFilter, this.alphaFilter]);
      });
      this.alphaFadeout = true;
      //pixiCanvas.style.zIndex = oldZIndex;
    }, 15000);

    screenShake();

    let element = document.getElementsByTagName('body')[0];
    element.classList.remove('rotate-screen');
    // https://css-tricks.com/restart-css-animation/
      void element.offsetWidth;
    element.classList.add('rotate-screen');
  }

  update(delta, app) {
    this.sprites.forEach(({ sprite, filter }, index) => {
      sprite.radius -= 1; // Speed of movement towards the center
      sprite.angle += 0.05; // Increment the angle to move along the spiral path

      const hueRotation = index * 90;
      filter.hue(hueRotation, false);
      if(index % 3 === 0) {
        filter.lsd(true);
      } else if (index % 4 === 0) {
        filter.blackAndWhite(true);
      }

      const centerX = app.screen.width / 2;
      const centerY = app.screen.height / 2;

      sprite.x = centerX + sprite.radius * Math.cos(sprite.angle);
      sprite.y = centerY + sprite.radius * Math.sin(sprite.angle);
    });

    if (this.alphaFadeout) {
      this.alphaFilterValue = this.alphaFilterValue - 0.01;
      this.alphaFilter.alpha = this.alphaFilterValue;
    }
    if (this.alphaFilterValue <= 0) {
      this.sprites.forEach(({ sprite, filter }) => {
        sprite.destroy();
        app.stage.removeChild(sprite);
      });
      this.finished = true;
    }
  }
}
