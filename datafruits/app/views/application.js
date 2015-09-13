import Ember from 'ember';

function radioTitle(){
  var url = $('#radio-player').data('icecast-json').toString();
  console.log(url);

  $.get(url, function(data){
    var title = data.icestats.source[0].title;
    console.log(title);
    $('.jp-title').html(title);
  });
}

export default Ember.View.extend({
  setup: function(){
    console.log("setting up jPlayer");
    var stream = {
      mp3: 'http://datafruits.streampusher.com:8000/datafruits.mp3',
      oga: 'http://datafruits.streampusher.com:8000/datafruits.ogg'
    };

    var playButtonClicked = false;
    $('#radio-player').jPlayer({
      ready: function () {
        $(this).jPlayer('setMedia', stream).jPlayer("play");
      },
      supplied: 'mp3, oga',
      wmode: 'window',
      playing: function(e) {
        $('.jp-loading').hide();
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
  }.on('didInsertElement')
});
