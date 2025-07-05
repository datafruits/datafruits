import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import Icon from "./ui/icon.js";
import { LinkTo } from "@ember/routing";
import { array } from "@ember/helper";
import TrackLabel from "./track-label.gts";

export default class PodcastTrack extends Component {<template><div class="bg-df-pink text-2xl rounded-lg sm:py-1 flex justify-between space-x-1 text-xs sm:text-xl mb-2 p-2">
  <div class="flex flex-wrap items-center gap-0.5 sm:gap-1.5">
    <div class="mt-1 flex space-x-1">
      {{#if this.playing}}
        <a class="text-df-green hover:text-df-yellow text-xl" {{on "click" this.pause}} href="#">
          {{t "player.pause"}}
        </a>
      {{else}}
        <a class="text-df-green hover:text-df-yellow text-xl" {{on "click" this.play}} href="#">
          {{t "player.play"}}
        </a>
      {{/if}}
      <a href={{@track.cdnUrl}} download>
        <Icon @name="download" class="fa fa-download text-df-green hover:text-df-yellow text-xl" />
      </a>
      {{#if @show.youtubeLink}}
        <a href={{@show.youtubeLink}} target="_blank" rel="noreferrer noopener">
          <Icon @name="youtube" class="text-df-green hover:text-df-yellow text-xl" />
        </a>
      {{/if}}
      {{#if @show.mixcloudLink}}
        <a href={{@show.mixcloudLink}} target="_blank" rel="noreferrer noopener">
          <Icon @name="mixcloud" class="text-df-green hover:text-df-yellow text-xl" />
        </a>
      {{/if}}
      {{#if @show.soundcloudLink}}
        <a href={{@show.soundcloudLink}} target="_blank" rel="noreferrer noopener">
          <Icon @name="soundcloud" class="text-df-green hover:text-df-yellow text-xl" />
        </a>
      {{/if}}
      {{#if this.session.isAuthenticated}}
        {{#if this.isFavorited}}
          <button class="cool-button favorited max-h-8" type="button" aria-label="Remove From Favorites" title="Remove From Favorites" {{on "click" this.unfavoriteTrack}}>
            <Icon @name="heart" />
          </button>
        {{else}}
          <button class="cool-button not-favorited max-h-8" type="button" aria-label="Add To Favorites" title="Add To Favorites" {{on "click" this.favoriteTrack}}>
            <Icon @name="heart" />
          </button>
        {{/if}}
      {{/if}}
    </div>
    <div class="mt-1 flex flex-wrap items-center gap-0.5 sm:gap-1.5">
      <div>
        <LinkTo @route="home.shows.episode" @models={{array @show.showSeriesSlug @show.slug}}>
          {{@show.formattedEpisodeTitle}}
        </LinkTo>
        <span class="text-sm">
          {{@show.formattedDate}}
        </span>
      </div>
      {{#each @show.labels as |label|}}
        <TrackLabel @label={{label}} />
      {{/each}}
    </div>
  </div>
  <div class="w-1/2 bg-center bg-cover block overflow-hidden rounded-xl" style="{{this.backgroundStyle}}">
  </div>
  <div>
    {{#each @show.djs as |host|}}
      <span class="text-sm mr-2 font-cursive">
        <LinkTo @route="home.dj" @model={{host.username}}>
          {{host.username}}
        </LinkTo>
      </span>
      <span>
        <img style="height: 3rem;" class="inline rounded-lg" src="{{host.avatarUrl}}" />
      </span>
    {{/each}}
  </div>
</div></template>
  constructor(owner, args) {
    super(owner, args);
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
  }

  @service
  eventBus;

  @service
  router;

  @service
  currentUser;

  @service
  session;

  @service
  store;

  @tracked
  playing;

  @action
  play() {
    this.playing = true;
    this.paused = false;
    this.eventBus.publish('trackPlayed', { title: this.args.show.formattedEpisodeTitle, cdnUrl: this.args.track.cdnUrl, id: this.args.show.id, track_id: this.args.track.id });
    //
  }

  @action
  pause() {
    this.playing = false;
    this.paused = true;
    this.eventBus.publish('trackPaused', this);
  }

  @action
  selectLabel(label) {
    let tags = this.args.selectedLabels;
    tags.push(label);
    const queryParams = { tags: tags, query: this.router.currentRoute.queryParams.query };
    this.router.transitionTo({ queryParams: queryParams });
    debounce(this, this.args.search, 400);
  }

  onTrackPlayed(event) {
    if (this !== event) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playing = false;
      }
    }
  }

  @action
  favoriteTrack() {
    let trackFavorite = this.store.createRecord('trackFavorite', {
      track: this.args.track,
    });
    trackFavorite
      .save()
      .then(() => {
        this.currentUser.user.trackFavorites.push(trackFavorite);
        console.log('faved ya ');
      })
      .catch((error) => {
        console.log(`oh no error: ${error}`);
      });
  }

  @action
  unfavoriteTrack() {
    let trackFavorite = this.currentUser.user.trackFavorites.find((trackFavorite) => {
      return trackFavorite.trackId === parseInt(this.args.track.get('id'));
    });
    trackFavorite
      .destroyRecord()
      .then(() => {
        console.log('unfaved ya ');
      })
      .catch((error) => {
        console.log(`oh no error: ${error}`);
      });
  }

  get isFavorited() {
    const id = this.args.show.id;

    return this.currentUser.user.scheduledShowFavorites.map((favorite) => favorite.scheduledShowId).includes(parseInt(id));
  }

  get backgroundStyle() {
    let image;
    const show = this.args.show;
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
