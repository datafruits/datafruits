'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const urlFinder = require('./urlFinder.js');
const isProduction = EmberApp.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      // add extra paths here for components/controllers which include tailwind classes
      './app/index.html',
      './app/templates/**/*.hbs',
      './app/components/**/*.hbs',
    ],
    defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/.]+/g) || [],
  },
};

module.exports = function (defaults) {
  var fingerprintOptions = {
    enabled: true,
    exclude: ['assets/images/emojis/*', 'assets/images/sprites/*', 'assets/images/lv*_fruit.gif', 'assets/images/big_cow.png'],
  };

  let app = new EmberApp(defaults, {
    newVersion: {
      enabled: true,
      useAppVersion: true,
    },

    prember: isProduction ? {
      urls: urlFinder,
    } : {
      enabled: false,
    },

    // Add options here
    fingerprint: fingerprintOptions,

    hinting: false,

    babel: {
      plugins: [require('ember-auto-import/babel-plugin')],
    },

    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },

    // emberCliFontAwesome: {
    //   useScss: true,
    // },

    // 'ember-service-worker': {
    //   versionStrategy: 'every-build',
    // },
    //
    // 'esw-cache-fallback': {
    //   patterns: ['https://datafruits.streampusher.com/(.+)', 'https://dongles.streampusher-relay.club/(.+)'],
    // },

    postcssOptions: {
      compile: {
        extension: 'scss',
        enabled: true,
        parser: require('postcss-scss'),
        plugins: [
          {
            module: require('@csstools/postcss-sass'),
            options: {
              includePaths: ['node_modules/ember-power-select'],
            },
          },
          require('tailwindcss')('./app/tailwind/config.js'),
          ...(isProduction ? [purgeCSS] : []),
        ],
      },
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

  app.import('/vendor/hinted-Debussy.woff2');
  app.import('/vendor/hinted-Debussy.woff');
  app.import('/vendor/TopazPlus_a1200.woff2');
  app.import('node_modules/video.js/dist/video-js.min.css');

  return app.toTree();
};
