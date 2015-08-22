import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
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
  //return String(string).replace(/[&<>"'\/]/g, function (s) {
  return String(string).replace(/[<>"']/g, function (s) {
    return entityMap[s];
  });
}

var imgRegex = /https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|gif|png)/;

function radioTitle(){
  var url = $('#radio-player').data('icecast-json').toString();
  console.log(url);

  $.get(url, function(data){
    var title = data.icestats.source[0].title;
    console.log(title);
    $('.jp-title').html(title);
  });
}

$(function(){
  var stream = {
    mp3: 'http://datafruits.streampusher.com:8000/datafruits.mp3',
    oga: 'http://datafruits.streampusher.com:8000/datafruits.ogg'
  };

  var playButtonClicked = false;
  $('#radio-player').jPlayer({
    ready: function () {
      $(this).jPlayer('setMedia', stream);
    },
    supplied: 'mp3, oga',
    wmode: 'window',
    playing: function(e) {
      $('.jp-loading').hide();
    },
    pause: function(e){
      $(this).jPlayer('clearMedia');
      $(this).jPlayer('setMedia', stream);
    },
    error: function(event) {
      console.log('jPlayer error: '+ event.jPlayer.error.type);

      if(playButtonClicked === true){
        $(this).jPlayer('setMedia', stream).jPlayer('play');
      }

      $('jp-pause').hide();
      $('jp-loading').hide();
    },
    waiting: function(e) {
      $('.jp-loading').show();
      $('.jp-play').hide();
      $('.jp-pause').hide();
    },
    loadeddata: function(e) {
      $('.jp-loading').hide();
    },
    solution: 'html, flash',
    cssSelectorAncestor: '#jp_container'
  });

  setTimeout(function(){
    radioTitle();
  }, 500);

  setInterval(function(){
    radioTitle();
  }, 10000);
});
