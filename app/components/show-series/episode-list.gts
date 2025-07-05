import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type ShowSeries from 'datafruits13/models/show-series';
import Store from '@ember-data/store';
import Await from "../await.js";
import ShowEpisodeCard from "../show-episode-card.gts";
import Pagination from "fruits-ui/components/fruits-ui/pagination";

interface ShowSeriesEpisodeListArgs {
  showSeries: ShowSeries;
  page: number;
}

export default class ShowSeriesEpisodeList extends Component<ShowSeriesEpisodeListArgs> {<template><Await @promise={{this.fetchEpisodes}}>
  <:pending>
    Loading episodes...
  </:pending>

  <:success as |episodes|>
    {{#each episodes as |episode|}}
      <ShowEpisodeCard @episode={{episode}} />
    {{/each}}
    <Pagination @totalPages={{episodes.meta.total_pages}} @page={{@page}} @route="home.show" />
  </:success>

  <:error>
    Something went wrong :(
  </:error>
</Await></template>
  @service declare store: Store;

  get fetchEpisodes() {
    return this.store.query('scheduled-show',
                            { showSeries: this.args.showSeries.slug,
                              status: 'archive_published',
                              page: this.args.page
                            });
  }
}
