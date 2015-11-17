import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver,
  ready: function() {
    setTimeout(function(){
      checkTwitch();
    }, 500);

    setInterval(function(){
      checkTwitch();
    }, 2500);
  }
});

loadInitializers(App, config.modulePrefix);

export default App;

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[<>"']/g, function (s) {
    return entityMap[s];
  });
}

var imgRegex = /https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|gif|png)/;

var vjIsLive = false;
var showingVj = false;

function showVJ(){
  showingVj = true;
  $('#livestream').show();
}

function hideVJ(){
  showingVj = false;
  $('#livestream').hide();
}

function checkTwitch(){
  $.getJSON('https://api.twitch.tv/kraken/streams/datafruits.json?callback=?', function(data){
    if(data.stream === null) {
      console.log('no live VJ');
      vjIsLive = false;
      if(showingVj === true){
        hideVJ();
      }
    }else {
      console.log('live stream!');
      vjIsLive = true;
      if(showingVj === false){
        showVJ();
      }
    }
  });
}
