import Component from '@glimmer/component';
import { action } from '@ember/object';
import * as PIXI from 'pixi.js';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default class PixiComponent extends Component {
  @service eventBus;

  filter;
  background;
  app;
  sprites = [];
  animations = {};

  fruits = ['strawberry', 'lemon', 'orange', 'banana', 'watermelon'];

  constructor() {
    super(...arguments);
    this.eventBus.subscribe('fruitTipped', this, 'addFruitTip');
  }

  addFruitTip(event) {
    if (this.app) {
      let animation;
      if (this.fruits.includes(event)) {
        animation = event;
      } else {
        console.log(`invalid fruit: ${event}`); // eslint-disable-line no-console
      }
      let sprite = new PIXI.AnimatedSprite(this.animations[animation]);
      sprite.scale.x = 0.25;
      sprite.scale.y = 0.25;
      sprite.x = Math.random() * this.app.screen.width;
      sprite.y = Math.random() * this.app.screen.height;

      sprite.animationSpeed = 1;
      sprite.play();

      this.sprites.pushObject(sprite);
      this.app.stage.addChild(sprite);
      // add callback to remove sprite after 5s
      later(() => {
        sprite.destroy();
        let spriteIndex = this.sprites.indexOf(sprite);
        this.sprites.splice(spriteIndex, 1);
      }, 5000);
    } else {
      console.log("pixi.js wasn't initialized..."); // eslint-disable-line no-console
    }
  }

  @action
  willDestroy() {
    this.app.destroy({
      removeView: true,
    });
  }

  @action
  didInsert() {
    let type = 'WebGL';
    if (!PIXI.utils.isWebGLSupported()) {
      type = 'canvas';
    }

    PIXI.utils.sayHello(type);

    this.app = new PIXI.Application({
      autoResize: true,
      resolution: devicePixelRatio,
      transparent: true,
    });

    document.body.appendChild(this.app.view);

    // move this into resize handler later
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.app.stop();

    this.app.loader.add('strawberry', '/assets/images/sprites/strawberry.json');
    this.app.loader.add('orange', '/assets/images/sprites/orange.json');
    this.app.loader.add('lemon', '/assets/images/sprites/lemon.json');
    this.app.loader.add('banana', '/assets/images/sprites/banana.json');
    this.app.loader.add('watermelon', '/assets/images/sprites/watermelon.json');
    this.app.loader.add('shader', '/assets/shaders/shader.frag');
    this.app.loader.load((loader, res) => {
      this.filter = new PIXI.Filter(null, res.shader.data, {
        customUniform: 0.0,
      });

      this.animations.strawberry = res.strawberry.spritesheet.animations['strawberry2_wiggle.png'];
      this.animations.orange = res.orange.spritesheet.animations['orange.png'];
      this.animations.lemon = res.lemon.spritesheet.animations['lemon.png'];
      this.animations.banana = res.banana.spritesheet.animations['banana.png'];
      this.animations.watermelon = res.watermelon.spritesheet.animations['watermelon.png'];

      // Resume application update
      this.app.start();

      let count = 0;
      // Animate the filter
      this.app.ticker.add((delta) => {
        this.filter.uniforms.customUniform += delta;

        count += 0.02;

        this.sprites.forEach((sprite) => {
          sprite.x += Math.sin(count);
          sprite.y += Math.cos(count);
          sprite.scale.x += Math.sin(count) * 0.01;
          sprite.scale.y += Math.sin(count) * 0.01;
          sprite.rotation += Math.sin(count) * 0.01;
        });
      });
    });
  }
}
