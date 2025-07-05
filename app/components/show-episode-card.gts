import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import { htmlSafe } from '@ember/template';
import { LinkTo } from "@ember/routing";
import { array } from "@ember/helper";

interface ShowEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class ShowEpisodeCard extends Component<ShowEpisodeCardArgs> {<template><div class="m-3 bg-df-blue-dark rounded-lg border-4 border-white w-full md:w-3/4 p-2 flex flex-col justify-between shadow-md">
  <LinkTo @route="home.shows.episode" @models={{array @episode.showSeriesSlug @episode.slug}} class="text-2xl">
    {{@episode.formattedEpisodeTitle}}
  </LinkTo>
  <div class="self-center w-full h-full">
    <LinkTo @route="home.shows.episode" @models={{array @episode.showSeriesSlug @episode.slug}} class="h-80 bg-center bg-cover block overflow-hidden rounded-xl" style="{{this.backgroundStyle}}">
    </LinkTo>
  </div>
  <div class="flex space-x-2">
    {{#each @episode.labels as |label|}}
      <a class="track-label
          text-df-yellow
          classic:bg-df-pink
          blm:bg-black
          hover:text-white
          p-1
          uppercase
          border-solid
          border-white
          border-2
          p-x-2
          font-extrabold" href="#">
        {{label.name}}
      </a>
    {{/each}}
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
