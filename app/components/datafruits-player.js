import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, run } from '@ember/runloop';
import $ from 'jquery';
import { jPlayer } from 'jplayer';

export default Component.extend({
  title: "",
  init(){
    this.get("eventBus").subscribe("trackPlayed", this, "onTrackPlayed");
    this._super(...arguments);
  },
  isLive: computed('title', function(){
    return this.get('title').startsWith("LIVE");
  }),
  pollRadioTitle() {
    let _this = this;
    later(function() {
      _this.setRadioTitle();
      _this.pollRadioTitle();
    }, 10000);
  },
  setRadioTitle() {
    if(!this.get('playingPodcast')){
      let url = $('#radio-player').data('icecast-json').toString();

      $.get(url).done((data) => {
        let datafruits = data.icestats.source.find((s) => {
          return s.server_name == "datafruits.ogg";
        });
        let title = datafruits.title;
        if(title.substring(0, 3) === " - "){
          title = title.slice(3);
        }
        run(() => {
          this.set('error', null);
          this.set('title', title);
        });
      }).fail((data, textStatus) => {
        console.log(data);
        console.log(textStatus);
      });
    }
  },
  onTrackPlayed(track){
    this.set('error', null);
    this.set('title', track.title);
    this.set('playingPodcast', true);
  },
  actions: {
    playLiveStream: function(){
      $("#radio-player").jPlayer("setMedia", this.stream);
      $("#radio-player").jPlayer("play");
      this.set('playingPodcast', false);
      this.setRadioTitle();
    },
  },
  classNames: ['radio-bar'],
  classNameBindings: ['playingPodcast', 'isLive'],
  playingPodcast: false,
  eventBus: service(),
  didInsertElement(){
    let _this = this;
    this.stream = {
      mp3: 'https://streampusher-relay.club/datafruits.mp3',
      oga: 'https://streampusher-relay.club/datafruits.ogg'
    };

    let playTry = false;
    $('#radio-player').jPlayer({
      ready: function () {
        $(this).jPlayer('setMedia', _this.stream).jPlayer("play");
        playTry = true;
      },
      supplied: 'mp3, oga',
      wmode: 'window',
      playing: function() {
        $('.jp-loading').hide();
      },
      pause: function() {
        if (_this.get('playingPodcast') === false) {
          $(this).jPlayer("clearMedia");
          $(this).jPlayer("setMedia", _this.stream);
        }
      },
      error: function(/*event*/) {
        /*console.log('jPlayer error: '+ event.jPlayer.error.type);*/
        _this.set('error', "There was an error playing the stream. Trying again in a second...");

        $('jp-pause').hide();
        $('jp-loading').hide();

        if(playTry === true){
          $(this).jPlayer('setMedia', _this.stream).jPlayer('play');
        }
      },
      waiting: function() {
        $('.jp-loading').show();
        $('.jp-play').hide();
        $('.jp-pause').hide();
      },
      loadeddata: function() {
        $('.jp-loading').hide();
      },
      solution: 'html, flash',
      cssSelectorAncestor: ""
    });
    this.setRadioTitle();
    this.pollRadioTitle();
  },
  didRender(){
    $("#radio-player").jPlayer("option", "cssSelector.seekBar", ".jp-seek-bar");
    $("#radio-player").jPlayer("option", "cssSelector.playBar", ".jp-play-bar");
  }
});
