'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var fingerprintOptions = {
    enabled: true,
    exclude: ['assets/images/emojis/*']
  };

  var app = new EmberApp(defaults, {
    // Add options here
    fingerprint: fingerprintOptions,

    'ember-font-awesome': {
      useScss: true, // for ember-cli-sass
    },

    babel: {
      plugins: [ require('ember-auto-import/babel-plugin') ]
    },

    emberCliFontAwesome: {
      useScss: true
    },

    'ember-bootstrap': {
      'bootstrapVersion': 3,
      'importBootstrapFont': true,
      'importBootstrapCSS': false
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  // if (typeof FastBoot === 'undefined') {
  //   //app.import(app.bowerDirectory + '/jplayer/dist/jplayer/jquery.jplayer.js');
  //   app.import(app.bowerDirectory + '/jquery-textcomplete/dist/jquery.textcomplete.min.js');
  // }

  app.import('/vendor/emojione_autocomplete.css');

  app.import('/vendor/Condiment-Regular.ttf');

  return app.toTree();
};
