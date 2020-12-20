import Component from '@glimmer/component';
import { action } from '@ember/object';
import * as PIXI from 'pixi.js';

export default class PixiComponent extends Component {
  filter;
  background;
  app;

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

    //Create a Pixi Application
    this.app = new PIXI.Application({
      autoResize: true,
      resolution: devicePixelRatio,
      transparent: true,
    });

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(this.app.view);

    // Create background image
    //const background = PIXI.Sprite.from('https://cdn.glitch.com/ea97b047-b141-4edc-8fee-cabd43a14644%2Fiphone_girl_3d_2.png0001.png?v=1590408055180');
    const texture = PIXI.Texture.from(
      'https://cdn.glitch.com/ea97b047-b141-4edc-8fee-cabd43a14644%2Fiphone_girl_small.png?v=1590408472784',
    );

    this.background = new PIXI.TilingSprite(texture, this.app.screen.width, this.app.screen.height);
    this.app.stage.addChild(this.background);

    // move this into resize handler later
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
    //background.position.set(0, 0);
    this.background.width = this.app.screen.width;
    this.background.height = this.app.screen.height;
    // end resize handler
    //
    //
    this.app.stop();

    this.app.loader.add('shader', 'assets/shaders/shader.frag').load((loader, res) => {
      // Create the new filter, arguments: (vertexShader, framentSource)
      this.filter = new PIXI.Filter(null, res.shader.data, {
        customUniform: 0.0,
      });

      // === WARNING ===
      // specify uniforms in filter constructor
      // or set them BEFORE first use
      // filter.uniforms.customUniform = 0.0

      // Add the filter
      this.background.filters = [this.filter];
      //text.filters = [filter];

      // Resume application update
      this.app.start();

      let count = 0;
      // Animate the filter
      this.app.ticker.add((delta) => {
        this.filter.uniforms.customUniform += delta;

        count += 0.02;
        this.background.tileScale.x = 2 + Math.sin(count);
        this.background.tileScale.y = 2 + Math.cos(count);

        this.background.tilePosition.x += 1;
        this.background.tilePosition.y += 1;
      });
    });
  }
}
