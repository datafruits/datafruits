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

  alphaFilterValue = 1.0;
  alphaFadeout = false;

  fruits = ['strawberry', 'lemon', 'orange', 'banana', 'watermelon'];

  paidFruitTipSprites = [];

  constructor() {
    super(...arguments);
    this.eventBus.subscribe('fruitTipped', this, 'addFruitTip');
  }

  metalPineappleAnimation() {
    console.log('metal pineapple!');
    let sprite = new PIXI.AnimatedSprite(this.animations['metalPineapple']);
    let text = new PIXI.Text('METAL PINEAPPLE', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: ['yellow', 'green', 'blue', 'pink'],
      align: 'center',
      dropShadow: true,
    });
    text.width = this.app.screen.width;
    text.height = this.app.screen.height;
    // text.x = this.app.screen.width / 2;
    // text.y = this.app.screen.height / 2;
    let noise = new PIXI.filters.NoiseFilter(0.2);

    text.filters = [this.filter, noise];
    this.app.stage.addChild(text);
    this.paidFruitTipSprites.pushObject(text);

    let blobSprite;
    for (let i = 0; i < 10; i++) {
      blobSprite = new PIXI.AnimatedSprite(this.animations['weirdBlobs']);
      blobSprite.x = Math.random() * this.app.screen.width;
      blobSprite.y = Math.random() * this.app.screen.height;
      blobSprite.scale.x = 0.25;
      blobSprite.scale.y = 0.25;
      blobSprite.animationSpeed = 0.15;
      //blobSprite.rotation = Math.floor(Math.random() * 360);
      let randomFrame = Math.floor(Math.random() * blobSprite.totalFrames);
      blobSprite.gotoAndPlay(randomFrame);
      this.app.stage.addChild(blobSprite);
      //sprite.filters = [this.filter];
      //this.sprites.pushObject(sprite);
      this.paidFruitTipSprites.pushObject(blobSprite);
    }

    let randomMetalPineapple;
    for (let i = 0; i < 5; i++) {
      randomMetalPineapple = new PIXI.AnimatedSprite(this.animations['metalPineapple']);
      randomMetalPineapple.x = Math.random() * this.app.screen.width;
      randomMetalPineapple.y = Math.random() * this.app.screen.height;
      randomMetalPineapple.scale.x = Math.random() * 1;
      randomMetalPineapple.scale.y = Math.random() * 1;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomMetalPineapple.gotoAndPlay(randomFrame);
      this.app.stage.addChild(randomMetalPineapple);
      this.paidFruitTipSprites.pushObject(randomMetalPineapple);
    }

    sprite.scale.x = 1;
    sprite.scale.y = 1;
    sprite.x = this.app.screen.width / 4;
    sprite.y = this.app.screen.height / 4;

    // sprite.animationSpeed = Math.random() * 2;
    // sprite.rotation = Math.floor(Math.random() * 360);
    let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
    sprite.gotoAndPlay(randomFrame);

    //sprite.filters = [this.filter];
    this.app.stage.addChild(sprite);
    this.paidFruitTipSprites.pushObject(sprite);

    later(() => {
      // kill everything after 5000 ms
      //this.app.stage.removeChild(text);
      //text.filters = [this.filter, this.alphaFilter];
      this.paidFruitTipSprites.forEach((sprite) => {
        sprite.filters = [noise, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 5000);
  }

  addFruitTip(event) {
    if (this.app) {
      let animation;
      if (event === 'metalPineapple') {
        return this.metalPineappleAnimation();
      } else if (this.fruits.includes(event)) {
        animation = event;
      } else {
        console.log(`invalid fruit: ${event}`); // eslint-disable-line no-console
        return;
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

      //sprite.filters = [this.filter];

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

    // const texture = PIXI.Texture.from(
    //   'https://cdn.glitch.com/a0abb6db-d8c2-490b-8aec-0a2161476024%2Fdxdf.png?v=1621918916353',
    // );
    //
    // const background = new PIXI.TilingSprite(texture, this.app.screen.width, this.app.screen.height);
    //
    // this.app.stage.addChild(background);

    this.app.loader.add('strawberry', '/assets/images/sprites/strawberry.json');
    this.app.loader.add('orange', '/assets/images/sprites/orange.json');
    this.app.loader.add('lemon', '/assets/images/sprites/lemon.json');
    this.app.loader.add('banana', '/assets/images/sprites/banana.json');
    this.app.loader.add('watermelon', '/assets/images/sprites/watermelon.json');
    this.app.loader.add('shader', '/assets/shaders/shader.frag');

    this.app.loader.add('stars', '/assets/images/sprites/stars.json');
    this.app.loader.add('weirdBlobs', '/assets/images/sprites/weird_blobs_1.json');
    this.app.loader.add('metalPineapple', '/assets/images/sprites/metal_pineapple.json');
    this.app.loader.load((loader, res) => {
      this.filter = new PIXI.Filter(null, res.shader.data, {
        customUniform: 0.0,
      });

      this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);

      this.animations.strawberry = res.strawberry.spritesheet.animations['strawberry2_wiggle.png'];
      this.animations.orange = res.orange.spritesheet.animations['orange.png'];
      this.animations.lemon = res.lemon.spritesheet.animations['lemon.png'];
      this.animations.banana = res.banana.spritesheet.animations['banana.png'];
      this.animations.watermelon = res.watermelon.spritesheet.animations['watermelon.png'];
      this.animations.stars = res.stars.spritesheet.animations['stars'];
      this.animations.weirdBlobs = res.weirdBlobs.spritesheet.animations['WEIRDBLOBS'];
      this.animations.metalPineapple = res.metalPineapple.spritesheet.animations['metal_pineapple.png'];

      //background.filters = [this.filter];

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

        if (this.alphaFadeout) {
          console.log(this.alphaFilterValue);
          this.alphaFilterValue = this.alphaFilterValue - 0.01;
          this.alphaFilter.alpha = this.alphaFilterValue;
        }
        if (this.alphaFilterValue <= 0) {
          console.log('alpha fadeout end');
          this.paidFruitTipSprites.forEach((sprite) => {
            this.app.stage.removeChild(sprite);
          });
          this.alphaFadeout = false;
          this.alphaFilterValue = 1.0;
          this.alphaFilter.alpha = this.alphaFilterValue;
        }
      });
    });
  }
}
