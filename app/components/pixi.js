// snow from https://codepen.io/jh3y/pen/VdMBaR
import Component from '@glimmer/component';
import { action } from '@ember/object';
import * as PIXI from 'pixi.js';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default class PixiComponent extends Component {
  @service eventBus;
  @service weather;

  lastWeather = this.weather.currentWeather;
  firstInit = true;

  filter;
  background;
  app;
  sprites = [];
  animations = {};
  textures = {};

  alphaFilterValue = 1.0;
  alphaFadeout = false;

  // TODO should these be pulled from fruit-types.ts ???
  fruits = [
    "strawberry",
    "lemon",
    "orange",
    "banana",
    "watermelon",
    "cabbage",
    "beamsprout",
    "pineapple",
    "limer",
    "dragion-fruit",
    "blueberrinies",
    "peachy",
  ];

  paidFruitTipSprites = [];

  raverSprites = [];

  constructor() {
    super(...arguments);
    this.eventBus.subscribe("fruitTipped", this, "addFruitTip");
    this.eventBus.subscribe("weatherChanged", this, "reinitPixi");
  }

  theRavers() {
    let blobSprite;
    for (let i = 0; i < 10; i++) {
      blobSprite = new PIXI.AnimatedSprite(this.animations["weirdBlobs"]);
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

    const ravers = [
      "alandmoosleech",
      "burger_girl",
      "chill_ghost_shirt_guy",
      "maskedburgerweirdo",
      "maybe_kamaida",
      "petscop",
      "rainbowglorpy",
      "sportsjin",
      "wormy"
    ];
    ravers.forEach((raver) => {
      let sprite = new PIXI.Sprite(this.textures[raver]);

      sprite.scale.x = 0.25;
      sprite.scale.y = 0.25;
      sprite.x = Math.random() * this.app.screen.width;
      sprite.y = Math.random() * this.app.screen.height;
      this.raverSprites.push(sprite);
      this.app.stage.addChild(sprite);
      this.paidFruitTipSprites.pushObject(sprite);

    });

    let noise = new PIXI.filters.NoiseFilter(0.2);

    later(() => {
      // kill everything after 5000 ms
      //this.app.stage.removeChild(text);
      //text.filters = [this.filter, this.alphaFilter];
      this.paidFruitTipSprites.forEach((sprite) => {
        sprite.filters = [noise, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 5000);

    const element = document.getElementsByTagName('body')[0];
    element.classList.remove('screen-shake');
    // https://css-tricks.com/restart-css-animation/
    void element.offsetWidth;
    element.classList.add('screen-shake');
  }

  metalPineappleAnimation() {
    console.log("metal pineapple!");
    let sprite = new PIXI.AnimatedSprite(this.animations["metalPineapple"]);
    let text = new PIXI.Text("METAL PINEAPPLE", {
      fontFamily: "Arial",
      fontSize: 48,
      fill: ["yellow", "green", "blue", "pink"],
      align: "center",
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
      blobSprite = new PIXI.AnimatedSprite(this.animations["weirdBlobs"]);
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
      randomMetalPineapple = new PIXI.AnimatedSprite(
        this.animations["metalPineapple"],
      );
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

    const element = document.getElementsByTagName('body')[0];
    element.classList.remove('screen-shake');
    // https://css-tricks.com/restart-css-animation/
    void element.offsetWidth;
    element.classList.add('screen-shake');
  }

  realLemonerAnimation() {
    let sprite = new PIXI.AnimatedSprite(this.animations["realLemoner"]);
    let text = new PIXI.Text("LEMONER IS REAL", {
      fontFamily: "Arial",
      fontSize: 48,
      fill: ["yellow", "green", "blue", "pink"],
      align: "center",
      dropShadow: true,
    });
    text.width = this.app.screen.width;
    text.height = this.app.screen.height;
    let noise = new PIXI.filters.NoiseFilter(0.2);

    text.filters = [this.filter, noise];
    this.app.stage.addChild(text);
    this.paidFruitTipSprites.pushObject(text);

    let blobSprite;
    for (let i = 0; i < 15; i++) {
      blobSprite = new PIXI.AnimatedSprite(this.animations["weirdBlobs"]);
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

    let randomRealLemoner;
    for (let i = 0; i < 5; i++) {
      randomRealLemoner = new PIXI.AnimatedSprite(
        this.animations["realLemoner"],
      );
      randomRealLemoner.x = Math.random() * this.app.screen.width;
      randomRealLemoner.y = Math.random() * this.app.screen.height;
      randomRealLemoner.scale.x = Math.random() * 1;
      randomRealLemoner.scale.y = Math.random() * 1;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomRealLemoner.gotoAndPlay(randomFrame);
      this.app.stage.addChild(randomRealLemoner);
      this.paidFruitTipSprites.pushObject(randomRealLemoner);
    }

    sprite.scale.x = 1;
    sprite.scale.y = 1;
    sprite.x = this.app.screen.width / 4;
    sprite.y = this.app.screen.height / 4;

    sprite.animationSpeed = 0.25;
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

    const element = document.getElementsByTagName('body')[0];
    element.classList.remove('screen-shake');
    // https://css-tricks.com/restart-css-animation/
    void element.offsetWidth;
    element.classList.add('screen-shake');
  }

  gigaShrimpshake() {
    console.log("GIGA shrimpshake");
    // gold shrimp, blue shrimp
    // giant purple shrimp shake
    let sprite = new PIXI.AnimatedSprite(this.animations["gigaShrimpshake"]);
    let noise = new PIXI.filters.NoiseFilter(0.2);

    let textSprite = new PIXI.AnimatedSprite(this.animations["gigaShrimpshakeText"]);
    let blobSprite;
    for (let i = 0; i < 15; i++) {
      blobSprite = new PIXI.AnimatedSprite(this.animations["weirdBlobs"]);
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

    let randomGigaShrimpshake;
    for (let i = 0; i < 25; i++) {
      randomGigaShrimpshake = new PIXI.AnimatedSprite(
        this.animations["gigaShrimpshake"],
      );
      randomGigaShrimpshake.x = Math.random() * this.app.screen.width;
      randomGigaShrimpshake.y = Math.random() * this.app.screen.height;
      const randomScale = Math.random() * 1;
      randomGigaShrimpshake.scale.x = randomScale;
      randomGigaShrimpshake.scale.y = randomScale;
      randomGigaShrimpshake.tint = Math.random() * 0xFFFFFF;

      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomGigaShrimpshake.gotoAndPlay(randomFrame);
      this.app.stage.addChild(randomGigaShrimpshake);
      this.paidFruitTipSprites.pushObject(randomGigaShrimpshake);
    }

    let randomBlueShrimp;
    for (let i = 0; i < 100; i++) {
      randomBlueShrimp = new PIXI.AnimatedSprite(
        this.animations["blueShrimp"],
      );
      randomBlueShrimp.x = Math.random() * this.app.screen.width;
      randomBlueShrimp.y = Math.random() * this.app.screen.height;
      const randomScale = Math.random() * 5;
      const flippedChance = Math.random() * 100;
      if(flippedChance >= 50) {
        randomBlueShrimp.scale.x = -randomScale;
      } else {
        randomBlueShrimp.scale.x = randomScale;
      }
      randomBlueShrimp.scale.y = randomScale;
      randomBlueShrimp.tint = Math.random() * 0xFFFFFF;

      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomBlueShrimp.gotoAndPlay(randomFrame);
      this.app.stage.addChild(randomBlueShrimp);
      this.paidFruitTipSprites.pushObject(randomBlueShrimp);
    }

    sprite.scale.x = 1;
    sprite.scale.y = 1;
    sprite.x = this.app.screen.width / 4;
    sprite.y = this.app.screen.height / 4;

    sprite.animationSpeed = 0.25;
    let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
    sprite.gotoAndPlay(randomFrame);

    //sprite.filters = [this.filter];
    this.app.stage.addChild(sprite);
    this.paidFruitTipSprites.pushObject(sprite);

    textSprite.x = this.app.screen.width / 4;
    textSprite.y = this.app.screen.height / 4;
    textSprite.gotoAndPlay(0);
    this.app.stage.addChild(textSprite);
    this.paidFruitTipSprites.pushObject(textSprite);


    later(() => {
      // kill everything after 5000 ms
      //this.app.stage.removeChild(text);
      //text.filters = [this.filter, this.alphaFilter];
      this.paidFruitTipSprites.forEach((sprite) => {
        sprite.filters = [noise, this.alphaFilter];
      });
      this.alphaFadeout = true;
    }, 5000);

    // screenshake
    const element = document.getElementsByTagName('body')[0];
    element.classList.remove('screen-shake');
    // https://css-tricks.com/restart-css-animation/
    void element.offsetWidth;
    element.classList.add('screen-shake');
  }

  megaBeamsprout() {
    console.log("MEGA beamsprout!");
    let sprite = new PIXI.AnimatedSprite(this.animations["megaBeamsprout"]);
    let text = new PIXI.Text("MEGA BEAMSPROUT", {
      fontFamily: "Arial",
      fontSize: 48,
      fill: ["yellow", "green", "blue", "pink"],
      align: "center",
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
      blobSprite = new PIXI.AnimatedSprite(this.animations["weirdBlobs"]);
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

    let randomMegaBeamsprout;
    for (let i = 0; i < 5; i++) {
      randomMegaBeamsprout = new PIXI.AnimatedSprite(
        this.animations["metalPineapple"],
      );
      randomMegaBeamsprout.x = Math.random() * this.app.screen.width;
      randomMegaBeamsprout.y = Math.random() * this.app.screen.height;
      randomMegaBeamsprout.scale.x = Math.random() * 1;
      randomMegaBeamsprout.scale.y = Math.random() * 1;
      let randomFrame = Math.floor(Math.random() * sprite.totalFrames);
      randomMegaBeamsprout.gotoAndPlay(randomFrame);
      this.app.stage.addChild(randomMegaBeamsprout);
      this.paidFruitTipSprites.pushObject(randomMegaBeamsprout);
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
      if (event === "metal-pineapple") {
        return this.metalPineappleAnimation();
      } else if (event === "real-lemoner") {
        return this.realLemonerAnimation();
      } else if (event === "mega-beamsprout") {
        return this.megaBeamsprout();
      } else if (event === "giga-shrimpshake") {
        return this.gigaShrimpshake();
      } else if (event === "the-ravers") {
        return this.theRavers();
      } else if (this.fruits.includes(event)) {
        animation = event.replace(/-./g, (x) => x[1].toUpperCase());
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

        let starSprite = new PIXI.AnimatedSprite(this.animations["stars"]);
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

  initWeather(sprites, amount) {
    const UPPER_LIMIT_Y = 10;
    const UPPER_LIMIT_X = 2;
    const LOWER_LIMIT_X = -2;

    // Reset particle start points based on screen
    const reset = (p) => {
      p.x = floored(this.app.renderer.width);
      p.y = -(p.size + floored(this.app.renderer.height));
      p.vy = floored(UPPER_LIMIT_Y) + 2;
    };

    // Update value by either subtracting to adding
    const update = (p) =>
      Math.random() > 0.5
        ? Math.max(LOWER_LIMIT_X, p - 1)
        : Math.min(p + 1, UPPER_LIMIT_X);

    const floored = (v) => Math.floor(Math.random() * v);

    // Create particle container container
    let particleContainers = [];
    let particles = [];
    for (let sprite of sprites) {
      let drops = new PIXI.ParticleContainer(amount, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
      });

      const genParticles = (fn) =>
        Array.from({length: amount}, () => {
          // select a random element
          let sprite = fn();
          drops.addChild(sprite);
          return sprite;
        })

      this.app.stage.addChild(drops);
      particles = particles.concat(genParticles(sprite));
      particleContainers.push(drops);
    }

    return [particles, reset, update, particleContainers];
  }

  @action
  didInsert() {
    this.initPixi();
  }

  reinitPixi() {
    this.app.destroy();
    this.initPixi();
  }

  initPixi() {
    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas";
    }

    PIXI.utils.sayHello(type);

    this.app = new PIXI.Application({
      view: document.getElementById("pixi"),
      autoResize: true,
      resolution: devicePixelRatio,
      backgroundAlpha: 0,
    });

    let thisWeather = this.weather.currentWeather;
    let particles, reset, update, drops;

    if (this.firstInit || thisWeather !== this.lastWeather) {
      const floored = (v) => Math.floor(Math.random() * v);
      const maybeFlip = () => floored(2) ? -1 : 1;
      const UPPER_LIMIT_Y = 10;
      const UPPER_LIMIT_X = 2;
      const MAX_SIZE = 2;
      const MIN_SIZE = 0.25;
      const SIZE = floored(MAX_SIZE) + MIN_SIZE;

      switch (thisWeather) {
        case "snowy": {
          // lil' snow factory
          const snowSprite = () => {
            const g = new PIXI.Graphics();
            g.beginFill(0xffffff);
            g.drawCircle(0, 0, 100);
            g.endFill();

            // Generate snow texture
            const texture = this.app.renderer.generateTexture(g);

            const s = new PIXI.Sprite(texture);
            s.size = SIZE;
            s.vx = floored(UPPER_LIMIT_X) - UPPER_LIMIT_X;
            s.vy = floored(UPPER_LIMIT_Y) + 2;
            s.alpha = Math.random();
            s.x = snowSprite.startX = floored(this.app.renderer.width);
            s.y = snowSprite.startY = -(SIZE + floored(this.app.renderer.height));
            s.scale.x = 0.05;
            s.scale.y = 0.05;
            return s
          }

          [particles, reset, update, drops] = this.initWeather([snowSprite], 1000);
          break;
        }
        case "cats-dogs": {
          const dogSprite = () => {
            const d = PIXI.Sprite.from("/assets/images/sprites/dog_rain.png");
            d.size = SIZE;
            d.vx = floored(UPPER_LIMIT_X) - UPPER_LIMIT_X;
            d.vy = floored(UPPER_LIMIT_Y) + 2;
            d.alpha = Math.random();
            d.x = d.startX = floored(this.app.renderer.width);
            d.y = d.startY = -(SIZE + floored(this.app.renderer.height));
            d.scale.x = 0.5 * maybeFlip();
            d.scale.y = 0.5;
            return d;
          }

          const catSprite = () => {
            const c = PIXI.Sprite.from("/assets/images/sprites/cat_rain.png");
            c.size = SIZE;
            c.vx = floored(UPPER_LIMIT_X) - UPPER_LIMIT_X;
            c.vy = floored(UPPER_LIMIT_Y) + 2;
            c.alpha = Math.random();
            c.x = c.startX = floored(this.app.renderer.width);
            c.y = c.startY = -(SIZE + floored(this.app.renderer.height));
            c.scale.x = 0.5 * maybeFlip();
            c.scale.y = 0.5;
            return c;
          }

          [particles, reset, update, drops] = this.initWeather([catSprite, dogSprite], 500);
          break;
        }
        default:
          break;
      }
      this.lastWeather = thisWeather;
      this.firstInit = false;
    }

    document.body.appendChild(this.app.view);

    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    let _resize = () => {
      this.handleResize();
    };
    this._resize = _resize;
    window.addEventListener("resize", _resize);
    this.handleResize();

    this.app.stop();

    this.app.loader.add("strawberry", "/assets/images/sprites/strawberry.json");
    this.app.loader.add("orange", "/assets/images/sprites/orange.json");
    this.app.loader.add("lemon", "/assets/images/sprites/lemon.json");
    this.app.loader.add("banana", "/assets/images/sprites/banana.json");
    this.app.loader.add("watermelon", "/assets/images/sprites/watermelon.json");
    this.app.loader.add("cabbage", "/assets/images/sprites/cabbage.json");
    this.app.loader.add("beamsprout", "/assets/images/sprites/beamsprout.json");
    this.app.loader.add("pineapple", "/assets/images/sprites/pineapple.json");
    this.app.loader.add("limer", "/assets/images/sprites/lime.json");
    this.app.loader.add(
      "dragionFruit",
      "/assets/images/sprites/dragon_fruit.json",
    );

    this.app.loader.add(
      "blueberrinies",
      "/assets/images/sprites/blueberrinies.json",
    );

    this.app.loader.add(
      "peachy",
      "/assets/images/sprites/peachy.json",
    );
    this.app.loader.add("shader", "/assets/shaders/shader.frag");

    this.app.loader.add("stars", "/assets/images/sprites/stars.json");
    this.app.loader.add(
      "weirdBlobs",
      "/assets/images/sprites/weird_blobs_1.json",
    );
    this.app.loader.add(
      "metalPineapple",
      "/assets/images/sprites/metal_pineapple.json",
    );
    this.app.loader.add(
      "realLemoner",
      "/assets/images/sprites/real_lemoner_3d.json",
    );
    this.app.loader.add(
      "gigaShrimpshake",
      "/assets/images/sprites/giga_shrimpshake.json",
    );
    this.app.loader.add(
      "gigaShrimpshakeText",
      "/assets/images/sprites/giga_shrimpshake_text.json",
    );
    this.app.loader.add(
      "blueShrimp",
      "/assets/images/sprites/blue_shrimp.json",
    );

    this.app.loader.add(
      "alandmoosleech",
      "/assets/images/alandmoosleech.png"
    );
    this.app.loader.add(
      "burger_girl",
      "/assets/images/burger_girl.png"
    );
    this.app.loader.add(
      "chill_ghost_shirt_guy",
      "/assets/images/chill_ghost_shirt_guy.png"
    );
    this.app.loader.add(
      "maskedburgerweirdo",
      "/assets/images/maskedburgerweirdo.png"
    );
    this.app.loader.add(
      "maybe_kamaida",
      "/assets/images/maybe_kamaida.png"
    );
    this.app.loader.add(
      "petscop",
      "/assets/images/petscop.png"
    );
    this.app.loader.add(
      "rainbowglorpy",
      "/assets/images/rainbowglorpy.png"
    );
    this.app.loader.add(
      "sportsjin",
      "/assets/images/sportsjin.png"
    );
    this.app.loader.add(
      "wormy",
      "/assets/images/wormy.png"
    );

    this.app.loader.onProgress.add((loader, resource) => {
      console.log(`Loading ${resource.name}: ${loader.progress}%`);
    });

    this.app.loader.onError.add((error) => {
      console.error(`PIXI Loader Error: ${error}`);
    });

    this.app.loader.load((loader, res) => {
      console.log(res);
      this.filter = new PIXI.Filter(null, res.shader.data, {
        customUniform: 0.0,
      });

      this.alphaFilter = new PIXI.filters.AlphaFilter(1.0);

      this.animations.strawberry =
        res.strawberry.spritesheet.animations["strawberry2_wiggle.png"];
      this.animations.orange = res.orange.spritesheet.animations["orange.png"];
      this.animations.lemon = res.lemon.spritesheet.animations["lemon.webp"];
      this.animations.banana = res.banana.spritesheet.animations["banana.webp"];
      this.animations.watermelon =
        res.watermelon.spritesheet.animations["watermelon.webp"];
      this.animations.cabbage =
        res.cabbage.spritesheet.animations["cabbage.webp"];
      this.animations.beamsprout =
        res.beamsprout.spritesheet.animations["beamsprout"];
      this.animations.stars = res.stars.spritesheet.animations["stars"];
      this.animations.weirdBlobs =
        res.weirdBlobs.spritesheet.animations["WEIRDBLOBS"];
      this.animations.metalPineapple =
        res.metalPineapple.spritesheet.animations["metal_pineapple.png"];
      this.animations.realLemoner =
        res.realLemoner.spritesheet.animations["real_lemoner_3d"];
      this.animations.gigaShrimpshake =
        res.gigaShrimpshake.spritesheet.animations["giga_shrimpshake"];
      this.animations.blueShrimp = res.blueShrimp.spritesheet.animations["shrimp_float.png"];
      this.animations.gigaShrimpshakeText =
        res.gigaShrimpshakeText.spritesheet.animations["giga_shrimp_shake_text"];
      this.animations.pineapple =
        res.pineapple.spritesheet.animations["pineapple_anim.png"];
      this.animations.limer = res.limer.spritesheet.animations["limer.png"]; // TODO
      this.animations.dragionFruit =
        res.dragionFruit.spritesheet.animations["dragon_fruit.png"];
      this.animations.blueberrinies =
        res.blueberrinies.spritesheet.animations["blueberrinies.png"];
      
      this.animations.peachy =
        res.peachy.spritesheet.animations["peachy"];

      this.textures.alandmoosleech = PIXI.Texture.from(res.alandmoosleech.url);
      this.textures.burger_girl = PIXI.Texture.from(res.burger_girl.url);
      this.textures.chill_ghost_shirt_guy = PIXI.Texture.from(res.chill_ghost_shirt_guy.url);
      this.textures.maskedburgerweirdo = PIXI.Texture.from(res.maskedburgerweirdo.url);
      this.textures.maybe_kamaida = PIXI.Texture.from(res.maybe_kamaida.url);
      this.textures.petscop = PIXI.Texture.from(res.petscop.url);
      this.textures.rainbowglorpy = PIXI.Texture.from(res.rainbowglorpy.url);
      this.textures.sportsjin = PIXI.Texture.from(res.sportsjin.url);
      this.textures.wormy = PIXI.Texture.from(res.wormy.url);

      // Resume application update
      this.app.start();

      let count = 0;
      this.app.ticker.add((delta) => {
        if (particles && ["snowy", "cats-dogs"].includes(this.weather.currentWeather)) {
          for (let particle of particles) {
            if (particle.y > 0) particle.x += particle.vx;
            particle.y += particle.vy;

            if (Math.random() > 0.9) particle.vx = update(particle.vx);
            // if (Math.random() > 0.9) particle.vy = Math.min(particle.vy + 1, UPPER_LIMIT_Y)
            if (
              particle.x > this.app.renderer.width ||
              particle.x < 0 ||
              particle.y > this.app.renderer.height
            )
              reset(particle);
          }
          for (let drop of drops) {
            this.app.renderer.render(drop);
          }
        }

        this.filter.uniforms.customUniform += delta;

        count += 0.02 * delta;

        this.sprites.forEach((sprite) => {
          sprite.x += Math.sin(count);
          sprite.y += Math.cos(count);
          sprite.scale.x += Math.sin(count) * 0.01;
          sprite.scale.y += Math.sin(count) * 0.01;
          sprite.rotation += Math.sin(count) * 0.01;
        });

        this.raverSprites.forEach((sprite) => {
          sprite.x += Math.sin(count);
          sprite.y += Math.cos(count);
        });

        if (this.alphaFadeout) {
          //console.log(this.alphaFilterValue);
          this.alphaFilterValue = this.alphaFilterValue - 0.01;
          this.alphaFilter.alpha = this.alphaFilterValue;
        }
        if (this.alphaFilterValue <= 0) {
          console.log("alpha fadeout end");
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

  handleResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PixiComponent: typeof PixiComponent;
  }
}
