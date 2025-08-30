import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import EventBusService from 'datafruits13/services/event-bus';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackEventPayload, PlayerState } from '../../types/player';

interface ShrimpoPlayerArgs {
  shrimpoEntry: ShrimpoEntry;
}

export default class ShrimpoPlayer extends Component<ShrimpoPlayerArgs> {
  @service declare eventBus: EventBusService;

  @tracked
  playerState: PlayerState = PlayerState.Stopped;

  get playing(): boolean {
    return this.playerState === PlayerState.Playing;
  }

  get paused(): boolean {
    return this.playerState === PlayerState.Paused;
  }

  @action
  play(): void {
    this.playerState = PlayerState.Playing;
    const payload: TrackEventPayload = {
      title: this.args.shrimpoEntry.title,
      cdnUrl: this.args.shrimpoEntry.cdnUrl,
      id: this.args.shrimpoEntry.id,
      track_id: this.args.shrimpoEntry.id
    };
    this.eventBus.publish('trackPlayed', payload);
  }

  @action
  pause(): void {
    this.playerState = PlayerState.Paused;
    this.eventBus.publish('trackPaused', this);
  }
}
