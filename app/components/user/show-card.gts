import Component from '@glimmer/component';
import type ShowSeriesModel from 'datafruits13/models/show-series';
import { LinkTo } from "@ember/routing";
import t from "ember-intl/helpers/t";

interface UserShowCardArgs {
  show: ShowSeriesModel;
}

 
export default class UserShowCard extends Component<UserShowCardArgs> {<template><section class="bg-df-pink p-4 my-4">
  <div class="mb-2">
    <h1>{{@show.title}}</h1>
    <img src={{@show.thumbImageUrl}} />
  </div>
  <div class="flex mb-2">
    <LinkTo @route="home.user.my-shows.edit" @model={{@show.slug}} class="cool-button mr-2">
      {{t "profile.my-shows.edit"}}
    </LinkTo>
    <LinkTo @route="home.user.my-shows.episodes" @model={{@show.slug}} class="cool-button">
      {{t "profile.my-shows.episodes"}}
    </LinkTo>
  </div>
  <div class="flex">
    <span class="uppercase font-bold">
      {{@show.status}}
    </span>
  </div>
</section></template>}
