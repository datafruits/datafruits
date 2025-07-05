import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import { LinkTo } from "@ember/routing";
import { array } from "@ember/helper";
import formatDay from "../../helpers/format-day.js";
import t from "ember-intl/helpers/t";

interface MyShowsEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeCard extends Component<MyShowsEpisodeCardArgs> {<template><div class="mb-2">
  <LinkTo @route="home.shows.episode" @models={{array @episode.showSeriesSlug @episode.slug}} class="text-2xl">
    {{@episode.title}}
  </LinkTo>
  <div>
    <span>Date:</span> {{formatDay @episode.start}}
  </div>
  <div class="self-center w-full h-full mb-2">
    <LinkTo @route="home.shows.episode" @models={{array @episode.showSeriesSlug @episode.slug}} class="h-80 bg-center bg-cover block overflow-hidden rounded-xl" style="{{this.backgroundStyle}}">
    </LinkTo>
  </div>
  <div class="my-2">
    <div>
      <span>Status:</span> {{@episode.status}}
    </div>
  </div>
  <div class="my-2">
    <LinkTo @route="home.user.my-shows.episode" @models={{array @episode.showSeriesSlug @episode.slug}} class="text-2xl cool-button">
      {{t "profile.my-shows.edit"}}
    </LinkTo>
  </div>
</div></template>
  get backgroundStyle() {
    let image;
    const show = this.args.episode;
    if (show.imageUrl) {
      image = show.imageUrl;
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
    MyShowsEpisodeCard: typeof MyShowsEpisodeCard;
  }
}
