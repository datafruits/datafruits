// snow from https://codepen.io/jh3y/pen/VdMBaR
import Component from '@glimmer/component';
import { action } from '@ember/object';
import * as PIXI from 'pixi.js';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

// fruits
import fruitTypes from '../fruit-types'

// animations
import MetalPineapple from './pixi/animations/metal-pineapple';
import RealLemoner from './pixi/animations/real-lemoner';
import GigaShrimpshake from './pixi/animations/giga-shrimpshake';
import TheRavers from './pixi/animations/the-ravers';
import MegaBeamsprout from './pixi/animations/mega-beamsprout';
import FruitSmoothie from './pixi/animations/fruit-smoothie';
import TreasureOpen from './pixi/animations/treasure-open';

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

  fruitSummons = [];

  alphaFilterValue = 1.0;
  alphaFadeout = false;

  fruits = fruitTypes
    .filter(fruit => fruit.cost === 0)
    .map(fruit => fruit.name);

  constructor() {
    super(...arguments);
    this.eventBus.subscribe("fruitTipped", this, "addFruitTip");
    this.eventBus.subscribe("weatherChanged", this, "reinitPixi");
    this.eventBus.subscribe("treasureOpened", this, "treasureOpened");
  }

  treasureOpened(treasureName) {
    console.log('got treasureOpened event: ', treasureName);
    let treasureOpen = new TreasureOpen(this.app, this.animations, { customFilter: this.filter, noiseFilter: this.noiseFilter }, treasureName);
    this.fruitSummons.push(treasureOpen);
  }

  addFruitTip(event) {
    if (this.app) {
      let animation;
      if (event === "metal-pineapple") {
        let metalPineapple = new MetalPineapple(this.app, this.animations, { customFilter: this.filter, noiseFilter: this.noiseFilter });
        this.fruitSummons.push(metalPineapple);
        return metalPineapple;
      } else if (event === "real-lemoner") {
        let realLemoner = new RealLemoner(this.app, this.animations, { customFilter: this.filter, noiseFilter: this.noiseFilter });
        this.fruitSummons.push(realLemoner);
        return realLemoner;
      } else if (event === "mega-beamsprout") {
        let megaBeamsprout = new MegaBeamsprout(this.app, this.animations, { customFilter: this.filter, noiseFilter: this.noiseFilter });
        this.fruitSummons.push(megaBeamsprout);
        return megaBeamsprout;
      } else if (event === "giga-shrimpshake") {
        let gigaShrimpshake = new GigaShrimpshake(this.app, this.animations, { customFilter: this.filter, noiseFilter: this.noiseFilter });
        this.fruitSummons.push(gigaShrimpshake);
        return gigaShrimpshake;
      } else if (event === "the-ravers") {
        let theRavers = new TheRavers(this.app, this.animations, this.textures, { customFilter: this.filter, noiseFilter: this.noiseFilter });
        this.fruitSummons.push(theRavers);
        return theRavers;
      } else if (event === "fruit-smoothie") {
        let fruitSmoothie = new FruitSmoothie(this.app, this.animations, this.fruits, { customFilter: this.filter, noiseFilter: this.noiseFilter });
        this.fruitSummons.push(fruitSmoothie);
        return fruitSmoothie;
      } else if (this.fruits.includes(event)) {
        animation = event;
      } else {
        console.log(`invalid fruit: ${event}`);
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

      this.sprites.push(sprite);
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
      console.log("pixi.js wasn't initialized...");
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

    // TODO loop over fruits to do this
    this.fruits.forEach(fruit => {
      console.log('loading fruit: ', fruit);
      this.app.loader.add(fruit, `/assets/images/sprites/${fruit}.json`);
    })

    // TODO
    // this.app.loader.add(
    //   "dragionFruit",
    //   "/assets/images/sprites/dragon_fruit.json",
    // );

    this.app.loader.add("megaBeamsprout", "/assets/images/sprites/mega_beamsprout.json");

    this.app.loader.add(
      "treasureChestGlorpOpen",
      "/assets/images/sprites/treasure_chest_glorp_open.json"
    );

    this.app.loader.add(
      "treasureChestBonezoOpen",
      "/assets/images/sprites/treasure_chest_bonezo_open.json"
    );

    this.app.loader.add(
      "treasureChestFruitTicketsOpen",
      "/assets/images/sprites/treasure_chest_fruit_tickets_open.json"
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
      this.noiseFilter = new PIXI.filters.NoiseFilter(0.2);

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
      this.animations["dragion-fruit"] =
        res["dragion-fruit"].spritesheet.animations["dragon_fruit.png"];
      this.animations.blueberrinies =
        res.blueberrinies.spritesheet.animations["blueberrinies.png"];

      this.animations.peachy =
        res.peachy.spritesheet.animations["peachy"];

      this.animations.canteloper = res.canteloper.spritesheet.animations["canteloper"];

      this.animations.megaBeamsprout = res.megaBeamsprout.spritesheet.animations["beamsprout_spin"];
      this.animations.treasureChestGlorpOpen = res.treasureChestGlorpOpen.spritesheet.animations["treasure_chest_open_glorp"];
      this.animations.treasureChestBonezoOpen = res.treasureChestBonezoOpen.spritesheet.animations["treasure_chest_open_bonezo"];
      this.animations.treasureChestFruitTicketsOpen = res.treasureChestFruitTicketsOpen.spritesheet.animations["treasure_chest_open_fruit_tickets"];

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
        this.fruitSummons.forEach(fruitSummon => {
          if(fruitSummon.finished) {
            this.fruitSummons.splice(this.fruitSummons.indexOf(fruitSummon), 1);
          } else {
            fruitSummon.update(delta, this.app);
          }
        });
        // TODO remove expired fruitSummon from array
        //
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

        if (this.alphaFadeout) {
          this.alphaFilterValue = this.alphaFilterValue - 0.01;
          this.alphaFilter.alpha = this.alphaFilterValue;
        }
        if (this.alphaFilterValue <= 0) {
          console.log("alpha fadeout end");
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
