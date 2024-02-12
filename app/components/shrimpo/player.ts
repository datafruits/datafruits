import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { action } from '@ember/object';
//import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface ShrimpoPlayerArgs {
  shrimpoEntry: ShrimpoEntry;
}

export default class ShrimpoPlayer extends Component<ShrimpoPlayerArgs> {
  // @service
  // declare eventBus: any;

  @tracked
  playing: boolean = false;

  @tracked
  paused: boolean = true;

  @action
  play() {
    this.playing = true;
    this.paused = false;
    //this.eventBus.publish('trackPlayed', { title: this.args.shrimpoEntry.title, cdnUrl: this.args.shrimpoEntry.cdnUrl, id: this.args.shrimpoEntry.id });
    //
  }

  @action
  pause() {
    this.playing = false;
    this.paused = true;
    //this.eventBus.publish('trackPaused', this);
  }
}
