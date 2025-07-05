import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'datafruits13/services/current-user';
import { action } from '@ember/object';
import Await from "./await.js";
import t from "ember-intl/helpers/t";
import PodcastTrack from "./podcast-track.js";
import formatMessageBody from "../helpers/format-message-body.js";

export default class UserFavorites extends Component {<template><Await @promise={{this.fetchTracks}} as |await|>
  <await.Pending>
    <p id="podcast-search-loading" class>
      {{t "loading"}}
    </p>
  </await.Pending>

  <await.Fulfilled as |result|>
    {{#each result as |show|}}
      <PodcastTrack @track={{show.tracks.firstObject}} @show={{show}} @selectedLabels={{this.selectedLabels}} />
    {{/each}}
  </await.Fulfilled>

  <await.Rejected>
    {{t "error"}}{{formatMessageBody ":sorrymustabeentheonionsaladdressing:"}}
  </await.Rejected>
</Await></template>
  @service declare currentUser: CurrentUserService;
  @service declare store: any;

  @action
  fetchTracks() {
    const scheduledShowIds = this.currentUser.user.scheduledShowFavorites.map((scheduledShowFavorite: any) => {
      return scheduledShowFavorite.scheduledShowId;
    });
    console.log('track ids:' ,scheduledShowIds);
    return this.store.query('scheduledShow', { id: scheduledShowIds });
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserFavorites: typeof UserFavorites;
  }
}

