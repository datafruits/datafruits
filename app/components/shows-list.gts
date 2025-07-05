import Component from '@glimmer/component';
import type ShowSeries from 'datafruits13/models/show-series';
import ShowCard from "../../embroider-pair-component/%2Fhome%2Ftony%2Fsrc%2Fdatafruits%2Fapp%2Ftemplates%2Fcomponents%2Fshow-card.gjs/__vpc__/%2Fhome%2Ftony%2Fsrc%2Fdatafruits%2Fapp%2Fcomponents%2Fshow-card.ts";

interface ShowsListArgs {
  shows: [ShowSeries];
}

export default class ShowsList extends Component<ShowsListArgs> {<template>{{#each this.filteredShows as |showSeries|}}
  <ShowCard @showSeries={{showSeries}} />
{{/each}}</template>
  get filteredShows() {
    return this.args.shows.filter((show: ShowSeries) => {
      return show.status !== "disabled" && !show.isNew;
    });
  }
}
