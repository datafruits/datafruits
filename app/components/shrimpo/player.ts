import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import EventBusService from 'datafruits13/services/event-bus';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface ShrimpoPlayerArgs {
  shrimpoEntry: ShrimpoEntry;
}

export default class ShrimpoPlayer extends Component<ShrimpoPlayerArgs> {
  @service declare eventBus: EventBusService;

  @tracked
  playing: boolean = false;

  @tracked
  paused: boolean = true;

  @action
  play() {
    this.playing = true;
    this.paused = false;
    this.eventBus.publish('trackPlayed', { title: this.args.shrimpoEntry.title, cdnUrl: this.args.shrimpoEntry.cdnUrl, id: this.args.shrimpoEntry.id, track_id: this.args.shrimpoEntry.id });
    //
  }

  @action
  pause() {
    this.playing = false;
    this.paused = true;
    this.eventBus.publish('trackPaused', this);
  }
}
