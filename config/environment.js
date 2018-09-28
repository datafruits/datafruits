'use strict';

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'datafruits13',
    environment: environment,
    contentSecurityPolicy: { 'connect-src': "'self' http://localhost:3000 http://datafruits.streampusher.com http://datafruits.streampusher.com:8000 ws://hotdog-lounge.herokuapp.com ws://localhost:4000 https://api.tumblr.com",
                             'media-src': "http://datafruits.streampusher.com:8000 http://relay.datafruits.fm:8000",
                             'script-src': "'self' http://www.youtube.com http://s.ytimg.com",
                             'child-src': "http://www.youtube.com"},
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    fastboot: {
      hostWhitelist: ['streampusher.com', 'datafruits.streampusher.com', 'datafruits.tumblr.com', 'datafruits.fm', 'www.datafruits.fm', /^localhost:\d+$/]
    },

    moment: {
      includeTimezone: "subset"
    },

    i18n: {
      defaultLocale: 'en',
      defaultFallback: true
    },

    // rollbar: {
    //   accessToken: process.env.ROLLBAR_TOKEN,
    // },
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
          sendHitTask: environment !== 'development'
        }
      },
    ],


    CHAT_SOCKET_URL: process.env.CHAT_SOCKET_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    STREAM_HOST: process.env.STREAM_HOST,
    STREAM_NAME: process.env.STREAM_NAME
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment == 'staging') {
  }

  return ENV;
};
