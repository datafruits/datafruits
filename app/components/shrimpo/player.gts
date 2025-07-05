import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import EventBusService from 'datafruits13/services/event-bus';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import Icon from "../ui/icon.js";

interface ShrimpoPlayerArgs {
  shrimpoEntry: ShrimpoEntry;
}

export default class ShrimpoPlayer extends Component<ShrimpoPlayerArgs> {<template><div class="mt-1 flex space-x-1">
  {{#if this.playing}}
    <a class="text-df-green hover:text-df-yellow text-xl" {{on "click" this.pause}} href="#">
      {{t "player.pause"}}
    </a>
  {{else}}
    <a class="text-df-green hover:text-df-yellow text-xl" {{on "click" this.play}} href="#">
      {{t "player.play"}}
    </a>
  {{/if}}
  <a href={{@shrimpoEntry.cdnUrl}} download>
    <Icon @name="download" class="fa fa-download text-df-green hover:text-df-yellow text-xl" />
  </a>
</div></template>
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
