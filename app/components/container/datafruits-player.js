import DatafruitsPlayer from '../datafruits-player';

export default DatafruitsPlayer.extend({
  track: null,
  didInsertElement(){
    if(this.get('track')){
      this.set('playingPodcast', true);
      this._super(...arguments);
      this.playTrack();
    }else{
      this._super(...arguments);
    }
  },
  playTrack(){
    const track = this.track;
    this.set('error', null);
    this.set('title', track.title);
    this.set('playTime', 0.0);

    let audioTag = document.getElementById("radio-player");
    audioTag.src = track.cdnUrl;
  }
});
