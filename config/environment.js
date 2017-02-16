/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'datafruits13',
    environment: environment,
    contentSecurityPolicy: { 'connect-src': "'self' http://localhost:3000 http://datafruits.streampusher.com http://datafruits.streampusher.com:8000 ws://hotdog-lounge.herokuapp.com ws://localhost:4000",
                             'media-src': "http://datafruits.streampusher.com:8000 http://relay.datafruits.fm:8000",
                             'script-src': "'self' http://www.youtube.com http://s.ytimg.com",
                             'child-src': "http://www.youtube.com"},
    //baseURL: '/',
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

    moment: {
      includeTimezone: "2010-2020"
    }
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
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.googleAnalytics = {
      webPropertyId: 'UA-28868734-1'
    };
  }

  if (environment == 'staging') {
  }

  return ENV;
};
