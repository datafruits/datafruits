'use strict';

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'datafruits13',
    environment: environment,
    contentSecurityPolicy: {
      'connect-src':
        "'self' http://localhost:3000 http://datafruits.streampusher.com http://datafruits.streampusher.com:8000 ws://hotdog-lounge.herokuapp.com ws://localhost:4000 https://vj.datafruits.fm",
      'media-src': 'http://datafruits.streampusher.com:8000 http://relay.datafruits.fm:8000',
      'script-src': "'self' http://www.youtube.com http://s.ytimg.com",
      'child-src': 'http://www.youtube.com',
    },
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    fastboot: {
      hostWhitelist: [
        'streampusher.com',
        'datafruits.streampusher.com',
        'datafruits.tumblr.com',
        'datafruits.fm',
        'www.datafruits.fm',
        /^localhost:\d+$/,
        /^(.*)\.herokuapp\.com/,
      ],
    },

    emberRollbarClient: {
      accessToken: process.env.ROLLBAR_TOKEN,
      // By default Rollbar logging is enabled in every environment except test and development.
      // Here is an example if you want to use it only in production
      enabled: environment === 'production',
      payload: {
        environment: environment,
        client: {
          javascript: {
            source_map_enabled: true,
            guess_uncaught_frames: true,
          },
        },
      },
    },

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-28868734-1',
          // Use `analytics_debug.js` in development
          //debug: environment === 'development',
          debug: false,
          // Use verbose tracing of GA events
          //trace: environment === 'development',
          trace: false,
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development',
        },
      },
    ],

    headTags: {
      card: {
        type: 'meta',
        attrs: {
          name: 'twitter:card',
          content: 'player',
        },
      },
      site: {
        type: 'meta',
        attrs: {
          name: 'twitter:site',
          content: '@datafruits',
        },
      },
      creator: {
        type: 'meta',
        attrs: {
          name: 'twitter:creator',
          content: '@datafruits',
        },
      },
      title: {
        type: 'meta',
        attrs: {
          name: 'twitter:title',
          content: `datafruits.fm`,
        },
      },
      description: {
        type: 'meta',
        attrs: {
          name: 'twitter:description',
          content: 'its just a website',
        },
      },
      player: {
        type: 'meta',
        attrs: {
          name: 'twitter:player',
          content: 'https://datafruits.fm/container',
        },
      },
      playerWidth: {
        type: 'meta',
        attrs: {
          name: 'twitter:player:width',
          content: '480',
        },
      },
      playerHeight: {
        type: 'meta',
        attrs: {
          name: 'twitter:player:height',
          content: '80',
        },
      },
    },

    CHAT_SOCKET_URL: process.env.CHAT_SOCKET_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    STREAM_HOST: process.env.STREAM_HOST,
    STREAM_NAME: process.env.STREAM_NAME,
    API_HOST: process.env.API_HOST,
  };

  ENV['ember-simple-auth'] = {
    routeAfterAuthentication: 'home',
  };

  // Heroku Git Hash support
  if (process.env.SOURCE_VERSION) {
    let packageJson = require('../package.json');
    let gitHash = process.env.SOURCE_VERSION.substr(0, 7);
    ENV.emberRollbarClient.payload.client.javascript['code_version'] = `${packageJson.version}+${gitHash}`;
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
      enabled: false,
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.APP.autoboot = false;
  }

  return ENV;
};
