import classic from 'ember-classic-decorator';
import DatafruitsPlayer from '../datafruits-player';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@classic
export default class _DatafruitsPlayer extends DatafruitsPlayer {
  @tracked playingPodcast = false;

  @action
  didInsert() {
    if (this.args.track) {
      this.playingPodcast = true;
      this.playTrack();
    }
  }

  playTrack() {
    const track = this.args.track;
    this.error = null;
    this.title = track.title;
    this.playTime = 0.0;

    let audioTag = document.getElementById('radio-player');
    audioTag.src = track.cdnUrl;
  }
}
