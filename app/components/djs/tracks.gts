import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import Dj from 'datafruits13/models/dj';
import Await from "../await.js";
import t from "ember-intl/helpers/t";
import PodcastTrack from "../podcast-track.js";
import Pagination from "fruits-ui/components/fruits-ui/pagination";

interface DjsTracksSignature {
  Args: {
    page: string;
    dj: Dj;
  };
}

export default class DjsTracks extends Component<DjsTracksSignature> {<template><Await @promise={{this.fetchTracks}}>
  <:pending>
    <p id="podcast-search-loading" class>
      {{t "loading"}}
    </p>
  </:pending>
  <:success as |result|>
    {{#each result as |show|}}
      {{#if show.tracks.length}}
        <PodcastTrack @track={{show.firstTrack}} @show={{show}} />
      {{/if}}
    {{/each}}
    <Pagination @totalPages={{result.meta.total_pages}} @page={{@page}} @route={{this.router.currentRouteName}} />
  </:success>

  <:error>
    {{t "error"}}
  </:error>
</Await></template>
  @service declare store: Store;
  @service declare router: RouterService;

  get fetchTracks() {
    return this.store.query('scheduled-show', { dj: this.args.dj.id, page: this.args.page });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DjsTracks: typeof DjsTracks;
  }
}
