/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var ES6Modules = require('broccoli-es6modules');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    fingerprint: {
      prepend: "//datafruitstest.s3-website-us-east-1.amazonaws.com/",
      exclude: ['datafruits']
    },
    emberCliFontAwesome: {
      useScss: true
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
  app.import(app.bowerDirectory + '/bootstrap/dist/js/bootstrap.js');
  app.import(app.bowerDirectory + '/bootstrap/dist/css/bootstrap.css');
  app.import(app.bowerDirectory + '/moment/moment.js');
  app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.css');
  app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.js');
  app.import(app.bowerDirectory + '/jplayer/dist/jplayer/jquery.jplayer.js');
  app.import(app.bowerDirectory + '/jsTimezoneDetect/jstz.min.js');
  app.import(app.bowerDirectory + '/moment-timezone/builds/moment-timezone-with-data-2010-2020.js');
  app.import(app.bowerDirectory + '/emojione/assets/css/emojione.css');
  app.import(app.bowerDirectory + '/emojione/lib/js/emojione.js');
  app.import(app.bowerDirectory + '/autolink/autolink-min.js');
  app.import(app.bowerDirectory + '/jquery-textcomplete/dist/jquery.textcomplete.min.js');
  app.import('/vendor/emojione_autocomplete.css');

  var phoenixTree = "./vendor/phoenix";
  var phoenixAmdFiles = new ES6Modules(phoenixTree, {
    format: 'amd',
    esperantoOptions: {
      strict: true,
      amdName: "phoenix"
    }
  });
  var phoenixTranspiledFiles = esTranspiler(phoenixAmdFiles, {});

  return mergeTrees([app.toTree(), phoenixTranspiledFiles]);
};
