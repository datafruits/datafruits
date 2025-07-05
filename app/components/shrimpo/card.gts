/* eslint-disable-file ember/no-empty-glimmer-component-classes */
import Component from '@glimmer/component';
import type Shrimpo from 'datafruits13/models/shrimpo';
import { LinkTo } from "@ember/routing";
import eq from "ember-truth-helpers/helpers/equal";
import Countdown from "./countdown.gts";

interface ShrimpoCardArgs {
  shrimpo: Shrimpo;
}

export default class ShrimpoCard extends Component<ShrimpoCardArgs> {<template><LinkTo class="m-4 classic:bg-df-pink blm:bg-black rounded-lg border-4 border-white flex justify-between w-full p-2 shadow-md" @route="home.shrimpos.show" @model={{@shrimpo.slug}}>
  <div>
    <div>
      {{#if @shrimpo.coverArtUrl}}
        <img style="height: 6rem;" src={{@shrimpo.coverArtUrl}} />
      {{else}}
        <img src={{@shrimpo.user.avatarUrlOrDefault}} />
      {{/if}}
    </div>
    <div class="flex flex-col">
      <h2 class="text-xl">
        {{@shrimpo.title}}
      </h2>
      <div class="text-white">
        {{@shrimpo.entriesCount}} entries
      </div>
    </div>
  </div>
  <div>
    <div class="text-white font-bold">
      {{@shrimpo.translatedStatus}}
    </div>
    {{#if (eq @shrimpo.status "running")}}
      <Countdown @endAt={{@shrimpo.endAt}} />
    {{/if}}
    <div class="text-white">
      <span class="font-bold">Host:</span>
      {{@shrimpo.username}}
    </div>
  </div>
</LinkTo></template>}
