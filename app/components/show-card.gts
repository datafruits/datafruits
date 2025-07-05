import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import type ShowSeriesModel from 'datafruits13/models/show-series';
import { LinkTo } from "@ember/routing";
import TrackLabel from "./track-label.gts";

interface ShowCardArgs {
  showSeries: ShowSeriesModel;
}

export default class ShowCardComponent extends Component<ShowCardArgs> {<template><div class="m-3 bg-df-blue-dark rounded-lg border-4 border-white w-full md:w-1/4 p-2 flex flex-col justify-between shadow-md">
  <LinkTo @route="home.show" @model={{@showSeries.slug}} class="text-2xl">
    {{@showSeries.title}}
  </LinkTo>
  <div class="self-center w-full h-full">
    <LinkTo @route="home.show" @model={{@showSeries.slug}} class="h-80 bg-center bg-cover block overflow-hidden rounded-xl" style="{{this.backgroundStyle}}">
    </LinkTo>
  </div>
  <div class="mt-2">
    {{#each @showSeries.users as |user|}}
      <div>
        <img class="inline rounded-lg" style="height: 2rem;" src="{{user.avatarUrlOrDefault}}" align="center" alt={{user.username}}>
        <LinkTo @route="home.dj" @model={{user.username}}>
          {{user.username}}
        </LinkTo>
      </div>
    {{/each}}
  </div>
  <div class="p-2">
    {{#each @showSeries.labels as |label|}}
      <TrackLabel @label={{label}} />
    {{/each}}
  </div>
</div></template>
  get backgroundStyle() {
    let image;
    const show = this.args.showSeries;
    if (show.thumbImageUrl) {
      image = show.thumbImageUrl;
    // } else if (show.isGuest) {
    //   image = '/assets/images/show_placeholder.jpg';
    // } else if (show.host && show.host.imageUrl) {
    //   image = show.host.imageUrl;
    } else {
      image = '/assets/images/show_placeholder.jpg';
    }
    return htmlSafe(`background-image: url('${image}');`);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ShowCardComponent: typeof ShowCardComponent;
  }
}

