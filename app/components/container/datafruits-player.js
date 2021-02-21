import classic from 'ember-classic-decorator';
import DatafruitsPlayer from '../datafruits-player';

@classic
export default class _DatafruitsPlayer extends DatafruitsPlayer {
  track = null;

  didInsertElement() {
    if (this.track) {
      this.set('playingPodcast', true);
      super.didInsertElement(...arguments);
      this.playTrack();
    } else {
      super.didInsertElement(...arguments);
    }
  }

  playTrack() {
    const track = this.track;
    this.set('error', null);
    this.set('title', track.title);
    this.set('playTime', 0.0);

    let audioTag = document.getElementById('radio-player');
    audioTag.src = track.cdnUrl;
  }
}
