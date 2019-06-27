import DatafruitsPlayer from '../datafruits-player';

export default DatafruitsPlayer.extend({
  track: null,
  didInsertElement(){
    this._super(...arguments);
    if(this.get('track')){
      this.playTrack();
    }
  },
  playTrack(){
    const track = this.track;
    this.set('error', null);
    this.set('title', track.title);
    this.set('playingPodcast', true);
    this.set('playTime', 0.0);

    let audioTag = document.getElementById("radio-player");
    audioTag.src = track.cdnUrl;
  }
});
