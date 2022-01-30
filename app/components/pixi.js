// snow from https://codepen.io/jh3y/pen/VdMBaR
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

  fruits = ['strawberry', 'lemon', 'orange', 'banana', 'watermelon', 'cabbage'];

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

      sprite.animationSpeed = Math.random() * 2;
      sprite.rotation = Math.floor(Math.random() * 360);
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      sprite.gotoAndPlay(randomFrame);

      this.sprites.pushObject(sprite);
      this.app.stage.addChild(sprite);
      // add callback to remove sprite after 5s
      later(() => {
        let x = sprite.x;
        let y = sprite.y;

        let starSprite = new PIXI.AnimatedSprite(this.animations['stars']);
        starSprite.x = x;
        starSprite.y = y;
        starSprite.animationSpeed = Math.random() * 2;
        let starScale = Math.random() * 2;
        starSprite.scale.x = starScale;
        starSprite.scale.y = starScale;
        sprite.destroy();
        let spriteIndex = this.sprites.indexOf(sprite);
        this.sprites.splice(spriteIndex, 1);

        // play star animation
        starSprite.loop = false;
        starSprite.play();
        this.app.stage.addChild(starSprite);
        later(() => {
          // remove star animation
          starSprite.destroy();
        }, 300);
      }, 5000);
    } else {
      console.log("pixi.js wasn't initialized..."); // eslint-disable-line no-console
    }
  }

  @action
  willDestroy() {
    super.willDestroy(...arguments);
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
      backgroundAlpha: 0,
    });

    const UPPER_LIMIT_Y = 10;
    const UPPER_LIMIT_X = 2;
    const LOWER_LIMIT_X = -2;
    const MAX_SIZE = 2;
    const MIN_SIZE = 0.25;
    const AMOUNT = 1000;

    // Reset particle start points based on screen
    const reset = (p) => {
      p.x = floored(this.app.renderer.width);
      p.y = -(p.size + floored(this.app.renderer.height));
      p.vy = floored(UPPER_LIMIT_Y) + 2;
    };

    // Update value by either subtracting to adding
    const update = (p) => (Math.random() > 0.5 ? Math.max(LOWER_LIMIT_X, p - 1) : Math.min(p + 1, UPPER_LIMIT_X));

    const floored = (v) => Math.floor(Math.random() * v);
    // Generate a particle set based on a given texture
    const genParticles = (t) =>
      new Array(AMOUNT).fill().map((p) => {
        const SIZE = floored(MAX_SIZE) + MIN_SIZE;
        p = new PIXI.Sprite(t);
        p.size = SIZE;
        p.vx = floored(UPPER_LIMIT_X) - UPPER_LIMIT_X;
        p.vy = floored(UPPER_LIMIT_Y) + 2;
        p.alpha = Math.random();
        p.x = p.startX = floored(this.app.renderer.width);
        p.y = p.startY = -(SIZE + floored(this.app.renderer.height));
        p.scale.x = 0.05;
        p.scale.y = 0.05;
        //p.tint = getRandomColor()
        drops.addChild(p);
        return p;
      });

    // Create particle container
    const drops = new PIXI.ParticleContainer(1000, {
      scale: true,
      position: true,
      rotation: true,
      alpha: true,
    });
    this.app.stage.addChild(drops);

    // Create a base graphic for our sprites
    const p = new PIXI.Graphics();
    p.beginFill(0xffffff);
    p.drawCircle(0, 0, 100);
    p.endFill();
    // Generate a base texture from the base graphic
    p.beginFill(0xffffff);
    // Generate a base texture from the base graphic
    const baseTexture = this.app.renderer.generateTexture(p);
    let particles = genParticles(baseTexture);

    document.body.appendChild(this.app.view);

    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    let _resize = () => {
      this.handleResize();
    };
    this._resize = _resize;
    window.addEventListener('resize', _resize);
    this.handleResize();

    this.app.stop();

    this.app.loader.add('strawberry', '/assets/images/sprites/strawberry.json');
    this.app.loader.add('orange', '/assets/images/sprites/orange.json');
    this.app.loader.add('lemon', '/assets/images/sprites/lemon.json');
    this.app.loader.add('banana', '/assets/images/sprites/banana.json');
    this.app.loader.add('watermelon', '/assets/images/sprites/watermelon.json');
    this.app.loader.add('cabbage', '/assets/images/sprites/cabbage.json');
    this.app.loader.add('shader', '/assets/shaders/shader.frag');

    this.app.loader.add('stars', '/assets/images/sprites/stars.json');
    this.app.loader.load((loader, res) => {
      this.filter = new PIXI.Filter(null, res.shader.data, {
        customUniform: 0.0,
      });

      this.animations.strawberry = res.strawberry.spritesheet.animations['strawberry2_wiggle.png'];
      this.animations.orange = res.orange.spritesheet.animations['orange.png'];
      this.animations.lemon = res.lemon.spritesheet.animations['lemon.webp'];
      this.animations.banana = res.banana.spritesheet.animations['banana.webp'];
      this.animations.watermelon = res.watermelon.spritesheet.animations['watermelon.webp'];
      this.animations.cabbage = res.cabbage.spritesheet.animations['cabbage.webp'];
      this.animations.stars = res.stars.spritesheet.animations['stars'];

      // Resume application update
      this.app.start();

      let count = 0;
      // Animate the filter
      this.app.ticker.add((delta) => {
        for (let particle of particles) {
          if (particle.y > 0) particle.x += particle.vx;
          particle.y += particle.vy;

          if (Math.random() > 0.9) particle.vx = update(particle.vx);
          // if (Math.random() > 0.9) particle.vy = Math.min(particle.vy + 1, UPPER_LIMIT_Y)
          if (particle.x > this.app.renderer.width || particle.x < 0 || particle.y > this.app.renderer.height)
            reset(particle);
        }
        this.app.renderer.render(drops);

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

  handleResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
