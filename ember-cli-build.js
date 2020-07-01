"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  var fingerprintOptions = {
    enabled: true,
    exclude: ["assets/images/emojis/*"],
  };

  var app = new EmberApp(defaults, {
    // Add options here
    fingerprint: fingerprintOptions,

    hinting: false,

    "ember-font-awesome": {
      useScss: true, // for ember-cli-sass
    },

    "bundle-analyzer": {
      ignore: ["*fastboot*"],
    },

    babel: {
      plugins: [require("ember-auto-import/babel-plugin")],
    },

    emberCliFontAwesome: {
      useScss: true,
    },

    "esw-cache-first": {
      patterns: ["fonts/fontawesome(.+)"],
      version: "1",
    },

    "esw-cache-fallback": {
      patterns: [
        "https://datafruits.streampusher.com/(.+)",
        "https://dongles.streampusher-relay.club/(.+)",
      ],
    },
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

  app.import("/vendor/hinted-Debussy.woff2");
  app.import("/vendor/hinted-Debussy.woff");
  app.import("node_modules/video.js/dist/video-js.min.css");

  return app.toTree();
};
