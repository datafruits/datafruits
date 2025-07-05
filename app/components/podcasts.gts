//import { action } from '@ember/object';
//import { tracked } from '@glimmer/tracking';
import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
//import { hash } from 'rsvp';
//import { hash } from 'rsvp';
import Component from '@glimmer/component';
import t from "ember-intl/helpers/t";
import Search from "./podcasts/search.js";
import Await from "./await.js";
import formatMessageBody from "../helpers/format-message-body.js";
import Pagination from "fruits-ui/components/fruits-ui/pagination";
import PodcastTrack from "./podcast-track.js";

interface PodcastsArgs {
  labels: [any];
  query: any;
  page: number;
}

export default class PodcastsSearch extends Component<PodcastsArgs> {<template><div class="flex flex-wrap justify-around">
  <div id="search-controls">
    <h2 class="text-center">{{t "podcasts.search_title"}}</h2>
    <Search @labels={{@labels}} @selectedLabels={{this.selectedLabels}} @query={{this.router.currentRoute.queryParams.query}} />
  </div>
  <div id="subscribe-controls">
    <h2 class="text-center">{{t "podcasts.subscribe_title"}}</h2>
    <div id="podcast-subscribe">
      <div class="md:mx-10 md:my-5 md:py-5">
        <ul id="subscribe-links" class="pr-2 flex flex-wrap text-base sm:text-xl">
          <li>
            <a href="https://datafruits.streampusher.com/podcasts/datafruits.xml">
              {{t "podcasts.links.rss"}}
            </a>
          </li>
          <li>
            <a href="itpc://datafruits.streampusher.com/podcasts/datafruits.xml">
              {{t "podcasts.links.itunes"}}
            </a>
          </li>
          <li>
            <a href="overcast://datafruits.streampusher.com/podcasts/datafruits.xml">
              {{t "podcasts.links.overcast"}}
            </a>
          </li>
          <li>
            <a href="podcast://datafruits.streampusher.com/podcasts/datafruits.xml">
              {{t "podcasts.links.podcastsapp"}}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<Await @promise={{this.fetchPodcasts}}>
  <:pending>
    <p id="podcast-search-loading" class>
      {{t "loading"}}
    </p>
  </:pending>

  <:error>
    {{t "error"}}{{formatMessageBody ":sorrymustabeentheonionsaladdressing:"}}
  </:error>

  <:success as |result|>
    {{log "SUCCESS"}}
    {{log result}}
    <span>
    <Pagination @totalPages={{result.meta.total_pages}} @page={{@page}} @route="home.podcasts" />
    </span>
    <div class="p-2">
      {{#each result as |show|}}
        {{#if show.tracks.length}}
          {{log show.firstTrack}}
          <PodcastTrack @track={{show.firstTrack}} @show={{show}} @selectedLabels={{this.selectedLabels}} @search={{this.fetchPodcasts}} />
        {{/if}}
      {{else}}
        {{t "podcasts.no_result"}}
      {{/each}}
    </div>
    <Pagination @totalPages={{result.meta.total_pages}} @page={{@page}} @route="home.podcasts" />
  </:success>

</Await></template>
  @service declare store: Store;

  @service declare router: RouterService;

  get labelNames() {
    return this.args.labels.map(function (label) {
      return label.get('name');
    });
  }

  get selectedLabels() {
    const queryParams = this.router.currentRoute.queryParams;
    if (queryParams.tags) {
      return queryParams.tags.split(',');
    } else {
      return [];
    }
  }

  get fetchPodcasts() {
    const query = this.args.query;
    console.log('query: ', query);
    const podcastsPromise = this.store.query('podcast', query);
    return podcastsPromise;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PodcastsSearch: typeof PodcastsSearch;
  }
}
