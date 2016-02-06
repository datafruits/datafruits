import Ember from 'ember';

export default Ember.Component.extend({
  _initialize: Ember.on('init', function(){
    this.get("eventBus").subscribe("trackPlayed", this, "onTrackPlayed");
  }),
  pollRadioTitle: function() {
    var _this = this;
    Ember.run.later(function() {
      _this.setRadioTitle();
      _this.pollRadioTitle();
    }, 10000);
  },
  setRadioTitle: function(){
    if(!this.get('playingPodcast')){
      var url = $('#radio-player').data('icecast-json').toString();

      $.get(url, function(data){
        var title = data.icestats.source[0].title;
        $('.jp-title').html(title);
      });
    }
  },
  onTrackPlayed: function(track){
    $('.jp-title').html(track.title);
    this.set('playingPodcast', true);
  },
  actions: {
    playLiveStream: function(){
      Ember.$("#radio-player").jPlayer("setMedia", this.stream);
      Ember.$("#radio-player").jPlayer("play");
      this.set('playingPodcast', false);
      this.setRadioTitle();
    },
  },
  classNames: ['radio-bar'],
  classNameBindings: ['playingPodcast'],
  playingPodcast: false,
  eventBus: Ember.inject.service(),
  setup: function(){
    var _this = this;
    this.stream = {
      mp3: 'http://datafruits.streampusher.com:8000/datafruits.mp3',
      oga: 'http://datafruits.streampusher.com:8000/datafruits.ogg'
    };

    var playTry = false;
    $('#radio-player').jPlayer({
      ready: function () {
        $(this).jPlayer('setMedia', _this.stream).jPlayer("play");
        playTry = true;
      },
      supplied: 'mp3, oga',
      wmode: 'window',
      playing: function(e) {
        $('.jp-loading').hide();
      },
      pause: function(e) {
        if (_this.get('playingPodcast') === false) {
          $(this).jPlayer("clearMedia");
          $(this).jPlayer("setMedia", _this.stream);
        }
      },
      error: function(event) {
        console.log('jPlayer error: '+ event.jPlayer.error.type);

        $('jp-pause').hide();
        $('jp-loading').hide();

        if(playTry === true){
          $(this).jPlayer('setMedia', _this.stream).jPlayer('play');
        }
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
    this.setRadioTitle();
    this.pollRadioTitle();

  }.on('didInsertElement')
});
